import { motion } from "framer-motion";

export default function BottomActionBar({ onSkip, onSuperLike, onLike, disabled }) {
  return (
    <div className="fixed bottom-14 left-0 right-0 z-40 flex justify-center">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md border-t border-gray-100 px-8 py-4 flex items-center justify-between">
        <ActionButton
          onClick={onSkip}
          disabled={disabled}
          color="bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-400"
          label="スキップ"
          icon="✕"
          size="w-16 h-16"
        />
        <ActionButton
          onClick={onSuperLike}
          disabled={disabled}
          color="bg-yellow-50 text-yellow-500 hover:bg-yellow-100 hover:text-yellow-600"
          label="スーパーライク"
          icon="★"
          size="w-20 h-20"
          textSize="text-3xl"
        />
        <ActionButton
          onClick={onLike}
          disabled={disabled}
          color="bg-gray-100 text-red-400 hover:bg-red-50 hover:text-red-500"
          label="いいね"
          icon="♡"
          size="w-16 h-16"
        />
      </div>
    </div>
  );
}

function ActionButton({ onClick, disabled, color, label, icon, size, textSize = "text-2xl" }) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`
        ${size} rounded-full shadow-md flex items-center justify-center
        transition-colors duration-150 font-bold ${textSize}
        ${color}
        disabled:opacity-40 disabled:cursor-not-allowed
      `}
    >
      {icon}
    </motion.button>
  );
}
