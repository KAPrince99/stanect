// components/ui/ConvoWrapper.tsx
"use client";

import dynamic from "next/dynamic";

// The actual Convo component you want to render
const Convo = dynamic(() => import("@/components/ui/convo"), { ssr: false });

interface ConvoWrapperProps {
  id: string;
}

export default function ConvoWrapper({ id }: ConvoWrapperProps) {
  return <Convo id={id} />;
}
