export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <span className="font-serif text-2xl font-bold">OTR Portfolios</span>
          <p className="text-white/50 text-sm mt-1">Admin</p>
        </div>
        <form method="POST" action="/api/auth/signin/resend" className="space-y-4">
          <input name="callbackUrl" type="hidden" value="/admin" />
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
