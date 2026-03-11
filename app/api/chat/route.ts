import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getBookBySlug } from "@/lib/actions/book.actions";

const BOOKLY_GROQ_API_KEY = process.env.BOOKLY_API_KEY?.trim();
const MAX_MESSAGE_LENGTH = 500;

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { message, slug } = body as { message?: string; slug?: string };

    if (
      !message ||
      typeof message !== "string" ||
      !slug ||
      typeof slug !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid message and slug" },
        { status: 400 },
      );
    }

    const trimmed = message.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!trimmed) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 },
      );
    }

    const bookResult = await getBookBySlug(slug);
    if (!bookResult.success || !bookResult.data) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const { title, author } = bookResult.data;

    if (!BOOKLY_GROQ_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Groq API key not configured. Add GROQ_API_KEY to .env.local (get free key at console.groq.com)",
        },
        { status: 503 },
      );
    }

    const systemPrompt = `You are a friendly, knowledgeable assistant discussing the book "${title}" by ${author}. Answer the user's questions about the book in a conversational way. If they haven't read it yet, you can summarize or ask what they'd like to know. Keep responses concise (2-4 sentences) so they work well with voice.`;

    const response = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BOOKLY_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: trimmed },
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", response.status, errText);
      let userMessage = "Failed to get AI response.";
      try {
        const errJson = JSON.parse(errText) as { error?: { message?: string } };
        if (errJson?.error?.message) {
          userMessage = errJson.error.message;
        }
      } catch (error) {
        console.error("Error parsing error JSON:", error);
      }
      return NextResponse.json({ error: userMessage }, { status: 502 });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I'm not sure how to respond to that. Could you try again?";

    return NextResponse.json({ text });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
