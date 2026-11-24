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
  const exp = Date.now() + 2 * 60 * 60 * 1000;
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

function getKvConfig() {
  const kvUrl = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/+$/, '');
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
  return kvUrl && kvToken ? { kvUrl, kvToken } : null;
}

export async function readMessages(): Promise<StoredMessage[]> {
  const kv = getKvConfig();

  if (kv) {
    try {
      const r = await fetch(kv.kvUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kv.kvToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['GET', 'portfolio_messages']),
      });
      if (!r.ok) return [];
      const data = (await r.json()) as { result?: string | null };
      if (!data.result) return [];
      const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      return Array.isArray(parsed) ? parsed : [];
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
  const kv = getKvConfig();

  if (kv) {
    const r = await fetch(kv.kvUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kv.kvToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['SET', 'portfolio_messages', JSON.stringify(messages)]),
    });
    if (!r.ok) {
      throw new Error(`Upstash KV write failed with status ${r.status}`);
    }
    return;
  }

  fs.writeFileSync(TMP_FILE, JSON.stringify(messages, null, 2), 'utf-8');
}
