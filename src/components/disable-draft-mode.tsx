"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function DisableDraftMode() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDisable = () => {
    startTransition(async () => {
      await fetch("/api/draft-mode/disable");
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleDisable}
      disabled={isPending}
      className="fixed bottom-4 right-4 z-50 bg-yellow-400 border-4 border-black px-4 py-2 font-mono font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
    >
      {isPending ? "Exiting..." : "Exit Preview"}
    </button>
  );
}

