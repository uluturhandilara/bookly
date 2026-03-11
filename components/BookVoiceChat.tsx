"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import type {
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from "@/types/speech-recognition";

type VoiceStatus = "idle" | "connecting" | "listening" | "speaking";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface BookVoiceChatProps {
  slug: string;
  bookTitle: string;
  bookAuthor: string;
  coverSrc: string;
  voiceLabel: string;
}

const MAX_SESSION_SECONDS = 5 * 60;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getSpeechRecognition(): Window["SpeechRecognition"] | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

export default function BookVoiceChat({
  slug,
  bookTitle,
  bookAuthor,
  coverSrc,
  voiceLabel,
}: BookVoiceChatProps) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const recognitionRef = useRef<{ stop(): void; abort(): void } | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restartListeningRef = useRef(false);

  const isActive = status !== "idle";

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const load = () => window.speechSynthesis.getVoices();
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (!isActive) return;
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev >= MAX_SESSION_SECONDS) return prev;
        return prev + 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const stopRecognition = useCallback(() => {
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
        rec.abort();
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
      recognitionRef.current = null;
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const en = voices.find((v) => v.lang.startsWith("en"));
    if (en) u.voice = en;
    synthesisRef.current = window.speechSynthesis;
    u.onend = () => {
      setStatus((s) => {
        if (s === "speaking") {
          restartListeningRef.current = true;
          return "listening";
        }
        return s;
      });
    };
    window.speechSynthesis.speak(u);
  }, []);

  const startRecognition = useCallback(() => {
    if (elapsedSeconds >= MAX_SESSION_SECONDS) return;
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setStatus("idle");
      return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => setStatus("listening");
    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        setStatus("idle");
      }
    };
    rec.onend = () => {
      recognitionRef.current = null;
    };
    rec.onresult = async (event: SpeechRecognitionEvent) => {
      const results = event.results;
      let finalTranscript = "";
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }
      finalTranscript = finalTranscript.trim();
      if (!finalTranscript) {
        setStatus("listening");
        return;
      }

      setMessages((m) => [...m, { role: "user", content: finalTranscript }]);
      setStatus("connecting");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: finalTranscript, slug }),
        });
        const data = await res.json();
        const assistantText = res.ok
          ? (data?.text ?? "Sorry, I couldn't process that.")
          : (data?.error ?? "Something went wrong. Please try again.");
        setMessages((m) => [
          ...m,
          { role: "assistant", content: assistantText },
        ]);
        setStatus("speaking");
        speak(assistantText);
      } catch {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: "Something went wrong. Please try again.",
          },
        ]);
        setStatus("listening");
      }
    };

    recognitionRef.current = rec;
    setStatus("connecting");
    try {
      rec.start();
    } catch {
      setStatus("idle");
    }
  }, [slug, elapsedSeconds, speak]);

  const toggleMic = useCallback(() => {
    if (status === "idle") {
      startRecognition();
    } else {
      stopRecognition();
      if (status === "speaking") window.speechSynthesis?.cancel();
      setStatus("idle");
    }
  }, [status, startRecognition, stopRecognition]);

  useEffect(() => {
    if (
      status === "listening" &&
      restartListeningRef.current &&
      elapsedSeconds < MAX_SESSION_SECONDS
    ) {
      restartListeningRef.current = false;
      const t = setTimeout(() => startRecognition(), 400);
      return () => clearTimeout(t);
    }
  }, [status, elapsedSeconds, startRecognition]);

  const statusLabel =
    status === "idle"
      ? "Ready"
      : status === "connecting"
        ? "Connecting..."
        : status === "listening"
          ? "Listening"
          : "Speaking";

  const statusDotClass =
    status === "idle"
      ? "vapi-status-dot-ready"
      : status === "connecting"
        ? "vapi-status-dot-connecting"
        : status === "listening"
          ? "vapi-status-dot-listening"
          : "vapi-status-dot-speaking";

  return (
    <div className="book-page-container">
      <Link href="/" className="back-btn-floating" aria-label="Back to library">
        <ArrowLeft className="size-6 text-[var(--text-primary)]" />
      </Link>

      <div className="mx-auto w-full flex flex-col gap-6">
        <section className="vapi-header-card">
          <div className="flex items-center gap-6">
            <div className="vapi-cover-wrapper shrink-0">
              <div className="relative w-[120px]">
                <Image
                  src={coverSrc}
                  alt={bookTitle}
                  width={120}
                  height={180}
                  className="vapi-cover-image w-[120px] h-[180px] rounded-lg object-cover"
                />
                <div className="vapi-mic-wrapper">
                  <button
                    type="button"
                    className={`vapi-mic-btn size-[60px] w-[60px] h-[60px] ${status !== "idle" ? "vapi-mic-btn-active" : "vapi-mic-btn-inactive"}`}
                    onClick={toggleMic}
                    disabled={elapsedSeconds >= MAX_SESSION_SECONDS}
                    aria-label={
                      status === "idle" ? "Start microphone" : "Stop microphone"
                    }
                  >
                    {status === "idle" ? (
                      <MicOff className="size-6 text-[#212a3b]" />
                    ) : (
                      <Mic className="size-6 text-[#212a3b]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-0 flex-1">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#212a3b] leading-tight">
                {bookTitle}
              </h1>
              <p className="text-sm text-[#3d485e]">by {bookAuthor}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="vapi-status-indicator">
                  <span className={`vapi-status-dot ${statusDotClass}`} />
                  <span className="vapi-status-text">{statusLabel}</span>
                </span>
                <span className="vapi-badge-ai">
                  <span className="vapi-badge-ai-text">
                    Voice: {voiceLabel}
                  </span>
                </span>
                <span className="vapi-badge-ai">
                  <span className="vapi-badge-ai-text">
                    {formatTime(elapsedSeconds)}/
                    {formatTime(MAX_SESSION_SECONDS)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="transcript-container min-h-[400px] rounded-xl flex flex-col">
          {messages.length === 0 ? (
            <div className="transcript-empty min-h-[400px]">
              <Mic className="size-12 text-[var(--text-muted)] mb-3" />
              <p className="transcript-empty-text">No conversation yet</p>
              <p className="transcript-empty-hint">
                Click the mic button above to start talking
              </p>
            </div>
          ) : (
            <div className="transcript-messages flex-1 min-h-0">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`transcript-message ${
                    msg.role === "user"
                      ? "transcript-message-user"
                      : "transcript-message-assistant"
                  }`}
                >
                  <div
                    className={
                      msg.role === "user"
                        ? "transcript-bubble transcript-bubble-user"
                        : "transcript-bubble transcript-bubble-assistant"
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
