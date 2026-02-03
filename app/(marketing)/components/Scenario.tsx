import { Button } from "@/components/ui/button";
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
    <main
      className={`
        min-h-screen flex flex-col items-center justify-center 
        p-6 md:p-12 lg:p-20 transition-colors duration-500
        lg:${iseven ? "flex-row-reverse" : "flex-row"} 
        ${
          iseven
            ? "bg-transparent text-slate-900"
            : "bg-gradient-to-r from-amber-400 to-amber-500 text-white"
        }
      `}
    >
      {/* Image Container */}
      <section className="w-full lg:w-1/2 flex justify-center">
        <div className="relative w-full aspect-[4/3] max-w-2xl overflow-hidden  shadow-2xl">
          <Image
            src={imageUrl || "/avatars/avatar_0.jpg"}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Text Content */}
      <section
        className={`w-full lg:w-1/2 flex flex-col justify-center mt-10 lg:mt-0 
          ${iseven ? "lg:pr-16 lg:text-right" : "lg:pl-16 lg:text-left"}
        `}
      >
        <h2
          className={`text-5xl md:text-6xl lg:text-7xl tracking-tight 
                          bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-transparent
                          font-display  mb-6 
          
        `}
        >
          {title}
        </h2>

        <p
          className={`text-xl md:text-2xl leading-relaxed
          text-white/80
        `}
        >
          {message}
        </p>

        <div
          className={`mt-8 flex ${iseven ? "lg:justify-end" : "lg:justify-start"}`}
        >
          <Button
            asChild
            size="lg"
            className={`shadow-lg transition-all duration-300 hover:scale-105
              ${
                iseven
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-white text-amber-600 hover:bg-slate-100"
              }
            `}
          >
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
