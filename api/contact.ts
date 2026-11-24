import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { readMessages, writeMessages, type StoredMessage } from './_lib/store.js';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(100),
  email: z.string().trim().email('Please provide a valid email address.').max(150),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters.').max(150),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.').max(3000),
  website: z.string().optional(),
});

interface Req extends IncomingMessage {
  body?: unknown;
}

interface Res extends ServerResponse {
  status: (code: number) => Res;
  json: (data: unknown) => void;
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const rawBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const parsed = contactSchema.safeParse(rawBody);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid form submission.' });
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
          connectionTimeout: 5000,
          greetingTimeout: 5000,
          socketTimeout: 6000,
        });

        await transporter.sendMail({
          from: `"Portfolio Contact" <${fromEmail}>`,
          to: toEmail,
          replyTo: `"${name}" <${email}>`,
          subject: `[Portfolio] ${subject}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        });
        entry.emailDelivered = true;
      } catch (err) {
        console.error('SMTP delivery failed:', err);
      }
    }

    const all = await readMessages();
    all.unshift(entry);
    await writeMessages(all);

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
  } catch (err) {
    console.error('Contact API error:', err);
    res.status(500).json({ error: 'Server error while saving message.' });
  }
}
