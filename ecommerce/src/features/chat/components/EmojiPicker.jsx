const EMOJIS = [
  '😀', '😁', '😂', '🤣', '😊', '😍', '😘', '😎',
  '🤩', '🥳', '😢', '😭', '😅', '🤔', '😉', '🙃',
  '😴', '🤗', '🤭', '😡', '👍', '👎', '👌', '🙏',
  '🤝', '👏', '💪', '❤️', '🧡', '💛', '💚', '💙',
  '💜', '🖤', '💯', '✨', '🎉', '🔥', '🎁', '⭐',
  '✅', '❌', '🙈', '💡', '💰', '🛒', '🚀', '📦',
];

export default function EmojiPicker({ onPick }) {
  return (
    <div className="absolute bottom-full left-0 mb-2 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-2 w-[264px]">
      <div className="grid grid-cols-8 gap-0.5">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onPick(emoji)}
            className="w-7 h-7 flex items-center justify-center text-[17px] rounded hover:bg-gray-100 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
