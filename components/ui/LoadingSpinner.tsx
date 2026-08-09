"use client";

export default function LoadingSpinner() {
  return (
    <div className="my-40 flex items-center justify-center md:my-52">
      <div className="w-12 h-12 border-4 border-white border-t-orange-500 border-r-amber-400 rounded-full animate-spin" />
    </div>
  );
}
