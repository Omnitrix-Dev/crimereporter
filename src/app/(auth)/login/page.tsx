"use client";

import { Button } from "~/components/ui/button";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { signIn } from "next-auth/react";
import { AuthError } from "next-auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error === "CredentialsSignin") {
        alert("Incorrect username or password");
        return;
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[90vh] flex-col justify-center border bg-black px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-center text-3xl font-bold text-transparent">
          Welcome Back
        </h1>
        <h2 className="text-center text-sm text-neutral-400">
          Sign in to access your admin dashboard
        </h2>
      </div>

      <form className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-8 shadow-xl backdrop-blur-sm sm:px-10">
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-300"
            >
              Email address
            </Label>
            <div className="mt-1">
              <Input
                disabled={isLoading}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3.5 text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-300"
            >
              Password
            </Label>
            <div className="mt-1">
              <Input
                disabled={isLoading}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3.5 text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              onClick={() => handleLogin()}
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
