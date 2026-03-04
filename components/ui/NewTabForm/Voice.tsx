import React from "react";
import LordIcon from "../lordIcon";
import InputField from "./InputField";

export default function Voice() {
  const [isActive, setIsActive] = React.useState("male");
  return (
    <div className="max-w-2xl mx-auto px-8 ">
      <div className="flex items-center justify-center">
        <h2 className="text-5xl md:text-4xl font-display tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          Choose Your Preferred Voice
        </h2>
      </div>
      <div className="my-10">
        <div className="flex justify-start items-center gap-2 mb-4">
          <LordIcon
            src="https://cdn.lordicon.com/ckooqaow.json"
            trigger="loop"
            colors="primary:#e88c30,secondary:#e88c30,tertiary:#e88c30,quaternary:#ebe6ef,quinary:#f24c00"
            height={25}
            width={25}
          />
          <p className="font-inter">Voice</p>
        </div>
        <section className="my-5 flex items-center gap-4 bg-white/10 p-2 rounded-xl">
          <div
            className={`flex-1 py-3 text-center rounded-lg cursor-pointer font-medium ${
              isActive === "male" ? "bg-white/10" : ""
            }`}
            onClick={() => setIsActive("male")}
          >
            Male
          </div>
          <div
            className={`flex-1 py-3 text-center rounded-lg cursor-pointer font-medium ${
              isActive === "female" ? "bg-white/10" : ""
            }`}
            onClick={() => setIsActive("female")}
          >
            Female
          </div>
        </section>
      </div>

      <section className="my-10">
        <InputField
          label="Session Length (minutes)"
          placeholder="Enter session length..."
          className="h-14 text-lg"
          icon={
            <LordIcon
              src="https://cdn.lordicon.com/zjuyeglr.json"
              trigger="loop"
              colors="primary:#e88c30,secondary:#e88c30"
              height={25}
              width={25}
            />
          }
        />
      </section>
    </div>
  );
}
