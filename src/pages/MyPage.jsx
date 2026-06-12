import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import BottomTabBar from "../components/common/BottomTabBar";

export default function MyPage() {
  const { mode, setMode, clinicPlan, studentProfile, clinicProfile } = useApp();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [comingSoonLabel, setComingSoonLabel] = useState(null);

  const isStudent = mode === "student";

  const sName = `${studentProfile.lastName || "田中"} ${studentProfile.firstName || "花子"}`;
  const sInitial = studentProfile.lastName?.[0] || "田";
  const sUniv = studentProfile.university || "九州歯科大学";
  const sYear = studentProfile.year ? `${studentProfile.year}年生` : "3年生";
  const sMajor = studentProfile.major || "歯学科";
  const sArea = studentProfile.prefectureOrigin || "福岡県";
  const sInterests = studentProfile.interests?.length > 0 ? studentProfile.interests : ["小児歯科", "予防歯科"];
  const sDesiredAreas = studentProfile.desiredAreas?.length > 0 ? studentProfile.desiredAreas : ["福岡県"];

  const cClinicName = clinicProfile.name || "たなか歯科クリニック";
  const cDirectorName = clinicProfile.directorName || "田中 誠一";
  const cInitial = clinicProfile.directorName?.[0] || "田";
  const cUniv = clinicProfile.directorUniv || "東京医科歯科大学";
  const cGrad = clinicProfile.directorYear ? `${clinicProfile.directorYear}年卒` : "2005年卒";
  const cArea = clinicProfile.prefecture
    ? `${clinicProfile.prefecture}${clinicProfile.area ? ` ${clinicProfile.area}` : ""}`
    : "東京都 渋谷区";
  const cSkills = clinicProfile.skills?.length > 0 ? clinicProfile.skills : ["インビザライン", "インプラント", "小児歯科"];

  function showComingSoon(label) {
    setComingSoonLabel(label);
    setTimeout(() => setComingSoonLabel(null), 2000);
  }

  return (
    <div className="flex flex-col min-h-svh max-w-md mx-auto bg-gray-50">
      <header className="flex-shrink-0 px-4 pt-12 pb-4 bg-white border-b border-gray-100">
        <h1 className="text-xl font-black text-gray-900">マイページ</h1>
        <p className="text-xs text-gray-400 mt-0.5">プロフィール・設定</p>
      </header>

      <div className="flex-1 overflow-y-auto pb-20 px-4 py-4 space-y-4">

        {/* プロフィールカード */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className={`h-20 ${isStudent ? "bg-gradient-to-r from-teal-400 to-emerald-400" : "bg-gradient-to-r from-blue-400 to-teal-500"}`} />
          <div className="px-4 pb-4 -mt-8">
            <div className={`w-16 h-16 rounded-full border-4 border-white shadow-md flex items-center justify-center text-white text-2xl font-black mb-3 ${isStudent ? "bg-gradient-to-br from-teal-400 to-emerald-400" : "bg-gradient-to-br from-blue-400 to-teal-500"}`}>
              {isStudent ? sInitial : cInitial}
            </div>
            {isStudent ? (
              <>
                <p className="font-black text-gray-900 text-lg">{sName}</p>
                <p className="text-sm text-gray-500">{sUniv} {sYear}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Tag color="teal">{sMajor}</Tag>
                  <Tag color="gray">{sArea}</Tag>
                </div>
              </>
            ) : (
              <>
                <p className="font-black text-gray-900 text-lg">{cDirectorName} 院長</p>
                <p className="text-sm text-gray-500">{cClinicName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{cArea}</p>
              </>
            )}
          </div>
        </motion.div>

        {/* 詳細情報 */}
        {isStudent ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50"
          >
            <InfoRow icon="🎓" label="大学">{sUniv}</InfoRow>
            <InfoRow icon="📚" label="学年">{sYear}</InfoRow>
            <InfoRow icon="📍" label="出身地">{sArea}</InfoRow>
            <InfoRow icon="💡" label="興味分野">
              <div className="flex flex-wrap gap-1 mt-1">
                {sInterests.map((t) => <Tag key={t} color="teal">{t}</Tag>)}
              </div>
            </InfoRow>
            <InfoRow icon="🗺️" label="希望エリア">
              <div className="flex flex-wrap gap-1 mt-1">
                {sDesiredAreas.map((a) => <Tag key={a} color="violet">{a}</Tag>)}
              </div>
            </InfoRow>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50"
          >
            <InfoRow icon="🏥" label="医院名">{cClinicName}</InfoRow>
            <InfoRow icon="🎓" label="出身大学">{cUniv}</InfoRow>
            <InfoRow icon="📅" label="卒業年">{cGrad}</InfoRow>
            <InfoRow icon="📍" label="所在地">{cArea}</InfoRow>
            <InfoRow icon="🦷" label="専門技術">
              <div className="flex flex-wrap gap-1 mt-1">
                {cSkills.map((s) => <Tag key={s} color="blue">{s}</Tag>)}
              </div>
            </InfoRow>
          </motion.div>
        )}

        {/* プラン（医院のみ） */}
        {!isStudent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">現在のプラン</p>
            <div className={`flex items-center justify-between p-3 rounded-xl ${clinicPlan === "standard" ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50 border border-gray-100"}`}>
              <div>
                <p className={`font-black text-sm ${clinicPlan === "standard" ? "text-yellow-700" : "text-gray-700"}`}>
                  {clinicPlan === "standard" ? "★ スタンダードプラン" : "フリープラン"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {clinicPlan === "standard" ? "スカウト・メッセージ無制限" : "メッセージ3通まで"}
                </p>
              </div>
              {clinicPlan === "free" && (
                <button
                  onClick={() => navigate("/pricing")}
                  className="text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-full"
                >
                  アップグレード
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* 設定メニュー */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50"
        >
          <p className="px-4 pt-3 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">設定</p>
          <MenuItem icon="🔔" label="通知設定" badge="準備中" onClick={() => showComingSoon("通知設定")} />
          <MenuItem icon="🔒" label="プライバシー設定" badge="準備中" onClick={() => showComingSoon("プライバシー設定")} />
          <MenuItem icon="📱" label="アプリ情報" sub="ver 1.2.0" />
          <MenuItem icon="❓" label="ヘルプ・お問い合わせ" badge="準備中" onClick={() => showComingSoon("ヘルプ・お問い合わせ")} />
          <MenuItem icon="📊" label="全国ダッシュボード" onClick={() => navigate("/dashboard")} />
        </motion.div>

        {/* モード切替 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">表示モード</p>
          <div className="flex bg-gray-100 rounded-2xl p-1">
            <button
              onClick={() => { setMode("student"); navigate("/home"); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === "student" ? "bg-teal-500 text-white shadow-sm" : "text-gray-500"}`}
            >
              🎓 学生モード
            </button>
            <button
              onClick={() => { setMode("clinic"); navigate("/home"); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === "clinic" ? "bg-violet-500 text-white shadow-sm" : "text-gray-500"}`}
            >
              🏥 医院モード
            </button>
          </div>
        </motion.div>

        {/* ログアウト */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
          className="pb-2"
        >
          <AnimatePresence mode="wait">
            {showLogoutConfirm ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-2"
              >
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 py-3 text-sm font-bold text-white bg-red-400 rounded-2xl border border-red-300 shadow-sm"
                >
                  ログアウトする
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 text-sm font-bold text-gray-600 bg-white rounded-2xl border border-gray-200 shadow-sm"
                >
                  キャンセル
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="logout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full py-3 text-sm font-bold text-red-400 bg-white rounded-2xl border border-red-100 shadow-sm"
              >
                ログアウト
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-center text-xs text-gray-300 pb-2">© 2026 DentConnect, Inc.</p>
      </div>

      {/* 準備中トースト */}
      <AnimatePresence>
        {comingSoonLabel && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg z-50 whitespace-nowrap"
          >
            {comingSoonLabel}は近日公開予定です
          </motion.div>
        )}
      </AnimatePresence>

      <BottomTabBar />
    </div>
  );
}

function InfoRow({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        {typeof children === "string" ? (
          <p className="text-sm text-gray-800 font-semibold mt-0.5">{children}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function MenuItem({ icon, label, sub, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
    >
      <span className="text-base">{icon}</span>
      <span className="flex-1 text-sm font-semibold text-gray-700">{label}</span>
      {badge && (
        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
          {badge}
        </span>
      )}
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
      <span className="text-gray-300 text-lg">›</span>
    </button>
  );
}

function Tag({ children, color }) {
  const s = {
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${s[color] ?? s.gray}`}>
      {children}
    </span>
  );
}
