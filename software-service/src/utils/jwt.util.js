const path = require("path");
const crypto = require("crypto");

require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";

function base64UrlDecode(value) {
  return Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

function verifyToken(token) {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid token");
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const header = JSON.parse(base64UrlDecode(encodedHeader));

  if (header.alg !== "HS256") {
    throw new Error("Unsupported token algorithm");
  }

  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");

  if (signature !== expectedSignature) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && payload.exp < now) {
    throw new Error("Token expired");
  }

  return payload;
}

module.exports = {
  verifyToken
};
