"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
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
  const [message, setMessage] = useState(
    "We are verifying your email address..."
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token. Please check your link.");
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
        if (!response.ok) throw new Error(result.error);
        setStatus("success");
        setMessage(result.message || "Email verified successfully!");
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Verification failed. Please try again."
        );
      }
    };
    verify();
  }, [token]);

  // Wrapper for consistent layout
  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex min-h-[80vh] w-full items-center justify-center px-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/50 shadow-xl backdrop-blur-sm">
        {children}
      </Card>
    </div>
  );

  return (
    <CardWrapper>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <CardHeader className="text-center pb-2 pt-10">
          <div className="mx-auto mb-6 flex items-center justify-center">
            {status === "loading" && (
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                <Loader2 className="h-16 w-16 text-emerald-500 animate-spin relative z-10" />
              </div>
            )}

            {status === "success" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]"
              >
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_40px_-10px_rgba(239,68,68,0.5)]"
              >
                <XCircle className="h-10 w-10 text-red-500" />
              </motion.div>
            )}
          </div>

          <CardTitle className="text-2xl font-gulzar tracking-wide text-white">
            {status === "loading"
              ? "Verifying Email"
              : status === "success"
              ? "Email Verified"
              : "Verification Failed"}
          </CardTitle>
          <CardDescription
            className={
              status === "error" ? "text-red-400 mt-2" : "text-zinc-400 mt-2"
            }
          >
            {message}
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col gap-4 pb-10 pt-4 px-8">
          {status !== "loading" && (
            <Button
              className={`w-full h-11 text-white shadow-lg ${
                status === "success"
                  ? "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/20"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
              onClick={() => router.push("/auth/login")}
            >
              {status === "success" ? (
                <>
                  Proceed to Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Back to Login"
              )}
            </Button>
          )}
        </CardFooter>
      </motion.div>
    </CardWrapper>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
