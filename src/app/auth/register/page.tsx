"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Github, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterPage() {
  const router = useRouter();
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong");
      setSuccess(result.message);
      event.currentTarget.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `/api/auth/${provider}`;
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="w-20 h-20 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-gulzar text-white">Check Your Email</h2>
          <p className="text-zinc-400">{success}</p>
        </div>
        <Button
          variant="outline"
          className="w-full border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          onClick={() => router.push("/auth/login")}
        >
          Return to Login
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-gulzar text-white tracking-wide">
          Create Account
        </h1>
        <p className="text-zinc-400">Begin your journey of knowledge</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <Alert
            variant="destructive"
            className="bg-red-500/10 border-red-500/20 text-red-400 text-sm py-2"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label className="text-zinc-400 text-xs uppercase tracking-wider">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            required
            disabled={isLoading}
            className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500/50 text-white h-11"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-400 text-xs uppercase tracking-wider">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            disabled={isLoading}
            className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500/50 text-white h-11"
            placeholder="name@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-400 text-xs uppercase tracking-wider">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            disabled={isLoading}
            className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500/50 text-white h-11"
            placeholder="••••••••"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white h-11 shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="bg-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-950 px-2 text-zinc-500">
            Or sign up with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-11 border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          onClick={() => handleOAuthLogin("github")}
          disabled={isLoading}
        >
          <Github className="mr-2 h-4 w-4" /> Github
        </Button>
        <Button
          variant="outline"
          className="h-11 border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          onClick={() => handleOAuthLogin("google")}
          disabled={isLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>{" "}
          Google
        </Button>
      </div>

      <p className="text-center text-sm text-zinc-500 mt-6">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-emerald-500 hover:text-emerald-400 font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}