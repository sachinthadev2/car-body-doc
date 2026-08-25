import "dotenv/config";

import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

let adapterString = connectionString.replace(/^mysql:\/\//, "mariadb://");
adapterString += adapterString.includes("?") ? "&connectTimeout=10000" : "?connectTimeout=10000";

const prisma = new PrismaClient({ adapter: new PrismaMariaDb(adapterString) });

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@carbodydoc.com.au").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const name = process.env.ADMIN_NAME ?? "Car Body Doc Admin";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    create: { email, name, passwordHash, role: "ADMIN" },
    update: { name, passwordHash, role: "ADMIN" },
  });

  console.log(`Admin ready: ${admin.email}`);
  console.log(`Password:    ${password}`);
  console.log("Log in at /admin/login - change the password in .env and re-run to rotate it.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
