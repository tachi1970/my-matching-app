import { AnimatePresence, motion } from "framer-motion";

const NORMAL_CONFETTI = ["🎉", "⭐", "✨", "💖", "🌟", "🦷", "🎊", "💫", "🎈", "💝", "🌈", "🏆"];
const SUPER_CONFETTI  = ["⭐", "★", "✨", "💛", "🌟", "💫", "⚡", "🔆", "✦", "💎", "👑", "🎯"];

export default function MatchPopup({
  visible,
  partnerName,
  onGoToChat,
  onDismiss,
  isSuperLike = false,
}) {
  const confetti = isSuperLike ? SUPER_CONFETTI : NORMAL_CONFETTI;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 backdrop-blur-sm ${
              isSuperLike ? "bg-amber-900/60" : "bg-black/60"
            }`}
          />

          {/* Card */}
          <motion.div
            className={`relative w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl overflow-hidden ${
              isSuperLike
                ? "bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400"
                : "bg-white"
            }`}
            initial={{ scale: 0.7, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 320 }}
          >
            {/* Confetti burst */}
            {confetti.map((emoji, i) => (
              <motion.span
                key={i}
                className="absolute text-xl pointer-events-none select-none"
                style={{ top: "35%", left: "50%" }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((i * 30 * Math.PI) / 180) * 110,
                  y: Math.sin((i * 30 * Math.PI) / 180) * 110,
                  opacity: 0,
                  scale: isSuperLike ? 1.4 : 0.5,
                }}
                transition={{ duration: isSuperLike ? 0.9 : 0.7, delay: 0.15, ease: "easeOut" }}
              >
                {emoji}
              </motion.span>
            ))}

            {/* Crown / character */}
            <motion.div
              className="mb-5"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: [0, 1.35, 1], rotate: [0, 10, 0] }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              {isSuperLike ? (
                <div className="text-8xl drop-shadow-xl">👑</div>
              ) : (
                <>
                  <img
                    src="/mushi_popup.png"
                    alt="キャラクター"
                    className="w-32 h-32 mx-auto drop-shadow-xl"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <div className="text-8xl" style={{ display: "none" }}>🎊</div>
                </>
              )}
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              {isSuperLike ? (
                <>
                  <h2 className="text-2xl font-black text-yellow-900 mb-1">
                    ⭐ スーパーマッチ！
                  </h2>
                  <p className="text-yellow-800 text-sm leading-relaxed mb-7">
                    <span className="font-semibold">{partnerName}</span>
                    から<br />
                    <span className="font-black text-yellow-900 text-base">先にメッセージが届きました！</span>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">
                    マッチング成立！🎉
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-7">
                    <span className="font-semibold text-gray-700">{partnerName}</span>
                    とマッチしました。<br />
                    さっそくトークしてみましょう！
                  </p>
                </>
              )}
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <button
                onClick={onGoToChat}
                className={`w-full font-bold py-4 rounded-2xl text-base shadow-md transition-colors ${
                  isSuperLike
                    ? "bg-yellow-900 text-yellow-100 hover:bg-yellow-950 shadow-yellow-800/30"
                    : "bg-teal-500 hover:bg-teal-600 text-white shadow-teal-200"
                }`}
              >
                {isSuperLike ? "💌 返信する" : "💬 トークルームへ進む"}
              </button>
              <button
                onClick={onDismiss}
                className={`w-full text-sm py-2 transition-colors ${
                  isSuperLike
                    ? "text-yellow-800 hover:text-yellow-950"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                後で（スワイプに戻る）
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
