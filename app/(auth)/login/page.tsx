"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Eye, EyeOff, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setNotice(
      "Login is not available yet. Authentication will be connected in the backend stage.",
    );
  }

  return (
    <div>
      {/* Mobile brand */}
      <Link href="/login" className="mb-14 flex items-center gap-2 lg:hidden">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-bold text-white">
          C
        </span>
        <span className="text-xl font-bold text-text-primary">
          cashie<span className="text-primary">.</span>
        </span>
      </Link>

      <Sparkles className="mb-6 text-primary" size={24} />

      <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
        Welcome back!
      </h1>

      <p className="mt-3 text-sm text-text-secondary">
        Enter your details to access your account.
      </p>

      <form onSubmit={handleSubmit} className="mt-9 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        {notice && (
          <p
            role="status"
            className="rounded-lg bg-primary-light p-3 text-sm text-primary"
          >
            {notice}
          </p>
        )}

        <div className="pt-6">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Sign in
            <ArrowUpRight size={17} />
          </button>
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
