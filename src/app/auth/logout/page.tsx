"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Clear any client-side storage if necessary, then redirect
        router.push("/auth/login");
        router.refresh();
      } catch (error) {
        console.error("Logout failed:", error);
        // Fallback redirect even if API fails
        router.push("/auth/login");
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center space-y-4 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Logging out...
        </h2>
        <p className="text-sm text-zinc-400">
          Please wait while we securely end your session.
        </p>
      </div>
    </div>
  );
}
