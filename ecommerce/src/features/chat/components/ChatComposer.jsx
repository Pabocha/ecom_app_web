import { useState } from 'react';
import { Send, PackagePlus } from 'lucide-react';

export default function ChatComposer({ onSendText, onOpenProductPicker, isSending, disabled }) {
  const [text, setText] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled || isSending) return;
    onSendText(text);
    setText('');
  };

  return (
    <form onSubmit={submit} className="border-t border-gray-100 bg-white p-3 flex items-center gap-2">
      {onOpenProductPicker && (
        <button
          type="button"
          onClick={onOpenProductPicker}
          disabled={disabled}
          title="Choisir un produit à retourner"
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 text-[12px] font-bold transition-colors disabled:opacity-40"
        >
          <PackagePlus size={16} /> Produit à retourner
        </button>
      )}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        placeholder="Écrivez votre message…"
        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="shrink-0 p-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-40 transition-colors"
      >
        <Send size={16} />
      </button>
    </form>
  );
}
