import { Button } from "@/components/ui/button";
import LordIcon from "@/components/ui/lordIcon";
import Image from "next/image";
import Link from "next/link";

interface ScenarioProps {
  scenario: {
    id: number;
    title: string;
    message: string;
    imageUrl: string;
  };
}

export default function Scenario({ scenario }: ScenarioProps) {
  const { id, title, message, imageUrl } = scenario;
  const iseven = id % 2 === 0;

  return (
    <article
      className={`
        min-h-screen flex flex-col items-center justify-center 
        p-6 md:p-12 lg:p-20 transition-colors duration-500 text-white
      `}
    >
      <div
        className={`flex flex-col items-center justify-center w-full max-w-7xl gap-10 lg:gap-0 
          ${iseven ? "lg:flex-row-reverse" : "lg:flex-row"} 
        `}
      >
        <section className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-full aspect-3/3 max-w-2xl overflow-hidden shadow-2xl rounded-3xl border border-white/10">
            <Image
              src={imageUrl || "/avatars/avatar_0.jpg"}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        <section
          className={`w-full lg:w-1/2 flex flex-col justify-center mt-10 lg:mt-0 
            ${iseven ? "lg:pr-16 lg:text-right" : "lg:pl-16 lg:text-left"}
          `}
        >
          <h2
            className={`text-5xl md:text-6xl lg:text-7xl tracking-tight 
                        bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-transparent
                        font-display mb-6`}
          >
            {title}
          </h2>

          <p className="text-xl md:text-2xl leading-relaxed text-white/80">
            {message}
          </p>

          <div
            className={`mt-8 flex items-center ${
              iseven ? "lg:justify-end" : "lg:justify-start"
            } justify-center md:justify-start`}
          >
            <Button
              size="lg"
              className="min-w-40 bg-linear-to-r from-amber-400 to-amber-500 text-black hover:from-amber-500 hover:to-amber-600 shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Link href="/dashboard">Get Started</Link>
              <LordIcon
                src="https://cdn.lordicon.com/jarmuava.json"
                trigger="loop"
                colors="primary:#000000"
                height={20}
                width={20}
              />
            </Button>
          </div>
        </section>
      </div>
    </article>
  );
}
