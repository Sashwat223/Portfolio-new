import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json({ limit: '32kb' }));

// Simple in-memory rate limiter per IP (5 requests per 15 minutes)
const rateMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(100),
  email: z.string().trim().email('Please provide a valid email address.').max(150),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters.').max(150),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.').max(3000),
  website: z.string().optional(), // honeypot
});

app.get('/api/health', (_req, res) => {
  const smtpConfigured = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
  res.json({ ok: true, smtpConfigured });
});

app.post('/api/contact', async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    res.status(429).json({
      error: 'Too many messages sent recently. Please wait a few minutes and try again.',
    });
    return;
  }

  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error.issues[0]?.message || 'Invalid form submission.',
    });
    return;
  }

  const { name, email, subject, message, website } = parsed.data;

  // Honeypot spam check: silently reject without sending
  if (website && website.trim().length > 0) {
    res.status(400).json({ error: 'Spam check failed.' });
    return;
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'sashwatdhakal224@gmail.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || user;

  if (!host || !user || !pass) {
    res.status(503).json({
      error:
        'Email delivery service is not configured on the server yet (missing SMTP_HOST/SMTP_USER/SMTP_PASS in .env). Please email sashwatdhakal224@gmail.com directly.',
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE !== 'false',
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${fromEmail}>`,
      to: toEmail,
      replyTo: `"${name}" <${email}>`,
      subject: `[Portfolio] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
          <h2>New Portfolio Inquiry</h2>
          <p><strong>Name:</strong> ${name.replace(/</g, '&lt;')}</p>
          <p><strong>Email:</strong> ${email.replace(/</g, '&lt;')}</p>
          <p><strong>Subject:</strong> ${subject.replace(/</g, '&lt;')}</p>
          <hr />
          <p style="white-space: pre-wrap;">${message.replace(/</g, '&lt;')}</p>
        </div>
      `,
    });

    res.status(200).json({
      ok: true,
      message: 'Your message has been delivered to Sashwat Dhakal.',
    });
  } catch (err) {
    console.error('SMTP delivery failed:', err);
    res.status(502).json({
      error:
        'The mail server rejected or failed to deliver the message. Please verify SMTP credentials or email sashwatdhakal224@gmail.com directly.',
    });
  }
});

// Serve built frontend in production
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
app.use(express.static(distDir));
app.get('/{*splat}', (_req, res, next) => {
  res.sendFile(path.join(distDir, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`Portfolio server listening on http://localhost:${PORT}`);
});
