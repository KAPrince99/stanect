import LinkComponent from "@/components/ui/LinkComponent";
import Link from "next/link";

import React from "react";

export default function page() {
  return (
    <main className="min-h-screen bg-black text-white p-5 lg:p-10 overflow-y-auto">
      <section className="text-sm text-gray-200">
        <Link href="/">Stanect software Inc.</Link>
      </section>
      <div className="flex flex-col w-full md:space-y-20 lg:space-y-35 p-5">
        <section className="flex flex-col md:flex-row items-center justify-between space-y-10 md:space-y-0">
          <LinkComponent
            link="mailto:princeamanorkabutey@gmail.com"
            name="Email"
          />
          <LinkComponent
            link="mailto:princeamanorkabutey@gmail.com"
            name="Github"
          />
          <LinkComponent
            link="mailto:princeamanorkabutey@gmail.com"
            name="PortFolio / 26"
          />
        </section>
        <section className="flex flex-col md:flex-row items-center justify-center space-y-10 md:space-y-0 ">
          <LinkComponent
            link="mailto:princeamanorkabutey@gmail.com"
            name="Phone"
          />
        </section>
        <section className="flex flex-col md:flex-row items-center justify-between space-y-10 md:space-y-0">
          <LinkComponent
            link="mailto:princeamanorkabutey@gmail.com"
            name="Twitter"
          />
          <LinkComponent
            link="mailto:princeamanorkabutey@gmail.com"
            name="Instagram"
          />
          <LinkComponent
            link="mailto:princeamanorkabutey@gmail.com"
            name="LinkedIn"
          />
        </section>
      </div>
    </main>
  );
}
