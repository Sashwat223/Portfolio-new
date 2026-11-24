import React, { useState } from 'react';
import { Lock, Mail, RefreshCw, Trash2, X } from 'lucide-react';

interface StoredMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  emailDelivered: boolean;
}

interface AdminInboxModalProps {
  open: boolean;
  onClose: () => void;
}

export const AdminInboxModal: React.FC<AdminInboxModalProps> = ({ open, onClose }) => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const fetchMessages = async (authToken: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) {
        setToken(null);
        setError('Session expired. Please unlock again.');
        return;
      }
      const data = await res.json();
      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch {
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 404 || res.status === 405) {
        setError('Admin API not available on this host (requires Node server or Vercel Functions).');
        setLoading(false);
        return;
      }
      if (!res.ok || !data.token) {
        setError(data.error || 'Access denied.');
        setLoading(false);
        return;
      }
      setToken(data.token);
      setPassword('');
      await fetchMessages(data.token);
    } catch {
      setError('Network error.');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data.messages) ? data.messages : []);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Private message repository"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl border border-[#7EC4D8]/25 bg-[#071922] text-[#EFECE3] shadow-[0_30px_80px_rgba(0,0,0,0.75)] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2 font-mono-tech text-xs tracking-[0.18em] uppercase text-[#7EC4D8]">
            <Lock className="w-3.5 h-3.5" />
            <span>Message Vault</span>
          </div>
          <div className="flex items-center gap-2">
            {token && (
              <button
                type="button"
                onClick={() => fetchMessages(token)}
                aria-label="Refresh messages"
                className="p-1.5 rounded-lg text-[#98B2BD] hover:text-[#EFECE3] hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-lg text-[#98B2BD] hover:text-[#EFECE3] hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {!token ? (
            <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto py-6">
              <label
                htmlFor="vault-pass"
                className="block font-mono-tech text-[10px] uppercase tracking-[0.18em] text-[#98B2BD]"
              >
                Access Key
              </label>
              <input
                id="vault-pass"
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-white/15 bg-[#051218] px-4 py-2.5 text-sm text-[#EFECE3] focus:border-[#7EC4D8] focus:outline-none"
              />
              {error && <p className="text-xs text-rose-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#EFECE3] hover:bg-[#7EC4D8] text-[#071922] font-mono-tech text-xs font-semibold uppercase tracking-[0.16em] py-2.5 transition-colors cursor-pointer"
              >
                {loading ? 'Verifying...' : 'Unlock'}
              </button>
            </form>
          ) : messages.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#98B2BD]">
              No messages in repository yet.
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-white/10 bg-[#0A222D]/80 p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-sm text-[#EFECE3]">{m.subject}</div>
                      <div className="text-xs text-[#7EC4D8] flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span>
                          {m.name} ({m.email})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono-tech text-[10px] text-[#98B2BD]">
                        {new Date(m.createdAt).toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id)}
                        aria-label="Delete message"
                        className="p-1 text-[#98B2BD] hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#EFECE3]/90 whitespace-pre-wrap leading-relaxed pt-1">
                    {m.message}
                  </p>
                  <div className="font-mono-tech text-[9px] uppercase tracking-[0.14em] text-[#98B2BD]">
                    {m.emailDelivered ? 'SMTP DELIVERED + STORED' : 'STORED IN VAULT'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
