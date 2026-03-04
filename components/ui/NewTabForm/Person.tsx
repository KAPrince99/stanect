import React from "react";
import LordIcon from "../lordIcon";
import InputField from "./InputField";

export default function Person() {
  return (
    <div>
      <div className="flex items-center justify-center my-4">
        <h2 className="text-5xl md:text-4xl font-display tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          Create Your Character
        </h2>
      </div>
      <div className="max-w-2xl mx-auto px-8 my-10 space-y-6">
        <InputField
          label="Companion Name"
          placeholder="Sophia • Alex • Mia..."
          className="h-14 text-lg"
          icon={
            <LordIcon
              src="https://cdn.lordicon.com/hhljfoaj.json"
              trigger="loop"
              colors="primary:#e88c30,secondary:#e88c30,tertiary:#e88c30"
              height={25}
              width={25}
            />
          }
        />

        <InputField
          label="Meeting Scene"
          placeholder="Gym • Coffee Shop • Bookstore..."
          className="h-14 placeholder:text-md text-lg "
          icon={
            <LordIcon
              src="https://cdn.lordicon.com/dhmavvpz.json"
              trigger="loop"
              colors="primary:#e88c30,secondary:#e88c30"
              height={25}
              width={25}
            />
          }
        />
      </div>
    </div>
  );
}
