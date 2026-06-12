import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";

const FREE_FEATURES = [
  { ok: true,  text: "動画掲載・学生の閲覧" },
  { ok: true,  text: "マッチング成立の通知" },
  { ok: false, text: "学生へのメッセージ送信" },
  { ok: false, text: "スカウト（オファー）機能" },
  { ok: false, text: "検索結果での優先表示" },
];

const STANDARD_FEATURES = [
  { ok: true, text: "動画掲載・学生の閲覧" },
  { ok: true, text: "マッチング成立の通知" },
  { ok: true, text: "学生へのメッセージ無制限" },
  { ok: true, text: "スカウト（オファー）機能の解放" },
  { ok: true, text: "検索結果での優先表示" },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const { clinicPlan, setClinicPlan } = useApp();

  function selectStandard() {
    setClinicPlan("standard");
    navigate(-1);
  }

  function selectFree() {
    setClinicPlan("free");
    navigate(-1);
  }

  return (
    <div className="flex flex-col min-h-svh max-w-md mx-auto bg-gray-50">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-lg"
        >
          ←
        </button>
        <div>
          <p className="font-black text-gray-900 text-base tracking-tight">プラン選択</p>
          <p className="text-xs text-gray-400">医院向け料金プラン</p>
        </div>
      </header>

      <div className="flex-1 px-4 py-6">
        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs font-bold text-violet-500 tracking-widest mb-1">PRICING</p>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            ご状況に合わせた<br />プランをお選びください
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            学生とのマッチング後にメッセージするには<br />スタンダードプランが必要です
          </p>
        </motion.div>

        {/* Plan cards */}
        <div className="space-y-4">
          {/* Free plan */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-white rounded-2xl p-5 border-2 transition-all ${
              clinicPlan === "free"
                ? "border-gray-400 shadow-md"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-gray-400 tracking-widest mb-1">FREE</p>
                <p className="text-xl font-black text-gray-900">フリープラン</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-gray-900">¥0</p>
                <p className="text-xs text-gray-400">/ 月</p>
              </div>
            </div>

            <ul className="space-y-2 mb-5">
              {FREE_FEATURES.map((f) => (
                <li key={f.text} className="flex items-center gap-2 text-sm">
                  <span className={f.ok ? "text-teal-500" : "text-gray-300"}>
                    {f.ok ? "✓" : "✕"}
                  </span>
                  <span className={f.ok ? "text-gray-700" : "text-gray-400 line-through"}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={selectFree}
              disabled={clinicPlan === "free"}
              className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-bold disabled:opacity-50 disabled:cursor-default hover:border-gray-300 transition-colors"
            >
              {clinicPlan === "free" ? "現在のプラン" : "フリーに戻す（デモ）"}
            </button>
          </motion.div>

          {/* Standard plan */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`relative rounded-2xl p-5 border-2 transition-all ${
              clinicPlan === "standard"
                ? "border-violet-500 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-xl shadow-violet-200"
                : "border-violet-400 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-200"
            }`}
          >
            {/* Recommended badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1 rounded-full shadow-md">
                ⭐ おすすめ
              </span>
            </div>

            <div className="flex items-start justify-between mb-3 pt-2">
              <div>
                <p className="text-xs font-bold text-violet-200 tracking-widest mb-1">STANDARD</p>
                <p className="text-xl font-black">スタンダードプラン</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black">¥30,000</p>
                <p className="text-xs text-violet-200">/ 月（税抜）</p>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {STANDARD_FEATURES.map((f) => (
                <li key={f.text} className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-300 font-bold">✓</span>
                  <span className="text-white">{f.text}</span>
                </li>
              ))}
            </ul>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={selectStandard}
              disabled={clinicPlan === "standard"}
              className="w-full py-4 rounded-xl bg-white text-violet-700 font-black text-base shadow-lg disabled:opacity-60 disabled:cursor-default hover:shadow-xl transition-all"
            >
              {clinicPlan === "standard"
                ? "✓ 現在のプラン"
                : "このプランを選択（デモ）"}
            </motion.button>

            {clinicPlan !== "standard" && (
              <p className="text-center text-violet-200 text-xs mt-3">
                ※ デモのため実際の課金は発生しません
              </p>
            )}
          </motion.div>
        </div>

        {/* Note */}
        <p className="text-center text-gray-400 text-xs mt-8 leading-relaxed">
          学生側の利用は完全無料です。<br />
          解約はいつでも可能。最低契約期間なし。
        </p>
      </div>
    </div>
  );
}
