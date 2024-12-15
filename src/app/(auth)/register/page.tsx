import Link from "next/link";

import { FormRegister } from "../_components/FormRegister";

export default function Register() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-black px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-center text-3xl font-bold text-transparent">
          Create Account
        </h1>
        <h2 className="text-center text-sm text-neutral-400">
          Sign up to get started
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-8 shadow-xl backdrop-blur-sm sm:px-10">
          <FormRegister />
          <div className="mt-6 text-center text-sm">
            <span className="text-neutral-400">Already have an account?</span>{" "}
            <Link
              href="/login"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
