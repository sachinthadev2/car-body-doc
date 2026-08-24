import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/forms/AuthForms";
import { PageHero } from "@/components/site/PageHero";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Create a Car Body Doc account to track your quotes and bookings.",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  // Checked against the database, not just the cookie - a session for a deleted
  // account must fall through to the form instead of bouncing back and forth.
  const user = await getCurrentUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : "/account");

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Create an account"
        lead="Keep your quotes, prices and booking history in one place. Any quotes you have already sent with the same email get pulled in automatically."
      />

      <div className="mx-auto max-w-md px-4 py-14 sm:py-20">
        <div className="border border-hairline bg-panel p-7 sm:p-9">
          <RegisterForm />
        </div>
      </div>
    </>
  );
}
