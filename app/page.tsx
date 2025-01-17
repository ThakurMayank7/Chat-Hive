'use client';

import { testing } from "@/actions/actions";

export default function Home() {
  return (
    <div className="h-full w-full">home
      <button onClick={() => testing()}>testing</button>
    </div>
  );
}

