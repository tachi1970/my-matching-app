import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINE_GREEN = "#06C755";

export default function LineConnectModal({ onClose, onRegister }) {
  const [phase, setPhase] = useState("adding"); // 'adding' | 'success'

  useEffect(() => {
    const t = setTimeout(() => setPhase("success"), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* 背景オーバーレイ */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={phase === "success" ? onClose : undefined}
        />

        {/* モーダルカード */}
        <motion.div
          className="relative w-full max-w-md bg-white rounded-t-3xl overflow-hidden shadow-2xl"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 320 }}
        >
          {/* LINE ヘッダー */}
          <div style={{ backgroundColor: LINE_GREEN }} className="px-5 pt-6 pb-5">
            <div className="flex items-center gap-4">
              {/* LINEアイコン */}
              <div className="w-[60px] h-[60px] bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                <LineIcon size={40} />
              </div>
              <div>
                <p className="text-white font-black text-lg leading-tight">DentConnect</p>
                <p className="text-white/80 text-sm font-medium">公式LINEアカウント</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 bg-white/70 rounded-full" />
                  <span className="text-white/70 text-xs">認証済みアカウント</span>
                </div>
              </div>
            </div>
          </div>

          {/* コンテンツ */}
          <div className="px-5 py-6 min-h-[280px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {phase === "adding" ? (
                <motion.div
                  key="adding"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-8 gap-5"
                >
                  {/* スピナー */}
                  <div className="relative w-16 h-16">
                    <svg className="animate-spin w-16 h-16" viewBox="0 0 64 64" fill="none">
                      <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="5" />
                      <path
                        d="M32 4 A28 28 0 0 1 60 32"
                        stroke={LINE_GREEN}
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div
                      className="absolute inset-0 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: `${LINE_GREEN}15` }}
                    >
                      <LineIcon size={24} color={LINE_GREEN} />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-700 text-base">友だち追加しています...</p>
                    <p className="text-gray-400 text-sm mt-1">DentConnect公式アカウント</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col gap-4"
                >
                  {/* 完了ヘッダー */}
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12, stiffness: 260, delay: 0.1 }}
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: LINE_GREEN }}
                    >
                      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                    <div>
                      <p className="font-black text-gray-900 text-base leading-tight">友だち追加しました！</p>
                      <p className="text-gray-500 text-xs mt-0.5">DentConnect公式アカウント</p>
                    </div>
                  </div>

                  {/* LINE風メッセージバブル */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-50 rounded-2xl rounded-tl-md p-4 border border-gray-100"
                  >
                    <div className="flex items-start gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: LINE_GREEN }}>
                        <LineIcon size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-1">DentConnect</p>
                        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 max-w-[240px]">
                          <p className="text-sm text-gray-800 leading-relaxed">
                            🦷 DentConnectへようこそ！<br />
                            友だち追加ありがとうございます🎉<br /><br />
                            今すぐ無料で会員登録して、全国の歯科医院を探してみましょう！
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* ボタン */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2 pt-1"
                  >
                    <button
                      onClick={onRegister}
                      className="w-full py-4 text-white font-bold text-base rounded-2xl shadow-md transition-opacity active:opacity-80"
                      style={{ backgroundColor: LINE_GREEN }}
                    >
                      続けて会員登録する →
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full py-3 text-gray-400 font-semibold text-sm"
                    >
                      あとで登録する
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* セーフエリア */}
          <div className="h-safe-area-bottom bg-white" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function LineIcon({ size = 32, color = "white" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* LINE のスピーチバブル風シンプルアイコン */}
      <path
        d="M20 6C12.268 6 6 11.477 6 18.2c0 3.956 2.1 7.48 5.4 9.837l-1.4 5.163 5.8-2.9c1.35.37 2.78.57 4.2.57 7.732 0 14-5.477 14-12.2S27.732 6 20 6z"
        fill={color}
      />
      <circle cx="14" cy="18" r="1.8" fill={color === "white" ? "#06C755" : "white"} />
      <circle cx="20" cy="18" r="1.8" fill={color === "white" ? "#06C755" : "white"} />
      <circle cx="26" cy="18" r="1.8" fill={color === "white" ? "#06C755" : "white"} />
    </svg>
  );
}
