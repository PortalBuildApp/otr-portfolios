import Link from "next/link";

export default function LegalIndex() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="space-y-4 text-center">
        <h1 className="font-serif text-2xl font-bold">Legal</h1>
        <div className="flex gap-4">
          <Link href="/legal/terms" className="btn-secondary">Terms of Service</Link>
          <Link href="/legal/privacy" className="btn-secondary">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
