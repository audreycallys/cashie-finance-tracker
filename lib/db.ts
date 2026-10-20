import "server-only";

import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";

const requiredEnv = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

function getCaCertificate(): string {
  // Vercel: gunakan sertifikat dari environment variable
  const base64Cert = process.env.DB_CA_CERT_BASE64;

  if (base64Cert) {
    const certificate = Buffer.from(base64Cert.trim(), "base64").toString(
      "utf8",
    );

    if (!certificate.includes("-----BEGIN CERTIFICATE-----")) {
      throw new Error("Invalid DB_CA_CERT_BASE64 value");
    }

    return certificate;
  }

  // Local Mac: gunakan file sertifikat
  const certPath = process.env.DB_CA_CERT_PATH;

  if (certPath) {
    const certificatePath = path.join(process.cwd(), "certs", "ca.pem");
    return fs.readFileSync(certificatePath, "utf8");
  }

  throw new Error("DB_CA_CERT_BASE64 or DB_CA_CERT_PATH is required");
}

const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,

  ssl: {
    ca: getCaCertificate(),
    rejectUnauthorized: true,
  },

  waitForConnections: true,
  connectionLimit: 5,
  maxIdle: 5,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;
