"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const csrf = await fetch("/api/auth/csrf").then((r) => r.json());
      const res = await fetch("/api/auth/signin/resend", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email,
          csrfToken: csrf.csrfToken,
          callbackUrl: "/admin",
        }),
        redirect: "manual",
      });
      const location = res.headers.get("location") ?? "";
      if (location.includes("error")) {
        setError("Sign-in failed: " + location);
      } else {
        setSent(true);
      }
    } catch (err: unknown) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <span className="font-serif text-2xl font-bold">OTR Portfolios</span>
          <p className="text-white/50 text-sm mt-1">Admin</p>
        </div>
        {sent ? (
          <div className="text-center space-y-2">
            <p className="text-white/80">Check your email for a magic link.</p>
            <p className="text-white/40 text-sm">{email}</p>
          </div>
        ) : error ? (
          <div className="text-center space-y-3">
            <p className="text-red-400 text-sm break-all">{error}</p>
            <button onClick={() => setError("")} className="text-white/40 text-sm underline">Try again</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="ashton@..."
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Sending…" : "Send magic link →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
