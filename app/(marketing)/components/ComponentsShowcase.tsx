"use client";

import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import MaskedDiv from "@/components/ui/masked-div";
import { SparklesIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const ComponentsShowcase = () => {
  const [text, setText] = useState("");
  const [sloganIndex, setSloganIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const slogans = [
      "We Satisfy the soul..",
      "........",
      "These are not just designs",
      "..........",
      "These are emotions...",
    ];

    const current = slogans[sloganIndex];
    if (charIndex < current.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + current[charIndex]);
        setCharIndex(charIndex + 1);
      }, 80);

      return () => clearTimeout(timeout);
    } else {
      const delay = setTimeout(() => {
        setText("");
        setCharIndex(0);
        setSloganIndex((prev) => (prev + 1) & slogans.length);
      }, 1800);

      return () => clearTimeout(delay);
    }
  }, [charIndex, sloganIndex]);
  return (
    <section className="py-20 overflow-x-clip">
      <div className="container mx-auto ">
        <div className="flex flex-col items-center">
          <h2
            className="
    text-center
    font-extrabold
    leading-tight
    tracking-tight
    bg-gradient-to-r from-white via-white/90 to-white/50 
    bg-clip-text text-transparent
text-2xl        
    sm:text-2xl     
    md:text-3xl  
    lg:text-4xl       
    2xl:text-5xl    

    max-w-7xl       
    mx-auto         
    px-4 
  
             
  "
          >
            <span>Feel the spark. Build unshakable </span>
            <LayoutTextFlip
              text=""
              words={["Confidence", "Moral", "Assurance", "Growth"]}
            />
            <span className="block mt-2">Zero judgement.</span>
          </h2>
          <div className="mt-10">
            <MaskedDiv maskType="type-2" className="my-6 max-w-4xl mx-auto">
              <video
                className="cursor-pointer transition-all duration-300 hover:scale-105"
                playsInline
                autoPlay
                loop
                muted
              >
                <source
                  src="https://videos.pexels.com/video-files/18069232/18069232-uhd_2560_1440_24fps.mp4"
                  type="video/mp4"
                />
              </video>
            </MaskedDiv>
          </div>

          <div
            className="
    flex 
    items-center 
    justify-center 
    gap-6 md:gap-10 lg:gap-14
    -mt-4 md:-mt-16 lg:-mt-20
  "
          >
            <MaskedDiv maskType="type-1" size={0.35} className="rotate-180">
              <video playsInline muted autoPlay loop>
                <source
                  src="https://videos.pexels.com/video-files/18069803/18069803-uhd_1440_2560_24fps.mp4"
                  type="video/mp4"
                />
              </video>
            </MaskedDiv>

            <MaskedDiv maskType="type-1" size={0.25}>
              <video playsInline muted autoPlay loop>
                <source
                  src="https://videos.pexels.com/video-files/7710243/7710243-uhd_2560_1440_30fps.mp4"
                  type="video/mp4"
                />
              </video>
            </MaskedDiv>

            <MaskedDiv maskType="type-1" size={0.25} className="rotate-180">
              <video playsInline muted autoPlay loop>
                <source
                  src="https://videos.pexels.com/video-files/18069166/18069166-uhd_2560_1440_24fps.mp4"
                  type="video/mp4"
                />
              </video>
            </MaskedDiv>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComponentsShowcase;
