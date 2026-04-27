import { signIn } from "@/auth";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <span className="font-serif text-2xl font-bold">OTR Portfolios</span>
          <p className="text-white/50 text-sm mt-1">Admin</p>
        </div>
        <form
          action={async (formData: FormData) => {
            "use server";
            await signIn("resend", formData);
          }}
          className="space-y-4"
        >
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
          <button type="submit" className="btn-primary w-full">
            Send magic link →
          </button>
        </form>
      </div>
    </div>
  );
}
