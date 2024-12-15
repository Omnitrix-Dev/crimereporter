"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function Home() {
  const [input, setInput] = useState("");

  const { mutate, isPending } = api.post.createReport.useMutation({
    onSuccess: (r) => {
      console.log(r);
    },

    onError: (e) => {
      console.log(e);
    },
  });

  return (
    <section>
      <h1 className="text-center text-4xl">Hello, world!</h1>
      <input className="border" onChange={(e) => setInput(e.target.value)} />
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={() => mutate({ title: input })}
      >
        {isPending ? "Submitting..." : "Submit"}
      </button>
    </section>
  );
}
