import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Wipes customer data (quotes, bookings, messages, customer accounts) but keeps
 * admin logins. Handy after testing, before handing the site to real customers.
 */
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  const photos = await prisma.quotePhoto.deleteMany();
  const bookings = await prisma.booking.deleteMany();
  const quotes = await prisma.quoteRequest.deleteMany();
  const messages = await prisma.contactMessage.deleteMany();
  const users = await prisma.user.deleteMany({ where: { role: "CUSTOMER" } });

  console.log(
    `Cleared: ${quotes.count} quotes, ${photos.count} photos, ${bookings.count} bookings, ${messages.count} messages, ${users.count} customer accounts.`,
  );
  console.log("Uploaded photo files in /public/uploads are left on disk - delete them by hand if you want.");
  await prisma.$disconnect();
}
main();
