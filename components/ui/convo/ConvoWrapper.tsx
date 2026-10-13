"use client";

import dynamic from "next/dynamic";

import { ConvoRouteLoading } from "./ConvoSkeleton";

const ConvoContainer = dynamic(
  () => import("@/components/ui/convo/ConvoContainer"),
  {
    ssr: false,
    loading: () => <ConvoRouteLoading />,
  },
);

interface ConvoWrapperProps {
  companionId: string;
}

export default function ConvoWrapper({ companionId }: ConvoWrapperProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <ConvoContainer id={companionId} />
    </div>
  );
}
