"use client";

import dynamic from "next/dynamic";
import ConvoSkeleton from "./convoSkeleton"; // Assuming ConvoSkeleton is defined elsewhere
import { Loader2 } from "lucide-react";

// Dynamically import the main Convo component with SSR disabled
const Convo = dynamic(() => import("@/components/ui/convo"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center my-50">
      <Loader2 className="animate-spin" />
    </div>
  ),
});

interface ConvoWrapperProps {
  companionId: string; // Renamed 'id' to 'companionId' for clarity
}

// Client Component: Responsible for dynamic loading and passing props
export default function ConvoWrapper({ companionId }: ConvoWrapperProps) {
  return <Convo id={companionId} />;
}
