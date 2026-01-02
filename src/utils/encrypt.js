import crypto from "crypto";

const algorithm = "aes-256-cbc";

/* ✅ SAFE ENV ACCESS (RUNTIME CHECK) */
function getKey() {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error(
      "❌ ENCRYPTION_KEY is missing. Check your .env file."
    );
  }

  if (key.length !== 32) {
    throw new Error(
      "❌ ENCRYPTION_KEY must be exactly 32 characters."
    );
  }

  return Buffer.from(key);
}

export function encrypt(text) {
  if (!text) return "";

  const iv = crypto.randomBytes(16);
  const key = getKey();

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

export function decrypt(text) {
  if (!text) return "";

  const [ivHex, encryptedText] = text.split(":");
  const key = getKey();

  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
