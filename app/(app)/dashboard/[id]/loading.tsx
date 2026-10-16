import { ConvoRouteLoading } from "@/components/ui/convo/ConvoSkeleton";

export default function Loading() {
  return (
    <div className="app-column-x box-border flex min-h-0 w-full flex-1 flex-col pt-24 pb-28 md:pb-16 lg:pb-6">
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col">
        <ConvoRouteLoading />
      </div>
    </div>
  );
}
