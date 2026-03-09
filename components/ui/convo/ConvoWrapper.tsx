"use client";

import dynamic from "next/dynamic";

import LoadingSpinner from "../LoadingSpinner";

const Convo = dynamic(() => import("@/components/ui/convo/convo"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

interface ConvoWrapperProps {
  companionId: string;
}

export default function ConvoWrapper({ companionId }: ConvoWrapperProps) {
  return <Convo id={companionId} />;
}
