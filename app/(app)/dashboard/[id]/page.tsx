import Convo from "@/components/ui/convo";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <main className="mt-15 sm:mt-20 mx-auto max-w-7xl  sm:px-6 lg:px-8">
      <Convo id={id} />
    </main>
  );
}
