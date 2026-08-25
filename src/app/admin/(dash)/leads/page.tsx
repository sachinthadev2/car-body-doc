import { Check, Mail, MapPin, MessageSquare, Phone, Undo2 } from "lucide-react";

import { updateChatStatus } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { cn, formatDateTime } from "@/lib/utils";

const statusTone: Record<string, string> = {
  NEW: "bg-red-500/15 text-red-300 ring-red-500/30",
  CONTACTED: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  CLOSED: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/30",
};

export default async function AdminLeadsPage() {
  const [chats, subscribers] = await Promise.all([
    prisma.chatRequest.findMany({ orderBy: [{ status: "asc" }, { createdAt: "desc" }], take: 100 }),
    prisma.newsletterSubscriber.findMany({ where: { active: true }, orderBy: { createdAt: "desc" }, take: 200 }),
  ]);

  const open = chats.filter((c) => c.status === "NEW").length;

  return (
    <div className="p-5 sm:p-8">
      <header>
        <h1 className="display text-3xl text-white sm:text-4xl">Leads</h1>
        <p className="mt-1 text-sm text-white/45">
          {open} chat enquiries to action &middot; {subscribers.length} newsletter subscribers
        </p>
      </header>

      {/* --------------------------------------------------------- Chat leads */}
      <section className="mt-8">
        <h2 className="display flex items-center gap-2.5 text-xl text-white">
          <MessageSquare className="size-5 text-brand-500" />
          Chat enquiries
        </h2>

        <div className="mt-4 space-y-4">
          {chats.map((chat) => (
            <article
              key={chat.id}
              className={cn(
                "border bg-panel p-6 transition-colors",
                chat.status === "NEW" ? "border-brand-500/30" : "border-hairline opacity-75",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-lg text-brand-500">{chat.reference}</span>
                    <span
                      className={cn(
                        "rounded-sm px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-wider ring-1 ring-inset",
                        statusTone[chat.status],
                      )}
                    >
                      {chat.status}
                    </span>
                  </div>
                  <p className="mt-2 font-display text-xl uppercase text-white">{chat.topic}</p>
                  <p className="mt-1 text-sm text-white/45">
                    {chat.name} &middot; {formatDateTime(chat.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`tel:${chat.phone}`}
                    className="inline-flex items-center gap-1.5 border border-hairline px-3 py-2 text-sm text-white/70 transition-colors hover:border-brand-500 hover:text-white"
                  >
                    <Phone className="size-3.5 text-brand-500" />
                    {chat.phone}
                  </a>
                  {chat.email ? (
                    <a
                      href={`mailto:${chat.email}`}
                      className="inline-flex items-center gap-1.5 border border-hairline px-3 py-2 text-sm text-white/70 transition-colors hover:border-brand-500 hover:text-white"
                    >
                      <Mail className="size-3.5 text-brand-500" />
                      {chat.email}
                    </a>
                  ) : null}
                  {chat.suburb ? (
                    <span className="inline-flex items-center gap-1.5 border border-hairline px-3 py-2 text-sm text-white/50">
                      <MapPin className="size-3.5 text-brand-500" />
                      {chat.suburb}
                    </span>
                  ) : null}

                  <form action={updateChatStatus}>
                    <input type="hidden" name="id" value={chat.id} />
                    <input type="hidden" name="status" value={chat.status === "NEW" ? "CONTACTED" : "NEW"} />
                    <button
                      type="submit"
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors",
                        chat.status === "NEW"
                          ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                          : "border border-hairline text-white/50 hover:text-white",
                      )}
                    >
                      {chat.status === "NEW" ? (
                        <>
                          <Check className="size-3.5" /> Mark contacted
                        </>
                      ) : (
                        <>
                          <Undo2 className="size-3.5" /> Reopen
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {chat.message ? (
                <p className="mt-4 whitespace-pre-line border-t border-hairline pt-4 text-base leading-relaxed text-white/65">
                  {chat.message}
                </p>
              ) : null}
            </article>
          ))}

          {chats.length === 0 && (
            <p className="border border-dashed border-hairline bg-panel p-14 text-center text-white/35">
              No chat enquiries yet.
            </p>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------- Subscribers */}
      <section className="mt-12">
        <h2 className="display flex items-center gap-2.5 text-xl text-white">
          <Mail className="size-5 text-brand-500" />
          Newsletter subscribers
        </h2>
        <p className="mt-1 text-sm text-white/40">Collected from the footer signup.</p>

        <div className="mt-4 overflow-x-auto border border-hairline">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="bg-panel-2 text-[0.72rem] uppercase tracking-widest text-white/40">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline bg-panel">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="transition-colors hover:bg-panel-2">
                  <td className="px-4 py-3.5 text-white/75">
                    <a href={`mailto:${sub.email}`} className="hover:text-brand-400">
                      {sub.email}
                    </a>
                  </td>
                  <td className="px-4 py-3.5 text-white/45">{formatDateTime(sub.createdAt)}</td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-12 text-center text-white/35">
                    No subscribers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
