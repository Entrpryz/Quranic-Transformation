/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { encrypt } from "@/lib/session";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
     const { searchParams } = new URL(request.url);
     const code = searchParams.get("code");

     if (!code) {
          return NextResponse.json({ error: "Missing code" }, { status: 400 });
     }

     try {
          // 1. Exchange Code for Access Token
          const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
               },
               body: JSON.stringify({
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
               }),
          });

          const tokenData = await tokenResponse.json();
          if (tokenData.error) throw new Error(tokenData.error_description);

          // 2. Fetch User Profile
          const userResponse = await fetch("https://api.github.com/user", {
               headers: { Authorization: `Bearer ${tokenData.access_token}` },
          });
          const githubUser = await userResponse.json();

          // 3. Fetch Email (if private)
          let email = githubUser.email;
          if (!email) {
               const emailRes = await fetch("https://api.github.com/user/emails", {
                    headers: { Authorization: `Bearer ${tokenData.access_token}` },
               });
               const emails = await emailRes.json();
               email = emails.find((e: any) => e.primary)?.email;
          }

          if (!email) throw new Error("No email found from GitHub");

           // 4. Find or Create User in DB
          const user = await prisma.user.upsert({
               where: { email },
               update: {
                    name: githubUser.name || githubUser.login,
                    image: githubUser.avatar_url,
                    emailVerified: new Date(), // GitHub emails are verified
                    lastLogin: new Date(),
               },
               create: {
                    email,
                    name: githubUser.name || githubUser.login,
                    image: githubUser.avatar_url,
                    emailVerified: new Date(),
                    xp: 0,
                    currentStreak: 0,
               },
          });

          // 5. Create Session & Cookie
          const sessionToken = await encrypt({
               userId: user.id,
               email: user.email,
               role: user.role,
          });

          const cookieStore = await cookies();
          cookieStore.set("session", sessionToken, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "lax",
               path: "/",
               maxAge: 7 * 24 * 60 * 60,
          });

          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.url;
          return NextResponse.redirect(new URL("/dashboard", baseUrl));

     } catch (error) {
          console.error("GitHub Auth Error:", error);
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.url;
          return NextResponse.redirect(new URL("/auth/login?error=GithubAuthFailed", baseUrl));
     }
}