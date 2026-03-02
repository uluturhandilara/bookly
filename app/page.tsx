import HeroSection from "@/components/HeroSection";
import BookCard from "@/components/BookCard";
import { sampleBooks } from "@/lib/constants";

export default function Page() {
  return (
    <div className="wrapper container mx-auto w-full">
      <HeroSection />

      <div className="library-books-grid">
        {sampleBooks.map((book) => (
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
