import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="flex w-full min-h-screen overflow-y-auto px-6 py-20 md:px-10 lg:px-16">
      <div className="flex-1 flex-col justify-center items-center max-w-2xl h-screen xl:h-[80vh] md:bg-blue-400/30 md:mt-10 mx-auto xl:ml-[350px] rounded-2xl p-4 md:p-10">
        {/* Header */}
        <div className="flex text-left items-center gap-x-11 md:gap-x-42 md:ml-17 ">
          <div>
            Avatar <span>John Doe</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* INFO GRID */}
        <div className="grid grid-cols-2 gap-y-8 text-left mx-auto w-full max-w-md">
          <div className="font-semibold">Email</div>
          <div>johndoe@gmail.com</div>

          <div className="font-semibold">Country</div>
          <div>Ghana</div>

          <div className="font-semibold">Date joined</div>
          <div>05 August 2025</div>

          <div className="font-semibold">Total Minutes</div>
          <div>400 minutes</div>

          <div className="font-semibold">Subscription</div>
          <div>Free</div>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center gap-x-11 md:gap-x-42 mt-10">
          <Button className="md:ml-15">Update Plan</Button>
          <Button className="md:-ml-15">Update Profile</Button>
        </div>
      </div>
    </div>
  );
}
