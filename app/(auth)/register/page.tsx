"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Eye, EyeOff, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setNotice(
      "Registration is not available yet. No account has been created.",
    );
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light";

  return (
    <div>
      {/* Mobile Brand */}
      <Link href="/login" className="mb-10 flex items-center gap-2 lg:hidden">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-bold text-white">
          C
        </span>

        <span className="text-xl font-bold text-text-primary">
          cashie<span className="text-primary">.</span>
        </span>
      </Link>

      {/* Header */}
      <Sparkles className="mb-5 text-primary" size={24} />

      <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
        Create your account
      </h1>

      <p className="mt-3 text-sm text-text-secondary">
        Start managing your finances with Cashie.
      </p>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Full name
          </label>

          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
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
            className={inputClass}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`${inputClass} pr-12`}
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-primary"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Notice */}
        {notice && (
          <p
            role="status"
            className="rounded-lg bg-primary-light p-3 text-sm text-primary"
          >
            {notice}
          </p>
        )}

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Create account
            <ArrowUpRight size={17} />
          </button>
        </div>
      </form>

      {/* Login Link */}
      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
