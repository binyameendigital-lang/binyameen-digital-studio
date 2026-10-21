import { getStore } from "@netlify/blobs";

const STORE = "binyameen-feedback";
const KEY = "submissions.json";
const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
const json = (statusCode, body) => new Response(JSON.stringify(body), { status: statusCode, headers });
async function readAll(store) { return (await store.get(KEY, { type: "json" })) || []; }
async function notifyByEmail(item) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;
  if (!apiKey || !to) return;
  const from = process.env.RESEND_FROM_EMAIL || "Binyameen Feedback <onboarding@resend.dev>";
  const text = `New website feedback is waiting for moderation.\nName: ${item.name || "Not provided"}\nEmail: ${item.email || "Not provided"}\nRating: ${item.rating}/5\nPermission: ${item.permission}\nMessage: ${item.message}\n\nReview it at: ${process.env.SITE_URL || "your Netlify site"}/admin.html`;
  await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [to], subject: "New feedback needs your review", text }) });
}
async function notifyByWhatsApp(item) {
  const { TWILIO_ACCOUNT_SID:sid, TWILIO_AUTH_TOKEN:token, TWILIO_WHATSAPP_FROM:from, TWILIO_WHATSAPP_TO:to } = process.env;
  if (!sid || !token || !from || !to) return;
  const body = `New website feedback pending review. Rating: ${item.rating}/5. Name: ${item.name || "Visitor"}. Message: ${item.message.slice(0,300)}. Admin: ${(process.env.SITE_URL || "")}/admin.html`;
  const form = new URLSearchParams({ From: from, To: to, Body: body });
  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" }, body: form });
}
export default async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  const store = getStore(STORE);
  if (request.method === "GET") {
    try {
      const all = await readAll(store);
      const feedback = all.filter(x => x.status === "approved" && x.permission !== "No — keep my feedback private" && x.permission !== "No, keep my feedback private").map(x => ({ id: x.id, rating: x.rating, message: x.message, displayName: x.permission === "Yes, anonymously" ? "Anonymous" : (x.name?.trim().split(/\s+/)[0] || "Visitor") }));
      return json(200, { feedback });
    } catch { return json(500, { error: "Feedback is temporarily unavailable." }); }
  }
  if (request.method !== "POST") return json(405, { error: "Method not allowed." });
  try {
    const body = await request.json();
    if (body.website) return json(200, { ok: true }); // honeypot
    const name = String(body.name || "").trim().slice(0,100);
    const email = String(body.email || "").trim().slice(0,200);
    const message = String(body.message || "").trim().slice(0,3000);
    const rating = Number(body.rating);
    const permission = ["No, keep my feedback private", "Yes, with my first name only", "Yes, anonymously"].includes(body.permission) ? body.permission : "No, keep my feedback private";
    if (!message || message.length < 8 || !Number.isInteger(rating) || rating < 1 || rating > 5) return json(400, { error: "Please provide a message and select a rating from 1 to 5." });
    const item = { id: crypto.randomUUID(), name, email, rating, message, permission, status: "pending", createdAt: new Date().toISOString() };
    const all = await readAll(store); all.unshift(item); await store.setJSON(KEY, all);
    // Notifications are best-effort; submission remains safely stored even if a provider is not configured.
    await Promise.allSettled([notifyByEmail(item), notifyByWhatsApp(item)]);
    return json(201, { ok: true, message: "Your feedback was sent privately for review." });
  } catch (error) { console.error("Feedback submission failed", error); return json(500, { error: "Could not save your feedback. Please try again later." }); }
};
