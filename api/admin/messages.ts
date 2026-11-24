import type { IncomingMessage, ServerResponse } from 'http';
import { readMessages, verifyAdminToken } from '../_lib/store.js';

interface Res extends ServerResponse {
  status: (code: number) => Res;
  json: (data: unknown) => void;
}

export default async function handler(req: IncomingMessage, res: Res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const messages = await readMessages();
  res.status(200).json({ messages });
}
