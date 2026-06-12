import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";

const MODES = [
  {
    key: "student",
    icon: "🎓",
    label: "STUDENT",
    title: "歯科大生・歯科学生",
    desc: "医院を探して、見学・メンター探し",
    accent: "teal",
    border: "border-teal-100 hover:border-teal-300",
    iconBg: "bg-teal-50 group-hover:bg-teal-100",
    tag: "text-teal-600",
  },
  {
    key: "clinic",
    icon: "🏥",
    label: "CLINIC",
    title: "歯科医院・院長先生",
    desc: "学生を探して、スカウト・採用",
    accent: "violet",
    border: "border-violet-100 hover:border-violet-300",
    iconBg: "bg-violet-50 group-hover:bg-violet-100",
    tag: "text-violet-600",
  },
];

export default function ModeSelectorPage() {
  const { setMode } = useApp();
  const navigate = useNavigate();

  function select(key) {
    setMode(key);
    navigate("/home");
  }

  return (
    <div className="flex flex-col min-h-svh max-w-md mx-auto bg-white">
      {/* ヘッダー空白 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        {/* ロゴ */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="w-20 h-20 rounded-3xl bg-teal-50 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <img
              src="/mushi.png"
              alt="DentConnect"
              className="w-14 h-14"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span className="text-5xl" style={{ display: "none" }}>🦷</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            DentConnect
          </h1>
          <p className="text-gray-400 text-sm mt-2">歯科大生 × 歯科医院 マッチング</p>
        </motion.div>

        {/* カード */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <p className="text-center text-sm text-gray-500 mb-5 font-medium">
            あなたはどちらですか？
          </p>

          <div className="space-y-3">
            {MODES.map((m, i) => (
              <motion.button
                key={m.key}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.1 }}
                onClick={() => select(m.key)}
                className={`group w-full bg-white border-2 ${m.border} rounded-2xl px-5 py-4 text-left flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${m.iconBg} flex items-center justify-center text-2xl transition-colors duration-200 flex-shrink-0`}
                  >
                    {m.icon}
                  </div>
                  <div>
                    <p className={`text-xs font-black ${m.tag} mb-0.5 tracking-widest`}>
                      {m.label}
                    </p>
                    <p className="font-bold text-gray-900 text-base">{m.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
                  </div>
                </div>
                <span className="text-gray-300 text-xl group-hover:text-gray-400 transition-colors">
                  →
                </span>
              </motion.button>
            ))}
          </div>

          {/* 登録リンク群 */}
          <div className="text-center mt-5 space-y-2">
            <button
              onClick={() => navigate("/student-register")}
              className="block w-full text-sm text-teal-500 font-semibold hover:text-teal-700 transition-colors"
            >
              🎓 学生の新規登録はこちら →
            </button>
            <button
              onClick={() => navigate("/clinic-register")}
              className="block w-full text-sm text-violet-500 font-semibold hover:text-violet-700 transition-colors"
            >
              🏥 医院の新規登録はこちら →
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="block w-full text-sm text-gray-400 font-semibold hover:text-gray-600 transition-colors"
            >
              📊 全国ダッシュボードを見る →
            </button>
          </div>
        </motion.div>
      </div>

      <p className="text-center text-gray-300 text-xs pb-8">
        © 2025 DentConnect, Inc.
      </p>
    </div>
  );
}
