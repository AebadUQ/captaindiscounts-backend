require("dotenv").config();
const { Sequelize } = require("sequelize");

const logging = process.env.DB_LOGGING === "true" ? console.log : false;

/**
 * Prefer DATABASE_URL (Neon, Railway, etc.). Falls back to DB_* for local Postgres.
 * Neon requires SSL; pooler URLs usually include sslmode=require.
 */
function createSequelize() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (databaseUrl) {
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
