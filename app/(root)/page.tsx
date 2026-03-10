import HeroSection from "@/components/HeroSection";
import BookCard from "@/components/BookCard";

import { getAllBooks } from "@/lib/actions/book.actions";

export default async function Page() {
  const bookResults = await getAllBooks();
  const books = bookResults.success ? (bookResults.data ?? []) : [];

  return (
    <div className="wrapper container mx-auto w-full">
      <HeroSection />

      {!bookResults.success && (
        <p className="text-center text-red-600 py-4">
          Books could not be loaded. Please check your connection.
        </p>
      )}

      <div className="library-books-grid">
        {books.map((book) => (
          <BookCard
            key={book._id}
            title={book.title}
            author={book.author}
            coverURL={book.coverURL}
            slug={book.slug}
          />
        ))}
      </div>
    </div>
  );
}
