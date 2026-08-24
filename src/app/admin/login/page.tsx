import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/forms/AuthForms";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "Staff Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="mx-auto flex size-12 items-center justify-center bg-brand-500">
            <ShieldCheck className="size-6 text-white" />
          </span>
          <h1 className="display mt-5 text-3xl text-white">
            {business.name} <span className="text-brand-500">Admin</span>
          </h1>
          <p className="mt-2 text-sm text-white/45">Staff access only.</p>
        </div>

        <div className="mt-8 border border-hairline bg-panel p-7 sm:p-9">
          <LoginForm adminOnly />
        </div>

        <p className="mt-6 text-center text-sm text-white/35">
          <Link href="/" className="hover:text-white">
            &larr; Back to the website
          </Link>
        </p>
      </div>
    </main>
  );
}
