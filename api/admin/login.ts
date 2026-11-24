import type { IncomingMessage, ServerResponse } from 'http';
import { getAdminPassword, signAdminToken } from '../_lib/store.js';

interface Req extends IncomingMessage {
  body?: { password?: string };
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

  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (password !== getAdminPassword()) {
    res.status(401).json({ error: 'Invalid password.' });
    return;
  }

  const token = signAdminToken();
  res.status(200).json({ ok: true, token });
}
