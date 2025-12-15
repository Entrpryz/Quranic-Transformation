"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong");

      setSuccess(result.message);
      // Optional: Reset form if needed, though we switch views
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center px-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/50 shadow-xl backdrop-blur-sm">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]">
                  <Mail className="h-8 w-8 text-emerald-500" />
                </div>
                <CardTitle className="text-2xl font-gulzar tracking-wide text-white">
                  Check your inbox
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  We&apos;ve sent a password reset link to your email address.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center pt-4 pb-8">
                <Button
                  variant="ghost"
                  asChild
                  className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                >
                  <Link href="/auth/login" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </Button>
              </CardFooter>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-gulzar tracking-wide text-white">
                  Forgot Password?
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                  {error && (
                    <Alert
                      variant="destructive"
                      className="border-red-500/20 bg-red-500/10 text-red-400"
                    >
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-medium uppercase tracking-wider text-zinc-400"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      disabled={isLoading}
                      className="bg-zinc-900 border-zinc-800 focus-visible:ring-emerald-600 text-white placeholder:text-zinc-600"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/20"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-zinc-800/50 pt-6">
                <Link
                  href="/auth/login"
                  className="flex items-center text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </CardFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
