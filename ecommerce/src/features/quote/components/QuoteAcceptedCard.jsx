import { CheckCircle } from 'lucide-react';

export default function QuoteAcceptedCard({ data }) {
  const { quoteId } = data;

  return (
    <div className="rounded-xl border-2 border-green-200 bg-green-50/60 px-4 py-3 max-w-[300px]">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
          <CheckCircle size={13} />
        </span>
        <div>
          <div className="text-[12px] font-black text-[#0d1b2a]">
            Offre acceptée
          </div>
          <div className="text-[11px] text-green-700">
            {quoteId ? `Devis #${quoteId}` : 'Le devis'} a été accepté par le client.
          </div>
        </div>
      </div>
    </div>
  );
}
