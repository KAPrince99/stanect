import { Sparkle } from "lucide-react";
import React from "react";

export default function Testimonials() {
  return (
    <section className="mt-5 relative bg-transparent">
      <div>
        <div className="flex flex-col justify-center items-center ">
          <div className="flex justify gap-2 items-center pl-2 py-1 border border-stone-50/10 rounded-3xl w-[150px]">
            <Sparkle className="w-4 h-4 text-orange-400" />
            <span className="  text-sm md:text-md font-inter">
              Testimonials
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl mt-3 md:mt-5">
            Loved By Introverts
          </h1>
        </div>
      </div>
    </section>
  );
}
