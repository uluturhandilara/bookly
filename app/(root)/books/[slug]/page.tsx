import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MicOff, Mic } from "lucide-react";
import { getBookBySlug } from "@/lib/actions/book.actions";

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { slug } = await params;
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect("/");
  }

  const book = result.data;
  const { title, author, coverURL, persona } = book;
  const voiceLabel = persona || "Default";
  const coverSrc = coverURL || "/assets/book.png";

  return (
    <div className="book-page-container">
      <Link
        href="/"
        className="back-btn-floating"
        aria-label="Back to library"
      >
        <ArrowLeft className="size-6 text-[var(--text-primary)]" />
      </Link>

      <div className="wrapper mx-auto w-full flex flex-col gap-6">
        {/* 1. Header card */}
        <section className="vapi-header-card">
          <div className="flex items-center gap-6">
            {/* Left: cover + overlapping mic button */}
            <div className="vapi-cover-wrapper shrink-0">
              <div className="relative w-[120px]">
                <Image
                  src={coverSrc}
                  alt={title}
                  width={140}
                  height={160}
                  className="vapi-cover-image w-[120px] h-[180px] rounded-lg object-cover"
                />
                <div className="vapi-mic-wrapper">
                  <button
                    type="button"
                    className="vapi-mic-btn size-[60px] w-[60px] h-[60px]"
                    aria-label="Microphone off"
                  >
                    <MicOff className="size-6 text-[#212a3b]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: title, author, badges */}
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#212a3b] leading-tight">
                {title}
              </h1>
              <p className="text-sm text-[#3d485e]">by {author}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="vapi-status-indicator">
                  <span className="vapi-status-dot vapi-status-dot-ready" />
                  <span className="vapi-status-text">Ready</span>
                </span>
                <span className="vapi-badge-ai">
                  <span className="vapi-badge-ai-text">
                    Voice: {voiceLabel}
                  </span>
                </span>
                <span className="vapi-badge-ai">
                  <span className="vapi-badge-ai-text">0:00/15:00</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Transcript area */}
        <section className="transcript-container min-h-[400px] rounded-xl">
          <div className="transcript-empty min-h-[400px]">
            <Mic className="size-12 text-[var(--text-muted)] mb-3" />
            <p className="transcript-empty-text">No conversation yet</p>
            <p className="transcript-empty-hint">
              Click the mic button above to start talking
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
