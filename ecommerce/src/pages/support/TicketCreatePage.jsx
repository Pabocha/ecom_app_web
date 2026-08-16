import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Ticket } from 'lucide-react';
import TopBar from '@/components/shared/TopBar';
import { useCreateTicket } from '@/features/support/hooks/useTickets';
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from '@/features/support/utils/ticketMeta';

const EMPTY = { subject: '', category: 'commande', priority: 'moyenne', message: '' };

export default function TicketCreatePage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateTicket();
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [key]: null }));
  };

  const submit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.subject.trim()) errors.subject = 'Le sujet est requis.';
    if (!form.message.trim()) errors.message = 'Décrivez votre problème.';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    mutate(
      { subject: form.subject.trim(), message: form.message.trim(), category: form.category, priority: form.priority },
      {
        onSuccess: () => navigate('/support/tickets'),
      },
    );
  };

  const inputCls = (hasError) =>
    `w-full rounded-lg border px-3 py-2.5 text-[14px] outline-none transition-colors ${
      hasError
        ? 'border-red-400 focus:border-red-500'
        : 'border-gray-300 focus:border-cyan-500'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <TopBar />

      <div className="max-w-3xl mx-auto px-4 pt-6">
        <div className="rounded-lg bg-white shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
              <Ticket size={20} />
            </span>
            <div>
              <h1 className="font-['Barlow_Condensed'] text-[26px] font-black text-[#0d1b2a] leading-none">
                Ouvrir un ticket
              </h1>
              <p className="text-[12px] text-gray-500 mt-1">
                Notre équipe support vous répond généralement en moins de 2 heures.
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Sujet</label>
              <input
                value={form.subject}
                onChange={set('subject')}
                placeholder="Ex. : Suivi de ma commande"
                className={inputCls(fieldErrors.subject)}
              />
              {fieldErrors.subject && <p className="mt-1 text-[12px] text-red-500">{fieldErrors.subject}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Catégorie</label>
                <select value={form.category} onChange={set('category')} className={inputCls(false)}>
                  {TICKET_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Priorité</label>
                <select value={form.priority} onChange={set('priority')} className={inputCls(false)}>
                  {TICKET_PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Message</label>
              <textarea
                value={form.message}
                onChange={set('message')}
                rows={6}
                placeholder="Décrivez votre problème en détail..."
                className={inputCls(fieldErrors.message)}
              />
              {fieldErrors.message && <p className="mt-1 text-[12px] text-red-500">{fieldErrors.message}</p>}
            </div>

            {error && (
              <p className="text-[13px] text-red-500">
                {error?.response?.data?.detail || "Impossible d'envoyer le ticket. Réessayez."}
              </p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 px-6 py-2.5 text-[14px] font-bold text-white disabled:opacity-40 transition-colors"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Ticket size={16} />}
                Envoyer le ticket
              </button>
              <button
                type="button"
                onClick={() => navigate('/help')}
                className="rounded-lg px-5 py-2.5 text-[14px] font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
