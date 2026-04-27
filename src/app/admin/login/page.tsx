import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <span className="font-serif text-2xl font-bold">OTR Portfolios</span>
          <p className="text-white/50 text-sm mt-1">Admin</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
