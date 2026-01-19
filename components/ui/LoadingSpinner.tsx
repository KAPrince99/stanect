"use client";
import LordIcon from "./lordIcon";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center my-50 lg:-ml-35">
      <LordIcon
        src="https://cdn.lordicon.com/veoztjjj.json"
        trigger="loop"
        colors="primary:#e88c30,secondary:#ffffff"
        height={60}
        width={60}
      />
    </div>
  );
}
