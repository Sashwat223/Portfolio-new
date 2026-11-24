import type { IncomingMessage, ServerResponse } from 'http';
import { readMessages, verifyAdminToken, writeMessages } from '../../_lib/store.js';

interface Req extends IncomingMessage {
  query?: { id?: string | string[] };
}

interface Res extends ServerResponse {
  status: (code: number) => Res;
  json: (data: unknown) => void;
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'DELETE') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const rawId = req.query?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const current = await readMessages();
  const next = current.filter((m) => m.id !== id);
  await writeMessages(next);
  res.status(200).json({ ok: true, messages: next });
}
