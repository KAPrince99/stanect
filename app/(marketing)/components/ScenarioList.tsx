import React from "react";
import Scenario from "./Scenario";
const scenarios = [
  {
    id: 1,
    title: "The Relationship Builder",
    message:
      "Communicate more effectively in personal relationships. Whether you're preparing for a difficult conversation with a loved one or simply want to improve your everyday interactions, Stanect has got you covered.",
    imageUrl: "/photos/kitchen_photo.jpg",
  },
  {
    id: 2,
    title: "Social Catalyst",
    message:
      "Break out of your shell and navigate social gatherings with ease. Practice icebreakers and small talk in a safe environment so you can feel confident and present when you're out with friends or meeting new people.",
    imageUrl: "/photos/two_boys_one_girl.jpg",
  },
  {
    id: 3,
    title: "Network Architect",
    message:
      "Master the art of professional networking without the awkwardness. Learn how to articulate your value, ask insightful questions, and build meaningful career connections that go beyond just swapping business cards.",
    imageUrl: "/photos/two_girls_roadside.jpg",
  },
  {
    id: 4,
    title: "Charismatic Closer",
    message:
      "Take the pressure out of talking to your crush. Our AI helps you practice smooth, genuine conversations so you can express your feelings clearly and keep the dialogue flowing naturally without the nerves.",
    imageUrl: "/photos/bicycle_girl_one.jpg",
  },
  {
    id: 5,
    title: "Group Dynamicist",
    message:
      "Navigate complex group settings where multiple voices compete for attention. Practice timing your contributions and managing the flow of multi-person dialogue so you never feel left out of the conversation again.",
    imageUrl: "/photos/three_men.jpg",
  },
];

export default function ScenarioList() {
  return (
    <main
      className="min-h-screen w-full h-full mt-1 md:mt-10  text-center "
      id="scenarios"
    >
      <h2
        className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight 
                 bg-gradient-to-r from-white via-white/90 to-white/40 
                 bg-clip-text text-transparent leading-tight my-20 px-5"
      >
        When talking to people makes your chest tighten…
        <br className="hidden md:block" />
        <span
          className="mt-3 inline-block 
                     bg-gradient-to-r from-cyan-200 via-white to-blue-200 
                     bg-clip-text text-transparent"
        >
          Stanect helps your words flow naturally.
        </span>
      </h2>
      {scenarios.map((scenario) => (
        <Scenario key={scenario.title} scenario={scenario} />
      ))}
    </main>
  );
}
