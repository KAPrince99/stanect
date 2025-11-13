import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  return <div className=" mt-15 sm:mt-20">{name}</div>;
}
