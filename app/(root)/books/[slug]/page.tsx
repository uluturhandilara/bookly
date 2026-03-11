import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBookBySlug } from "@/lib/actions/book.actions";
import BookVoiceChat from "@/components/BookVoiceChat";

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent(`/books/${slug}`)}`);
  }
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect("/");
  }

  const book = result.data;
  const { title, author, coverURL, persona } = book;
  const voiceLabel = persona || "Default";
  const coverSrc = coverURL || "/assets/book.png";

  return (
    <BookVoiceChat
      slug={slug}
      bookTitle={title}
      bookAuthor={author}
      coverSrc={coverSrc}
      voiceLabel={voiceLabel}
    />
  );
}
