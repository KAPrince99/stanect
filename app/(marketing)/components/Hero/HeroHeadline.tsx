export function HeroHeadline() {
  return (
    <>
      <h1 className="mt-8 text-5xl leading-tight tracking-tight bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-transparent animate-fade-up animation-delay-200 md:text-6xl lg:text-8xl">
        Never{" "}
        <span className="inline-block -rotate-2 rounded-xl bg-linear-to-r from-amber-400 to-amber-500 px-3 py-1 text-black animate-fade-up animation-delay-400">
          freeze
        </span>
        <br />
        meeting someone you really like.
      </h1>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/80 animate-fade-up animation-delay-600 md:mt-8 lg:text-xl">
        Made For People who Struggle to Connect
      </p>
    </>
  );
}
