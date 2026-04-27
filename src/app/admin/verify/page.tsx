export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="text-center space-y-3 max-w-sm">
        <div className="text-4xl">📬</div>
        <h1 className="font-serif text-2xl font-bold">Check your email</h1>
        <p className="text-white/60">
          We sent a magic link to sign in. Click it to access the admin.
        </p>
      </div>
    </div>
  );
}
