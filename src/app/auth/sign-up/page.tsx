"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUpRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/signup");
  }, [router]);
  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
      Redirecting to signup...
    </div>
  );
}
