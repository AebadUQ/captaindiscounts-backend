const nodemailer = require("nodemailer");

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure =
    process.env.SMTP_SECURE === "false" ? false : port === 465 || port === 994;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

/**
 * Notify inbox when someone submits the contact form.
 * Fails softly (logs only) — DB row is already saved.
 */
async function sendContactFormNotification(payload) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      "[mail] SMTP_HOST / SMTP_USER / SMTP_PASS not set; skipping contact email."
    );
    return;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const to = process.env.CONTACT_NOTIFY_TO || process.env.SMTP_USER;
  const subject =
    process.env.CONTACT_EMAIL_SUBJECT ||
    `[CaptainDiscounts] New contact #${payload.id}`;

  const text = [
    `New contact form submission (ID: ${payload.id})`,
    "",
    `Name: ${payload.firstName} ${payload.lastName}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    "",
    "Message:",
    payload.message,
    "",
    `Received: ${payload.createdAt || new Date().toISOString()}`,
  ].join("\n");

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>ID:</strong> ${escapeHtml(String(payload.id))}</p>
    <p><strong>Name:</strong> ${escapeHtml(payload.firstName)} ${escapeHtml(payload.lastName)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></p>
    <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit;background:#f5f5f5;padding:12px;border-radius:8px;">${escapeHtml(payload.message)}</pre>
  `;

  await transporter.sendMail({
    from,
    to,
    replyTo: payload.email,
    subject,
    text,
    html,
  });
}

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = { sendContactFormNotification, getTransporter };
