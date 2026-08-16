import { useEffect, useRef, useState } from 'react';
import { Send, PackagePlus, Smile, ImagePlus, X } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

const MAX_TEXTAREA_HEIGHT = 96;

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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);
  const imagePreviewRef = useRef(null);
  const lastTypingRef = useRef(0);
  const stopTypingTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(stopTypingTimerRef.current), []);
  useEffect(
    () => () => {
      if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
    },
    [],
  );

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  };

  useEffect(() => {
    resizeTextarea();
  }, [text]);

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit(e);
    }
  };

  const clearImage = () => {
    if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
    imagePreviewRef.current = null;
    setImageFile(null);
    setImagePreview(null);
  };

  const submit = (e) => {
    e.preventDefault();
    if (disabled || isSending) return;
    if (!text.trim() && !imageFile) return;
    onStopTyping?.();
    clearTimeout(stopTypingTimerRef.current);
    if (imageFile) {
      onSendImage?.(imageFile, text);
    } else {
      onSendText(text);
    }
    clearImage();
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
    if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
    const url = URL.createObjectURL(file);
    imagePreviewRef.current = url;
    setImageFile(file);
    setImagePreview(url);
    setShowEmoji(false);
  };

  const canSend = !text.trim() && !imageFile;

  return (
    <form onSubmit={submit} className="relative border-t border-gray-100 bg-white p-3 flex flex-col gap-2">
      {showEmoji && <EmojiPicker onPick={pickEmoji} />}
      {imagePreview && (
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-100 p-2">
          <img src={imagePreview} alt="" className="h-12 w-12 rounded-md object-cover border border-gray-200" />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold text-[#0d1b2a] truncate">{imageFile?.name}</div>
            <div className="text-[10px] text-gray-400">Image prête à envoyer</div>
          </div>
          <button
            type="button"
            onClick={clearImage}
            title="Retirer l'image"
            className="shrink-0 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
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
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Écrivez votre message…"
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[13px] leading-snug focus:outline-none focus:ring-2 focus:ring-cyan-500/40 resize-none overflow-y-auto"
          style={{ maxHeight: MAX_TEXTAREA_HEIGHT }}
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
          disabled={disabled || canSend}
          className="shrink-0 p-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-40 transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
}
