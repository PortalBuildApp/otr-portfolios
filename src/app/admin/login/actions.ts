"use server";

import { signIn } from "@/auth";

export async function loginAction(formData: FormData) {
  await signIn("resend", {
    email: formData.get("email") as string,
    redirectTo: "/admin",
  });
}
