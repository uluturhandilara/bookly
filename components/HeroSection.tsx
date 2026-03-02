import Link from "next/link";
import Image from "next/image";

const steps = [
  {
    number: 1,
    title: "Add your books",
    description: "Upload PDFs to build your personal library.",
  },
  {
    number: 2,
    title: "Organize & browse",
    description: "Search and filter your collection with ease.",
  },
  {
    number: 3,
    title: "Chat with AI",
    description: "Ask questions and get insights from your books.",
  },
];

export default function HeroSection() {
  const illustrationSrc =
    "/assets/Gemini_Generated_Image_jlix6fjlix6fjlix%20(1)%201.png";

  return (
    <section className="library-hero-card wrapper mb-10 md:mb-16">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 w-full">
        <div className="library-hero-text flex-1 min-w-0">
          <h1 className="library-hero-title">Your library</h1>
          <p className="library-hero-description">
            Keep all your books in one place. Upload PDFs, organize your
            collection, and chat with AI to get more from what you read.
          </p>
          <Link href="/books/new" className="library-cta-primary">
            Add new book
          </Link>
        </div>

        <div className="library-hero-illustration flex-1 min-w-0 max-w-[420px] lg:max-w-none">
          <div className="relative w-full aspect-[4/3] max-h-[220px] flex items-center justify-center">
            <Image
              src={illustrationSrc}
              alt="Vintage books and globe illustration"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 420px"
            />
          </div>
        </div>
        <div className="library-hero-illustration-desktop flex-1 min-w-0 max-w-[420px]">
          <div className="relative w-full aspect-[4/3] max-h-[280px] flex items-center justify-center">
            <Image
              src={illustrationSrc}
              alt="Vintage books and globe illustration"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 420px"
            />
          </div>
        </div>

        <div className="library-steps-card flex-shrink-0 w-full lg:w-auto lg:min-w-[240px] shadow-soft">
          <ul className="space-y-4 list-none p-0 m-0">
            {steps.map((step) => (
              <li key={step.number} className="library-step-item">
                <span className="library-step-number">{step.number}</span>
                <div>
                  <p className="library-step-title">{step.title}</p>
                  <p className="library-step-description">{step.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
