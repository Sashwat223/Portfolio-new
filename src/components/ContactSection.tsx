import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PROFILE } from '../data/portfolioData';
import { AlertCircle, CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string; // honeypot
}

export const ContactSection: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setFeedback(
          data.error || 'Unable to deliver your message right now. Please try again or email directly.'
        );
        return;
      }

      setStatus('success');
      setFeedback(data.message || 'Your message has been delivered successfully.');
      setForm({ name: '', email: '', subject: '', message: '', website: '' });
    } catch {
      setStatus('error');
      setFeedback('Network error while contacting the mail server. Please try again later.');
    }
  };

  return (
    <section id="contact" className="relative py-28 md:py-40 px-6 md:px-12 lg:px-20 bg-[#06161E]/80">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[#7EC4D8] mb-3">
            CONTACT
          </div>
          <h2 className="font-condensed text-4xl sm:text-6xl font-bold uppercase tracking-wide text-[#EFECE3] hover-blue-gradient cursor-default">
            Start a Conversation
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Direct Coordinates */}
          <div className="lg:col-span-5 space-y-8">
            <p className="text-base text-[#98B2BD] leading-relaxed">
              Open to opportunities across finance, data analytics, AI engineering, automation systems, and creative
              collaborations.
            </p>

            <div className="space-y-4">
              <a
                href={`mailto:${PROFILE.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#09202B]/80 hover:bg-[#10303F] transition-colors"
              >
                <Mail className="w-5 h-5 text-[#D4AF7A] shrink-0" />
                <div>
                  <div className="font-mono-tech text-[10px] uppercase tracking-[0.18em] text-[#98B2BD]">EMAIL</div>
                  <div className="text-sm text-[#EFECE3]">{PROFILE.email}</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#09202B]/80">
                <Phone className="w-5 h-5 text-[#7EC4D8] shrink-0" />
                <div>
                  <div className="font-mono-tech text-[10px] uppercase tracking-[0.18em] text-[#98B2BD]">PHONE</div>
                  <div className="text-sm text-[#EFECE3]">{PROFILE.phone}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#09202B]/80">
                <MapPin className="w-5 h-5 text-[#D4AF7A] shrink-0" />
                <div>
                  <div className="font-mono-tech text-[10px] uppercase tracking-[0.18em] text-[#98B2BD]">LOCATION</div>
                  <div className="text-sm text-[#EFECE3]">{PROFILE.location}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Real Backend Email Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 rounded-3xl p-7 sm:p-10 space-y-5 shadow-[0_28px_65px_rgba(0,0,0,0.45)]"
            style={{
              background:
                'linear-gradient(135deg, rgba(20, 58, 74, 0.65) 0%, rgba(8, 25, 34, 0.92) 100%)',
            }}
          >
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block font-mono-tech text-[10px] uppercase tracking-[0.18em] text-[#98B2BD] mb-2"
                >
                  NAME
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-[#EFECE3]/10 bg-[#06151D]/90 px-4 py-3 text-sm text-[#EFECE3] placeholder:text-[#98B2BD]/50 focus:border-[#7EC4D8] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block font-mono-tech text-[10px] uppercase tracking-[0.18em] text-[#98B2BD] mb-2"
                >
                  EMAIL
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#EFECE3]/10 bg-[#06151D]/90 px-4 py-3 text-sm text-[#EFECE3] placeholder:text-[#98B2BD]/50 focus:border-[#7EC4D8] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block font-mono-tech text-[10px] uppercase tracking-[0.18em] text-[#98B2BD] mb-2"
              >
                SUBJECT
              </label>
              <input
                id="contact-subject"
                type="text"
                required
                minLength={3}
                maxLength={150}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Project, opportunity, or collaboration"
                className="w-full rounded-xl border border-[#EFECE3]/10 bg-[#06151D]/90 px-4 py-3 text-sm text-[#EFECE3] placeholder:text-[#98B2BD]/50 focus:border-[#7EC4D8] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block font-mono-tech text-[10px] uppercase tracking-[0.18em] text-[#98B2BD] mb-2"
              >
                MESSAGE
              </label>
              <textarea
                id="contact-message"
                required
                minLength={10}
                maxLength={3000}
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about what you're building or how we can work together..."
                className="w-full rounded-xl border border-[#EFECE3]/10 bg-[#06151D]/90 px-4 py-3 text-sm text-[#EFECE3] placeholder:text-[#98B2BD]/50 focus:border-[#7EC4D8] focus:outline-none transition-colors resize-y"
              />
            </div>

            {status === 'success' && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#EFECE3] hover:bg-[#D4AF7A] disabled:opacity-60 text-[#071922] font-mono-tech text-xs font-semibold uppercase tracking-[0.18em] px-8 py-3.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
