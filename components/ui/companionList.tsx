"use client";
import CompanionCard from "./companionCard";
import { useQuery } from "@tanstack/react-query";
import { getCompanions } from "@/app/(app)/actions/actions";
import { Button } from "./button";
import LordIcon from "./lordIcon";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

async function fetchCompanions(userId: string) {
  const data = getCompanions(userId);
  return data;
}

export default function CompanionList({ userId }: { userId: string }) {
  useGSAP(() => {
    gsap.to("#first", {
      scale: 1.1,
      repeat: -1,
      yoyo: true,
    });
  });
  const { user } = useUser();
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
      {companions?.length === 0 && (
        <div className="mt-5 space-y-3 md:space-y-5">
          <h1 className="text-2xl md:text-3xl ">Welcome, {user?.firstName}.</h1>
          <Link href="/new">
            <Button
              id="first"
              className="cursor-pointer py-4 md:py-6 md:text-md rounded-2xl"
            >
              <LordIcon
                src="https://cdn.lordicon.com/ueoydrft.json"
                trigger="loop"
                state="hover-pinch"
                colors="primary:#121331,secondary:#4bb3fd,tertiary:#4bb3fd,quaternary:#4bb3fd,quinary:#3a3347,senary:#646e78,septenary:#ebe6ef"
                width={30}
                height={30}
              />
              Create Your First Companion
            </Button>
          </Link>
        </div>
      )}
      {companions?.map((comp) => (
        <CompanionCard key={comp.id} companion={comp} />
      ))}
    </>
  );
}
