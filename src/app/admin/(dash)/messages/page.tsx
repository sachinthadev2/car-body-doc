import { Check, Mail, Phone, Undo2 } from "lucide-react";

import { toggleMessageHandled } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { cn, formatDateTime } from "@/lib/utils";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ handled: "asc" }, { createdAt: "desc" }],
    take: 100,
  });

  const unread = messages.filter((m) => !m.handled).length;

  return (
    <div className="p-5 sm:p-8">
      <header>
        <h1 className="display text-3xl text-white sm:text-4xl">Messages</h1>
        <p className="mt-1 text-sm text-white/45">
          {unread} to action &middot; {messages.length} total
        </p>
      </header>

      <div className="mt-8 space-y-4">
        {messages.map((message) => (
          <article
            key={message.id}
            className={cn(
              "border bg-panel p-6 transition-colors",
              message.handled ? "border-hairline opacity-60" : "border-brand-500/30",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="display text-xl text-white">{message.subject || "General enquiry"}</h2>
                <p className="mt-1 text-sm text-white/50">
                  {message.name} &middot; {formatDateTime(message.createdAt)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`mailto:${message.email}`}
                  className="inline-flex items-center gap-1.5 border border-hairline px-3 py-2 text-sm text-white/70 hover:border-brand-500 hover:text-white"
                >
                  <Mail className="size-3.5 text-brand-500" />
                  {message.email}
                </a>
                {message.phone ? (
                  <a
                    href={`tel:${message.phone}`}
                    className="inline-flex items-center gap-1.5 border border-hairline px-3 py-2 text-sm text-white/70 hover:border-brand-500 hover:text-white"
                  >
                    <Phone className="size-3.5 text-brand-500" />
                    {message.phone}
                  </a>
                ) : null}
                <form action={toggleMessageHandled}>
                  <input type="hidden" name="id" value={message.id} />
                  <button
                    type="submit"
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors",
                      message.handled
                        ? "border border-hairline text-white/50 hover:text-white"
                        : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30",
                    )}
                  >
                    {message.handled ? (
                      <>
                        <Undo2 className="size-3.5" /> Reopen
                      </>
                    ) : (
                      <>
                        <Check className="size-3.5" /> Mark done
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <p className="mt-4 whitespace-pre-line border-t border-hairline pt-4 text-base leading-relaxed text-white/65">
              {message.message}
            </p>
          </article>
        ))}

        {messages.length === 0 && (
          <p className="border border-dashed border-hairline bg-panel p-14 text-center text-white/35">
            No messages yet.
          </p>
        )}
      </div>
    </div>
  );
}
