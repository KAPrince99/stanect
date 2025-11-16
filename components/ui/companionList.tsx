"use client";
import { mockData } from "@/mock/data";
import CompanionCard from "./companionCard";
import { useQuery } from "@tanstack/react-query";
import { getCompanions } from "@/app/(app)/actions/actions";

async function fetchCompanions(userId: string) {
  const data = getCompanions(userId);
  return data;
}

export default function CompanionList({ userId }: { userId: string }) {
  const {
    data: companions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["companions", userId],
    queryFn: () => fetchCompanions(userId),
    enabled: !!userId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) throw new Error(error.message);

  return (
    <>
      {companions?.map((comp) => (
        <CompanionCard key={comp.id} companion={comp} />
      ))}
    </>
  );
}
