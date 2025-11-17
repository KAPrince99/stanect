import DeleteCompanionButton from "@/components/ui/deleteCompanionButton";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <div className="mt-15 sm:mt-20 ">
      <DeleteCompanionButton id={id} />
    </div>
  );
}
