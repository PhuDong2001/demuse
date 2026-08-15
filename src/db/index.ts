import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/demuse";

declare global {
  var _demusePgPool: Pool | undefined;
}

const isSsl =
  connectionString.includes("neon.tech") ||
  connectionString.includes("sslmode=require") ||
  process.env.NODE_ENV === "production";

const pool =
  global._demusePgPool ||
  new Pool({
    connectionString,
    ssl: isSsl ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

if (process.env.NODE_ENV !== "production") {
  global._demusePgPool = pool;
}

export const db = drizzle(pool, { schema });
export type Database = typeof db;
export { pool };
