"use client";

import dynamic from "next/dynamic";

import LoadingSpinner from "./LoadingSpinner";

const ConvoContainer = dynamic(
  () => import("@/components/ui/convo/ConvoContainer"),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
);

interface ConvoWrapperProps {
  companionId: string;
}

export default function ConvoWrapper({ companionId }: ConvoWrapperProps) {
  return <ConvoContainer id={companionId} />;
}
