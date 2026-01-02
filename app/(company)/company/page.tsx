import { MoveRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <main>
      <div className="text-sm text-gray-200">
        <Link href="/">Stanect software Inc.</Link>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 place-content-center my-2 md:my-15 text-gray-200">
        <div>
          <section className="max-w-sm">
            <h1 className="text-5xl">Small Project, Crazy Impact</h1>
          </section>
          <section className="max-w-xl text-lg my-10 leading-10">
            <p>
              I believe powerful experiences can be built by solo creators.
              Stanect is my solo-built AI voice companion, helping users gain
              confidence in conversations. As indie builders blur the lines
              between ideas and reality, Stanect is crafted to empower people to
              practice, learn, and connect.
            </p>
          </section>
          <section className="max-w-xl text-lg  leading-10">
            <p>
              Built solo, with full-stack love – from frontend to backend, AI
              integration to deployment.
            </p>
          </section>
          <section className="max-w-xl text-lg  leading-10 my-5">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 underline"
            >
              Try Stanect
              <span className="inline-block">
                <MoveRight />
              </span>
            </Link>
            <Link
              href="https://github.com/KAPrince99/stanect"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 underline"
            >
              Stanect on GitHub
              <span className="inline-block">
                <MoveRight />
              </span>
            </Link>
          </section>
        </div>
        <div>Prince Amanor Kabutey&apos;s Photo</div>
      </section>
    </main>
  );
}
