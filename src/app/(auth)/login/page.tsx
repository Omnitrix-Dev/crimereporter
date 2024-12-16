"use client";

import { Button } from "~/components/ui/button";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { signIn } from "next-auth/react";
import { AuthError } from "next-auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });
    if (res?.error === "CredentialsSignin") {
      alert("Incorrect username or password");
      return;
    } else {
      router.push("/");
    }
  };

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-2">
      <Input
        onChange={(e) =>
          setCredentials({ ...credentials, [e.target.name]: e.target.value })
        }
        name="email"
        type="email"
      />
      <Input
        onChange={(e) =>
          setCredentials({ ...credentials, [e.target.name]: e.target.value })
        }
        name="password"
        type="password"
      />
      <Button onClick={handleLogin}>Login</Button>
    </section>
  );
}
