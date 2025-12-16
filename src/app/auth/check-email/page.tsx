"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<{
    type: "success" | "error" | null;
    message: string | null;
  }>({ type: null, message: null });

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleResendEmail = async () => {
    if (!email) return;

    setIsLoading(true);
    setResendStatus({ type: null, message: null });

    try {
      const response = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to resend email");
      }

      setResendStatus({
        type: "success",
        message: "Verification email sent successfully!",
      });
    } catch (error) {
      setResendStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEmailProviderLink = (email: string) => {
    if (email.includes("@gmail.com")) return "https://mail.google.com/";
    if (
      email.includes("@outlook.com") ||
      email.includes("@hotmail.com") ||
      email.includes("@live.com")
    )
      return "https://outlook.live.com/";
    if (email.includes("@yahoo.com")) return "https://mail.yahoo.com/";
    if (email.includes("@proton.me") || email.includes("@protonmail.com"))
      return "https://mail.proton.me/";
    return "https://mail.google.com/"; // Default fallback as requested
  };

  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/50 shadow-xl backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]">
          <Mail className="h-10 w-10 text-emerald-500" />
        </div>
        <CardTitle className="text-2xl font-gulzar tracking-wide text-white">
          Check Your Email
        </CardTitle>
        <CardDescription className="text-zinc-400 text-base mt-2">
          We have sent a verification email to <br />
          <span className="font-medium text-emerald-400">{email}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {resendStatus.message && (
          <Alert
            variant={resendStatus.type === "error" ? "destructive" : "default"}
            className={`border-${
              resendStatus.type === "error" ? "red" : "emerald"
            }-500/20 bg-${
              resendStatus.type === "error" ? "red" : "emerald"
            }-500/10 text-${
              resendStatus.type === "error" ? "red" : "emerald"
            }-400 py-2`}
          >
            <AlertDescription className="flex items-center justify-center gap-2">
              {resendStatus.type === "success" && (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {resendStatus.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          <Button
            asChild
            className="w-full h-12 text-base bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/20"
          >
            <a
              href={getEmailProviderLink(email)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              Open Email App
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>

          <Button
            variant="outline"
            onClick={handleResendEmail}
            disabled={isLoading || !email}
            className="w-full border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend Verification Email"
            )}
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-zinc-800/50 pt-6">
        <p className="text-center text-sm text-zinc-500">
          Did not receive the email? Check your spam folder or{" "}
          <span className="text-zinc-400">try resending it</span>.
        </p>
      </CardFooter>
    </Card>
  );
}

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <CheckEmailContent />
      </Suspense>
    </div>
  );
}
