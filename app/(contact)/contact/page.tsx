import LinkComponent from "@/components/ui/LinkComponent";
import Link from "next/link";

import React from "react";

export default function page() {
  return (
    <main className="min-h-screen bg-black text-white p-5 lg:p-10 overflow-y-auto">
      <section className="text-sm text-gray-200">
        <Link href="/">Stanect software Inc.</Link>
      </section>
      <div className="flex flex-col w-full md:space-y-20 lg:space-y-35 p-5 ">
        <section className="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-10 md:space-y-0">
          <LinkComponent
            link="mailto:princeamanorkabutey@gmail.com"
            name="Email"
          />
          <LinkComponent link="https://github.com/KAPrince99" name="Github" />
          <LinkComponent
            link="https://portfolio-tan-mu-59.vercel.app/"
            name="PortFolio / 26"
          />
        </section>
        <section className="flex flex-col md:flex-row items-center justify-center my-10 md:my-0 md:space-y-0 ">
          <LinkComponent link="tel:+233243575398" name="Phone" />
        </section>
        <section className="flex flex-col md:flex-row items-center justify-between space-y-10 md:space-y-0">
          <LinkComponent
            link="https://x.com/facultywave?s=21&t=EA7KVzb47NhFewv2bvQfpQ"
            name="Twitter"
          />
          <LinkComponent
            link="https://www.instagram.com/facultywave?igsh=bXRzd3B0ZW40Ymg0&utm_source=qr"
            name="Instagram"
          />
          <LinkComponent
            link="https://www.linkedin.com/in/prince-amanor-kabutey-103368177/"
            name="LinkedIn"
          />
        </section>
      </div>
    </main>
  );
}
