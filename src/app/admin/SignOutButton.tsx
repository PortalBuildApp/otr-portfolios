"use client";

import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/admin-auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-white/40 hover:text-white/60 transition-colors"
    >
      Sign out
    </button>
  );
}
