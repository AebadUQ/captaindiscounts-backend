require("dotenv").config();
const { Sequelize } = require("sequelize");

const logging = process.env.DB_LOGGING === "true" ? console.log : false;

/**
 * Prefer DATABASE_URL (Neon, Railway, etc.). Falls back to DB_* for local Postgres.
 * Neon requires SSL; pooler URLs usually include sslmode=require.
 */
function createSequelize() {
  // Support DATABASE_URL (common) and DATABASE_URI (some hosts / docs use this name)
  const databaseUrl = (
    process.env.DATABASE_URL ||
    process.env.DATABASE_URI
  )?.trim();

  if (databaseUrl) {
    if (process.env.NODE_ENV !== "test") {
      console.log("[database] Using DATABASE_URL / DATABASE_URI for Postgres");
    }
    const isNeon =
      databaseUrl.includes("neon.tech") || databaseUrl.includes("neon.database");

    return new Sequelize(databaseUrl, {
      dialect: "postgres",
      logging,
      dialectOptions: {
        ssl: isNeon
          ? {
              require: true,
              // Neon pooler + many Node/pg setups; set DB_SSL_STRICT=true to verify CA
              rejectUnauthorized: process.env.DB_SSL_STRICT === "true",
            }
          : process.env.DB_SSL === "true"
            ? { require: true, rejectUnauthorized: true }
            : false,
      },
    });
  }

  if (process.env.NODE_ENV !== "test") {
    console.log(
      "[database] DATABASE_URL and DATABASE_URI are unset — using DB_HOST / DB_USER / DB_NAME"
    );
    if ((process.env.DB_USER || "").toLowerCase() === "root") {
      console.warn(
        "[database] DB_USER is \"root\". Neon expects the user from your connection string (e.g. neondb_owner). Set DATABASE_URL on the server."
      );
    }
  }

  return new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: "postgres",
      port: process.env.DB_PORT || 5432,
      logging,
    }
  );
}

const sequelize = createSequelize();
module.exports = sequelize;
