"use client";

import dynamic from "next/dynamic";

import { ConvoRouteLoading } from "../AppRouteLoading";

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
  return <ConvoContainer id={companionId} />;
}
