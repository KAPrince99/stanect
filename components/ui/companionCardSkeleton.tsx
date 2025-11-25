export default function CompanionCardSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <article
          className="
        w-full
        bg-stone-100 shadow-sm
        overflow-hidden
        transition-all duration-300
        p-1 mt-2 sm:mt-5 rounded-2xl animate-pulse
      "
          key={index}
        >
          {/* Image placeholder */}
          <div className="w-full aspect-square relative">
            <div className="w-full h-full bg-stone-300 rounded-lg" />
            <div className="absolute top-2 left-2 h-5 w-16 bg-stone-400 rounded" />
          </div>

          <div className="p-4 flex flex-col gap-2 text-center">
            <div className="space-y-2">
              <div className="h-5 w-32 mx-auto bg-stone-300 rounded" />
              <div className="h-4 w-24 mx-auto bg-stone-300 rounded" />
            </div>

            <div className="mt-2">
              <div className="h-10 w-full bg-stone-300 rounded-lg" />
            </div>
          </div>
        </article>
      ))}
    </>
  );
}
