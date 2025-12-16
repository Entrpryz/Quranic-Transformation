/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Github, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("🖱️ [Register Page] Form submitted");

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    console.log("📝 [Register Page] Form data collected:", {
      ...data,
      password: "***",
    });

    try {
      console.log(
        "🚀 [Register Page] Sending POST request to /api/auth/register..."
      );
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(
        "📥 [Register Page] Response received. Status:",
        response.status
      );

      const result = await response.json();
      console.log("📥 [Register Page] Response parsed:", result);

      if (!response.ok) {
        console.error("❌ [Register Page] Request failed:", result.error);
        throw new Error(result.error || "Something went wrong");
      }

      console.log("✅ [Register Page] Registration success. Redirecting...");
      setSuccess(result.message);
      router.push(
        "/auth/check-email?email=" + encodeURIComponent(data.email as string)
      );
      event.currentTarget.reset();
    } catch (err) {
      console.error("❌ [Register Page] Catch block error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      console.log("🏁 [Register Page] Request completed (finally block)");
      setIsLoading(false);
    }
  }

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center px-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/50 shadow-xl backdrop-blur-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-gulzar tracking-wide text-white">
                Create Account
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Begin your journey of knowledge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={onSubmit} className="space-y-4">
                {error && (
                  <Alert
                    variant="destructive"
                    className="border-red-500/20 bg-red-500/10 text-red-400 py-2"
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-xs font-medium uppercase tracking-wider text-zinc-400"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    disabled={isLoading}
                    placeholder="John Doe"
                    className="bg-zinc-900 border-zinc-800 focus-visible:ring-emerald-600 text-white placeholder:text-zinc-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs font-medium uppercase tracking-wider text-zinc-400"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={isLoading}
                    placeholder="name@example.com"
                    className="bg-zinc-900 border-zinc-800 focus-visible:ring-emerald-600 text-white placeholder:text-zinc-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-xs font-medium uppercase tracking-wider text-zinc-400"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      disabled={isLoading}
                      placeholder="••••••••"
                      className="bg-zinc-900 border-zinc-800 focus-visible:ring-emerald-600 text-white placeholder:text-zinc-600 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="relative">
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
                  className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  onClick={() => handleOAuthLogin("github")}
                  disabled={isLoading}
                >
                  <Github className="mr-2 h-4 w-4" />
                  Github
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
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
                  </svg>
                  Google
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-zinc-800/50 pt-6">
              <p className="text-center text-sm text-zinc-500">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="group inline-flex items-center font-medium text-emerald-500 hover:text-emerald-400 hover:underline"
                >
                  Sign in
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </p>
            </CardFooter>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
