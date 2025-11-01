import crypto from "crypto";

export function hmacHeaders(raw: string) {
  const ts = Math.floor(Date.now() / 1000).toString();
  const msg = `${ts}.${raw}`;
  const sig = crypto.createHmac("sha256", process.env.BFF_SHARED_SECRET!).update(msg).digest("hex");
  return { "X-Timestamp": ts, "X-Signature": sig };
}
