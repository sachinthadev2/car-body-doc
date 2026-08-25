import "dotenv/config";
import mariadb from "mariadb";

async function main() {
  console.log("Connecting to", process.env.DATABASE_URL);
  const pool = mariadb.createPool(process.env.DATABASE_URL!.replace(/^mysql:\/\//, "mariadb://") + "?connectTimeout=10000");
  try {
    const conn = await pool.getConnection();
    console.log("Connected!");
    const rows = await conn.query("SELECT 1 as val");
    console.log("Rows:", rows);
    conn.release();
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await pool.end();
  }
}

main();
