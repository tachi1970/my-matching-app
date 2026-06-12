import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import BottomTabBar from "../components/common/BottomTabBar";

const STUDENT_CHATS = [
  { id: 1, name: "たなか歯科クリニック", sub: "東京・渋谷区", initial: "田", gradient: "from-blue-400 to-teal-500", lastMsg: "見学の件、ご連絡ありがとうございます！ぜひお気軽に。", time: "14:32", unread: 2 },
  { id: 2, name: "さくら歯科医院", sub: "大阪・中央区", initial: "木", gradient: "from-pink-400 to-rose-500", lastMsg: "ぜひ一度お話ししましょう😊", time: "昨日", unread: 0 },
  { id: 3, name: "みなと総合歯科", sub: "神奈川・横浜市", initial: "鈴", gradient: "from-emerald-400 to-cyan-500", lastMsg: "いつでも見学お越しください！", time: "月曜日", unread: 1 },
  { id: 4, name: "ほし矯正歯科", sub: "愛知・名古屋市", initial: "星", gradient: "from-violet-400 to-purple-500", lastMsg: "日程を調整しましょう✨", time: "先週", unread: 0 },
];

const CLINIC_CHATS = [
  { id: 1, name: "田中 花子", sub: "九州歯科大学 3年", initial: "田", gradient: "from-pink-400 to-rose-400", lastMsg: "見学よろしくお願いします！先日はありがとうございました。", time: "14:32", unread: 1 },
  { id: 2, name: "山田 健太", sub: "東京医科歯科大学 5年", initial: "山", gradient: "from-blue-400 to-indigo-500", lastMsg: "ありがとうございます！日程の確認をさせてください。", time: "昨日", unread: 0 },
  { id: 3, name: "佐藤 美月", sub: "大阪歯科大学 3年", initial: "佐", gradient: "from-purple-400 to-violet-500", lastMsg: "ぜひよろしくお願いします。楽しみにしています！", time: "火曜日", unread: 2 },
  { id: 4, name: "高橋 あおい", sub: "福岡歯科大学 2年", initial: "高", gradient: "from-amber-400 to-orange-500", lastMsg: "いつでも大丈夫です😊", time: "先週", unread: 0 },
];

export default function TalkListPage() {
  const { mode } = useApp();
  const navigate = useNavigate();
  const chats = mode === "clinic" ? CLINIC_CHATS : STUDENT_CHATS;
  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="flex flex-col min-h-svh max-w-md mx-auto bg-gray-50">
      {/* ヘッダー */}
      <header className="flex-shrink-0 px-4 pt-12 pb-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900">トーク</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {mode === "clinic" ? "マッチした学生とのチャット" : "マッチした医院とのチャット"}
            </p>
          </div>
          {totalUnread > 0 && (
            <span className="bg-teal-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
              {totalUnread}
            </span>
          )}
        </div>
      </header>

      {/* チャットリスト */}
      <div className="flex-1 overflow-y-auto pb-20">
        {chats.length === 0 ? (
          <EmptyState mode={mode} navigate={navigate} />
        ) : (
          <div className="divide-y divide-gray-100 bg-white">
            {chats.map((chat, i) => (
              <motion.button
                key={chat.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ backgroundColor: "#f9fafb" }}
                onClick={() => navigate("/chat", { state: { partnerName: chat.name + (mode === "student" ? " 院長" : " さん") } })}
                className="w-full flex items-center gap-4 px-4 py-4 text-left"
              >
                {/* アバター */}
                <div className="relative flex-shrink-0">
                  <div className={`w-13 h-13 w-[52px] h-[52px] rounded-full bg-gradient-to-br ${chat.gradient} flex items-center justify-center text-white text-xl font-bold shadow-sm`}>
                    {chat.initial}
                  </div>
                  {/* オンラインドット */}
                  {chat.unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-teal-400 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <p className="font-bold text-gray-900 text-sm truncate">{chat.name}</p>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{chat.time}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-0.5">{chat.sub}</p>
                  <p className={`text-xs truncate ${chat.unread > 0 ? "text-gray-700 font-semibold" : "text-gray-400"}`}>
                    {chat.lastMsg}
                  </p>
                </div>

                {/* 未読バッジ */}
                {chat.unread > 0 && (
                  <span className="flex-shrink-0 bg-teal-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        )}

        {/* マッチ促進バナー */}
        <div className="px-4 py-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-4 border border-teal-100 text-center"
          >
            <p className="text-2xl mb-1">🦷</p>
            <p className="font-bold text-teal-800 text-sm">もっとマッチングしよう！</p>
            <p className="text-xs text-teal-600 mt-1 mb-3">
              {mode === "clinic" ? "学生をスワイプしてスカウトしましょう" : "気になる医院にいいねしてみましょう"}
            </p>
            <button
              onClick={() => navigate(mode === "clinic" ? "/clinic" : "/search")}
              className="bg-teal-500 text-white text-xs font-bold px-5 py-2 rounded-full"
            >
              {mode === "clinic" ? "学生を探す →" : "医院を探す →"}
            </button>
          </motion.div>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}

function EmptyState({ mode, navigate }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
      <span className="text-5xl mb-4">💬</span>
      <h2 className="text-lg font-bold text-gray-800 mb-2">まだトークがありません</h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        {mode === "clinic" ? "学生にいいねまたはスカウトしてマッチングしましょう" : "気になる医院にいいねを送ってマッチングしましょう"}
      </p>
      <button
        onClick={() => navigate(mode === "clinic" ? "/clinic" : "/search")}
        className="bg-teal-500 text-white font-bold px-8 py-3 rounded-full"
      >
        {mode === "clinic" ? "学生を探す" : "医院を探す"}
      </button>
    </div>
  );
}
