"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Verification failed");
        }

        setStatus("success");
        setMessage(result.message);
      } catch (error) {
        setStatus("error");
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage("An unknown error occurred");
        }
      }
    };

    verify();
  }, [token]);

  return (
    <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-1 flex flex-col items-center text-center pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          Email Verification
        </CardTitle>
        <CardDescription className="text-zinc-400">
          {status === "loading" && "Please wait while we verify your email."}
          {status === "success" && "Your email has been verified!"}
          {status === "error" && "Verification failed."}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center space-y-6 py-6">
        {status === "loading" && (
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        )}

        {status === "success" && (
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
        )}

        {status === "error" && (
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 animate-in zoom-in duration-300">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        )}

        <p
          className={`text-center max-w-xs ${
            status === "error" ? "text-red-400" : "text-zinc-300"
          }`}
        >
          {message}
        </p>

        {status !== "loading" && (
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => router.push("/auth/login")}
          >
            Go to Login
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
