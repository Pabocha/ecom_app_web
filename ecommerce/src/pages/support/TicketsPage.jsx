import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Loader2, MessageSquarePlus, Plus, Ticket } from 'lucide-react';
import TopBar from '@/components/shared/TopBar';
import { useMyTickets, useTicket, useReplyTicket } from '@/features/support/hooks/useTickets';
import { TICKET_CATEGORIES, TICKET_PRIORITIES, ticketStatusMeta } from '@/features/support/utils/ticketMeta';

function categoryLabel(value) {
  return TICKET_CATEGORIES.find((c) => c.value === value)?.label || value;
}

function priorityLabel(value) {
  return TICKET_PRIORITIES.find((p) => p.value === value)?.label || value;
}

const PRIORITY_BADGE = {
  basse: 'bg-gray-100 text-gray-600',
  moyenne: 'bg-amber-100 text-amber-700',
  haute: 'bg-red-100 text-red-700',
};

function TicketDetail({ ticketId }) {
  const { data: ticket, isLoading } = useTicket(ticketId);
  const reply = useReplyTicket(ticketId);
  const [draft, setDraft] = useState('');

  if (isLoading) {
    return (
      <div className="border-t border-gray-100 px-5 py-8 text-center">
        <Loader2 size={18} className="mx-auto animate-spin text-cyan-500" />
      </div>
    );
  }

  const sendReply = () => {
    const text = draft.trim();
    if (!text || reply.isPending) return;
    reply.mutate(text, { onSuccess: () => setDraft('') });
  };

  return (
    <div className="border-t border-gray-100 bg-gray-50/60">
      <div className="px-5 py-4 space-y-3">
        <div className="rounded-lg bg-white border border-gray-200 p-4">
          <p className="text-[13px] text-gray-700 whitespace-pre-wrap leading-relaxed">{ticket?.message}</p>
        </div>

        {(ticket?.messages || []).map((m) => (
          <div key={m.id} className="rounded-lg bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 text-[11px] font-black">
                {(m.user?.first_name || m.user?.email || '?').slice(0, 1).toUpperCase()}
              </span>
              <span className="text-[12px] font-bold text-gray-700">
                {m.user?.first_name || m.user?.email || 'Support TradeHub'}
              </span>
              <span className="ml-auto text-[11px] text-gray-400">
                {m.created_at ? new Date(m.created_at).toLocaleString('fr-FR') : ''}
              </span>
            </div>
            <p className="text-[13px] text-gray-700 whitespace-pre-wrap leading-relaxed">{m.message}</p>
          </div>
        ))}

        {ticket?.status === 'ferme' ? (
          <p className="text-[12px] text-gray-500 bg-white border border-gray-200 rounded-lg p-3">
            Ce ticket est fermé. Ouvrez un nouveau ticket si le problème persiste.
          </p>
        ) : (
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendReply()}
              placeholder="Écrire une réponse..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-[13px] outline-none focus:border-cyan-500"
            />
            <button
              onClick={sendReply}
              disabled={reply.isPending || !draft.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 px-4 text-[13px] font-bold text-white disabled:opacity-40 transition-colors"
            >
              {reply.isPending ? <Loader2 size={14} className="animate-spin" /> : <MessageSquarePlus size={14} />}
              Répondre
            </button>
          </div>
        )}
        {reply.error && (
          <p className="text-[12px] text-red-500">
            {reply.error?.response?.data?.detail || "Impossible d'envoyer la réponse."}
          </p>
        )}
      </div>
    </div>
  );
}

export default function TicketsPage() {
  const navigate = useNavigate();
  const { data: tickets = [], isLoading, error } = useMyTickets();
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId((cur) => (cur === id ? null : id));

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
              <Ticket size={20} />
            </span>
            <div>
              <h1 className="font-['Barlow_Condensed'] text-[26px] font-black text-[#0d1b2a] leading-none">
                Mes tickets
              </h1>
              <p className="text-[12px] text-gray-500 mt-1">Suivez vos demandes auprès du support.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/support/tickets/new')}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 px-4 py-2.5 text-[13px] font-bold text-white transition-colors"
          >
            <Plus size={16} />
            Nouveau ticket
          </button>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-5 animate-pulse">
                <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-white rounded-lg shadow-sm p-10 text-center">
            <p className="text-[13px] text-red-500">Une erreur est survenue lors du chargement des tickets.</p>
            <button onClick={() => window.location.reload()} className="mt-3 text-[13px] font-bold text-cyan-600 hover:underline">
              Réessayer
            </button>
          </div>
        )}

        {!isLoading && !error && tickets.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Ticket size={44} className="mx-auto mb-3 text-gray-300" />
            <h3 className="text-[16px] font-black text-[#0d1b2a] mb-1">Aucun ticket</h3>
            <p className="text-[13px] text-gray-400 mb-4">Vous n'avez pas encore ouvert de ticket.</p>
            <button
              onClick={() => navigate('/support/tickets/new')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-lg text-[13px] font-black transition-colors"
            >
              Ouvrir un ticket
            </button>
          </div>
        )}

        {!isLoading && !error && tickets.length > 0 && (
          <div className="space-y-3">
            {tickets.map((t) => {
              const status = ticketStatusMeta(t.status);
              const expanded = expandedId === t.id;
              return (
                <div key={t.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggle(t.id)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] font-black text-cyan-600">{t.ticket_number}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-[14px] font-bold text-[#0d1b2a] truncate">{t.subject}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-gray-400">{categoryLabel(t.category)}</span>
                        <span className="text-[11px] text-gray-300">•</span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${PRIORITY_BADGE[t.priority] || 'bg-gray-100 text-gray-600'}`}>
                          {priorityLabel(t.priority)}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {t.created_at ? new Date(t.created_at).toLocaleDateString('fr-FR') : ''}
                        </span>
                      </div>
                    </div>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </button>
                  {expanded && <TicketDetail ticketId={t.id} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
