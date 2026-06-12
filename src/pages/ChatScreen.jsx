import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import BottomTabBar from "../components/common/BottomTabBar";

const clock = () =>
  new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

const FREE_LIMIT = 3;

function buildInitialMessages(mode) {
  const text =
    mode === "clinic"
      ? "マッチングありがとうございます！DentConnectで登録している歯科大生です。ぜひ一度、医院の見学にお伺いしたいです！"
      : "マッチングありがとうございます！大阪大学出身の院長です。見学はいつでも大歓迎なので、まずは気軽にお話ししましょう！いつ頃がご都合よろしいですか？";
  return [{ id: 1, sender: "partner", text, time: "14:32" }];
}

export default function ChatScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, clinicPlan } = useApp();

  const fallback = mode === "clinic" ? "田中 花子 さん" : "さくら歯科クリニック 院長";
  const partnerName = location.state?.partnerName ?? fallback;

  const [messages, setMessages] = useState(() => buildInitialMessages(mode));
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);

  // 自分が送ったメッセージ数
  const sentCount = messages.filter((m) => m.sender === "me").length;
  const isClinicFree = mode === "clinic" && clinicPlan === "free";
  const isPaywalled = isClinicFree && sentCount >= FREE_LIMIT;
  // null = 制限なし、n = 残り n 通
  const freeRemaining = isClinicFree ? Math.max(0, FREE_LIMIT - sentCount) : null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    const text = input.trim();
    if (!text || isSending || isPaywalled) return;

    const myMsg = { id: Date.now(), sender: "me", text, time: clock() };
    setMessages((prev) => [...prev, myMsg]);
    setInput("");
    setIsSending(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "partner",
          text: "ありがとうございます！ぜひお待ちしています。詳細はまたこちらでご連絡しますね😊",
          time: clock(),
        },
      ]);
      setIsSending(false);
    }, 1000);
  }

  return (
    <div className="flex flex-col max-h-[calc(100svh-56px)] h-[calc(100svh-56px)] max-w-md mx-auto bg-white">
      {/* チャットヘッダー */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors text-lg"
        >
          ←
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center flex-shrink-0 shadow-sm">
          <img
            src="/mushi_icon.png"
            alt=""
            className="w-7 h-7"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <span className="text-white text-base" style={{ display: "none" }}>🦷</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{partnerName}</p>
          <p className="text-xs text-teal-500 font-medium">オンライン</p>
        </div>

        {/* 無料残数インジケーター（ヘッダー右） */}
        {isClinicFree && !isPaywalled && (
          <div
            className={`text-xs font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${
              freeRemaining === 1
                ? "bg-red-50 border-red-200 text-red-500"
                : freeRemaining === 2
                ? "bg-amber-50 border-amber-200 text-amber-600"
                : "bg-gray-50 border-gray-200 text-gray-500"
            }`}
          >
            残{freeRemaining}通
          </div>
        )}
      </header>

      {/* メッセージリスト */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-white">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className={`flex items-end gap-2 ${
              msg.sender === "me" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {msg.sender === "partner" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center flex-shrink-0 text-sm shadow-sm">
                🦷
              </div>
            )}
            <div
              className={`flex flex-col gap-1 max-w-[76%] ${
                msg.sender === "me" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "me"
                    ? "bg-teal-500 text-white rounded-br-md shadow-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-xs text-gray-400 px-1">{msg.time}</span>
            </div>
          </motion.div>
        ))}

        {/* 入力中インジケーター */}
        <AnimatePresence>
          {isSending && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-sm">
                🦷
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* 入力エリア or ペイウォール */}
      {isPaywalled ? (
        <div className="relative flex-shrink-0">
          {/* グラデーションフェード */}
          <div className="absolute bottom-full left-0 right-0 h-28 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />
          {/* ペイウォールカード */}
          <div className="bg-white border-t border-gray-100 px-6 pt-5 pb-8 text-center">
            <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-3 text-2xl">
              🔒
            </div>
            <p className="text-gray-900 font-bold text-sm mb-1">
              メッセージの上限（3通）に達しました
            </p>
            <p className="text-gray-500 text-xs mb-5 leading-relaxed">
              スタンダードプランにアップグレードすると<br />
              メッセージを無制限に送れます
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/pricing")}
              className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-2xl shadow-md shadow-violet-100 text-sm"
            >
              プランをアップグレードする →
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="flex-shrink-0 bg-white border-t border-gray-100">
          {/* 残通数バー（clinic + free のみ） */}
          {isClinicFree && freeRemaining !== null && (
            <div
              className={`flex items-center justify-between px-4 py-2 border-b text-xs font-medium ${
                freeRemaining === 1
                  ? "bg-red-50 border-red-100 text-red-500"
                  : "bg-gray-50 border-gray-100 text-gray-500"
              }`}
            >
              <span>無料で送れるメッセージ：あと {freeRemaining} 通</span>
              <button
                onClick={() => navigate("/pricing")}
                className="text-violet-500 font-bold underline underline-offset-1"
              >
                無制限にする
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="メッセージを入力..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-300 transition-shadow"
            />
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={sendMessage}
              disabled={!input.trim() || isSending}
              className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-teal-600 transition-colors text-base font-bold shadow-sm"
            >
              ↑
            </motion.button>
          </div>
        </div>
      )}
      <BottomTabBar />
    </div>
  );
}
