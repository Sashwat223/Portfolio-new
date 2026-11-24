import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sashwat@112';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../data');
const messagesFile = path.join(dataDir, 'messages.json');

export interface StoredMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  emailDelivered: boolean;
}

function readMessages(): StoredMessage[] {
  try {
    if (!fs.existsSync(messagesFile)) return [];
    const raw = fs.readFileSync(messagesFile, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeMessages(messages: StoredMessage[]): void {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf-8');
}

app.use(cors());
app.use(express.json({ limit: '32kb' }));

// In-memory rate limiter per IP
const rateMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(key: string, maxRequests: number): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > maxRequests;
}

// Active admin session tokens (in-memory)
const adminTokens = new Map<string, number>();
const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const expiresAt = token ? adminTokens.get(token) : undefined;
  if (!expiresAt || Date.now() > expiresAt) {
    if (token) adminTokens.delete(token);
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(100),
  email: z.string().trim().email('Please provide a valid email address.').max(150),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters.').max(150),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.').max(3000),
  website: z.string().optional(),
});

app.get('/api/health', (_req, res) => {
  const smtpConfigured = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
  res.json({ ok: true, smtpConfigured });
});

app.post('/api/contact', async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(`contact:${ip}`, 5)) {
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

  if (website && website.trim().length > 0) {
    res.status(400).json({ error: 'Spam check failed.' });
    return;
  }

  const entry: StoredMessage = {
    id: crypto.randomUUID(),
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
    emailDelivered: false,
  };

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'sashwatdhakal224@gmail.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || user;

  if (host && user && pass) {
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
      entry.emailDelivered = true;
    } catch (err) {
      console.error('SMTP delivery failed (message still saved to repository):', err);
    }
  }

  // Persist message in local repository
  const all = readMessages();
  all.unshift(entry);
  writeMessages(all);

  if (entry.emailDelivered) {
    res.status(200).json({
      ok: true,
      emailDelivered: true,
      message: 'Your message has been delivered to Sashwat Dhakal.',
    });
    return;
  }

  res.status(200).json({
    ok: true,
    emailDelivered: false,
    message:
      'Your message has been saved to Sashwat’s inbox (direct SMTP email relay is not configured on this server).',
  });
});

// Hidden Admin Authentication & Message Repository Endpoints
app.post('/api/admin/login', (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(`admin:${ip}`, 10)) {
    res.status(429).json({ error: 'Too many attempts. Try again later.' });
    return;
  }
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid password.' });
    return;
  }
  const token = crypto.randomBytes(24).toString('hex');
  adminTokens.set(token, Date.now() + TOKEN_TTL_MS);
  res.json({ ok: true, token });
});

app.get('/api/admin/messages', requireAdmin, (_req, res) => {
  res.json({ messages: readMessages() });
});

app.delete('/api/admin/messages/:id', requireAdmin, (req, res) => {
  const id = req.params.id;
  const current = readMessages();
  const next = current.filter((m) => m.id !== id);
  writeMessages(next);
  res.json({ ok: true, messages: next });
});

// Serve built frontend in production
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
