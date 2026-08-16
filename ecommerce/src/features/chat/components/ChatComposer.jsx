import { useEffect, useRef, useState } from 'react';
import { Send, PackagePlus, Smile, ImagePlus } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

export default function ChatComposer({
  onSendText,
  onOpenProductPicker,
  onSendImage,
  onTyping,
  onStopTyping,
  isSending,
  disabled,
}) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const fileRef = useRef(null);
  const lastTypingRef = useRef(0);
  const stopTypingTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(stopTypingTimerRef.current), []);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    if (value.trim() && onTyping) {
      const now = Date.now();
      if (now - lastTypingRef.current > 2000) {
        lastTypingRef.current = now;
        onTyping();
      }
    }
    clearTimeout(stopTypingTimerRef.current);
    stopTypingTimerRef.current = setTimeout(() => onStopTyping?.(), 1500);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled || isSending) return;
    onStopTyping?.();
    clearTimeout(stopTypingTimerRef.current);
    onSendText(text);
    setText('');
  };

  const pickEmoji = (emoji) => {
    setText((t) => t + emoji);
  };

  const pickImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || disabled || isSending) return;
    onStopTyping?.();
    clearTimeout(stopTypingTimerRef.current);
    onSendImage?.(file, text);
    setText('');
    setShowEmoji(false);
  };

  return (
    <form onSubmit={submit} className="relative border-t border-gray-100 bg-white p-3 flex items-center gap-2">
      {showEmoji && <EmojiPicker onPick={pickEmoji} />}
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
      <button
        type="button"
        onClick={() => setShowEmoji((v) => !v)}
        disabled={disabled}
        title="Émojis"
        className="shrink-0 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-40"
      >
        <Smile size={18} />
      </button>
      <input
        value={text}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Écrivez votre message…"
        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
      />
      {onSendImage && (
        <>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickImage} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={disabled}
            title="Envoyer une image"
            className="shrink-0 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-40"
          >
            <ImagePlus size={18} />
          </button>
        </>
      )}
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
