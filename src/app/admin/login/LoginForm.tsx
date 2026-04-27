"use client";

import { loginAction } from "./actions";
import { useTransition } from "react";

export function LoginForm() {
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => loginAction(formData));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Email address</label>
        <input
          name="email"
          type="email"
          required
          className="input"
          placeholder="ashton@..."
        />
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Sending…" : "Send magic link →"}
      </button>
    </form>
  );
}
