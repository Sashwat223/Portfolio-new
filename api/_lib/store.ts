import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface StoredMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  emailDelivered: boolean;
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'sashwat@112';
}

export function signAdminToken(): string {
  const exp = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
  const payload = String(exp);
  const sig = crypto
    .createHmac('sha256', getAdminPassword())
    .update(payload)
    .digest('hex');
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const exp = Number(payload);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = crypto
    .createHmac('sha256', getAdminPassword())
    .update(payload)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

const TMP_FILE = path.join('/tmp', 'sashwat_portfolio_messages.json');

export async function readMessages(): Promise<StoredMessage[]> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      const r = await fetch(`${kvUrl}/get/portfolio_messages`, {
        headers: { Authorization: `Bearer ${kvToken}` },
      });
      const data = (await r.json()) as { result?: string };
      if (data.result) {
        const parsed = JSON.parse(data.result);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  }

  try {
    if (!fs.existsSync(TMP_FILE)) return [];
    const parsed = JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeMessages(messages: StoredMessage[]): Promise<void> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    await fetch(`${kvUrl}/set/portfolio_messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(messages)),
    });
    return;
  }

  fs.writeFileSync(TMP_FILE, JSON.stringify(messages, null, 2), 'utf-8');
}
