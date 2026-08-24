import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/forms/AuthForms";
import { PageHero } from "@/components/site/PageHero";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Customer Login",
  description: "Log in to track your quote requests and bookings with Car Body Doc.",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Checked against the database, not just the cookie - a session for a deleted
  // account must fall through to the form instead of bouncing back and forth.
  const user = await getCurrentUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : "/account");

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Log in"
        lead="Track your quotes and bookings in one place. Creating an account is optional - you can always quote and book as a guest."
      />

      <div className="mx-auto max-w-md px-4 py-14 sm:py-20">
        <div className="border border-hairline bg-panel p-7 sm:p-9">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
