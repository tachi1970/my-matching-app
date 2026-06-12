import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import BottomTabBar from "../components/common/BottomTabBar";

// デモ用固定モックデータ（名前・医院名はContextから上書き）
const MOCK_STUDENT = {
  matches: 4,
  likes: 12,
  schedule: [
    { date: "6/15(土)", label: "たなか歯科クリニック", tag: "見学確定", color: "teal" },
    { date: "6/22(日)", label: "さくら歯科医院", tag: "見学確定", color: "teal" },
    { date: "7/5(土)", label: "ほし矯正歯科", tag: "交渉中", color: "amber" },
  ],
  matchedClinics: [
    { name: "たなか歯科クリニック", area: "東京・渋谷区", initial: "田", gradient: "from-blue-400 to-teal-500", lastMsg: "見学の件、ご連絡ありがとうございます！" },
    { name: "さくら歯科医院", area: "大阪・中央区", initial: "木", gradient: "from-pink-400 to-rose-500", lastMsg: "ぜひ一度お話ししましょう😊" },
    { name: "みなと総合歯科", area: "神奈川・横浜市", initial: "鈴", gradient: "from-emerald-400 to-cyan-500", lastMsg: "いつでも見学お越しください！" },
    { name: "ほし矯正歯科", area: "愛知・名古屋市", initial: "星", gradient: "from-violet-400 to-purple-500", lastMsg: "日程を調整しましょう✨" },
  ],
};

const MOCK_CLINIC = {
  scouts: 8,
  matches: 3,
  views: 142,
  schedule: [
    { date: "6/15(土)", label: "田中 花子さん", tag: "見学確定", color: "teal" },
    { date: "6/20(金)", label: "山田 健太さん", tag: "交渉中", color: "amber" },
    { date: "7/5(土)", label: "高橋 あおいさん", tag: "見学確定", color: "teal" },
  ],
  matchedStudents: [
    { name: "田中 花子", univ: "九州歯科大学 3年", initial: "田", gradient: "from-pink-400 to-rose-400", lastMsg: "見学よろしくお願いします！" },
    { name: "山田 健太", univ: "東京医科歯科大学 5年", initial: "山", gradient: "from-blue-400 to-indigo-500", lastMsg: "ありがとうございます！" },
    { name: "佐藤 美月", univ: "大阪歯科大学 3年", initial: "佐", gradient: "from-purple-400 to-violet-500", lastMsg: "ぜひよろしくお願いします。" },
  ],
};

function fade(delay = 0) {
  return { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.3 } };
}

export default function HomePage() {
  const { mode, studentProfile, clinicProfile } = useApp();
  const navigate = useNavigate();

  const sInitial = studentProfile.lastName?.[0] || "田";
  const sFirstName = studentProfile.firstName || "花子";
  const cInitial = clinicProfile.directorName?.[0] || "田";
  const cDirectorFirst = clinicProfile.directorName?.split(" ")?.[0] || "田中";

  return (
    <div className="flex flex-col min-h-svh max-w-md mx-auto bg-gray-50">
      {/* ヘッダー */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 pt-12 pb-4 bg-white border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-400 font-medium">
            {mode === "student" ? "歯科大生" : "歯科医院"}
          </p>
          <h1 className="text-xl font-black text-gray-900 leading-tight">
            {mode === "student"
              ? `こんにちは、${sFirstName}さん 👋`
              : `こんにちは、${cDirectorFirst}先生 👋`}
          </h1>
        </div>
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-white text-xl font-bold shadow-sm">
          {mode === "student" ? sInitial : cInitial}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-20 space-y-4">
        {mode === "student"
          ? <StudentHome navigate={navigate} profile={studentProfile} />
          : <ClinicHome navigate={navigate} profile={clinicProfile} />}
      </div>

      <BottomTabBar />
    </div>
  );
}

// ────────────────────────────
// 学生ホーム
// ────────────────────────────
function StudentHome({ navigate, profile }) {
  const d = MOCK_STUDENT;
  const fullName = `${profile.lastName || "田中"} ${profile.firstName || "花子"}`;
  const univLabel = profile.university
    ? `${profile.university}${profile.year ? ` ${profile.year}年` : ""}`
    : "九州歯科大学 3年";
  const initial = profile.lastName?.[0] || "田";
  const major = profile.major || "歯学科";

  return (
    <>
      {/* プロフィールカード */}
      <motion.div {...fade(0)} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-white text-2xl font-bold shadow-sm flex-shrink-0">
            {initial}
          </div>
          <div>
            <p className="font-black text-gray-900">{fullName}</p>
            <p className="text-xs text-gray-500">{univLabel}</p>
            <span className="inline-block mt-1 text-xs font-bold px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full border border-teal-100">
              {major}
            </span>
          </div>
        </div>
        {/* ステータスバー */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
          <StatPill label="マッチ" value={d.matches} color="teal" />
          <StatPill label="いいね送信" value={d.likes} color="rose" />
          <StatPill label="見学予定" value={d.schedule.length} color="amber" />
        </div>
      </motion.div>

      {/* 見学スケジュール */}
      <motion.div {...fade(0.06)}>
        <SectionTitle>📅 見学スケジュール</SectionTitle>
        <div className="space-y-2">
          {d.schedule.map((s, i) => (
            <div key={i} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm border border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-medium">{s.date}</p>
                <p className="font-bold text-gray-800 text-sm">{s.label}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                s.color === "teal"
                  ? "bg-teal-50 text-teal-600 border border-teal-200"
                  : "bg-amber-50 text-amber-600 border border-amber-200"
              }`}>
                {s.tag}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* マッチした医院一覧 */}
      <motion.div {...fade(0.1)}>
        <SectionTitle>🏥 マッチした医院</SectionTitle>
        <div className="space-y-2">
          {d.matchedClinics.map((c, i) => (
            <button
              key={i}
              onClick={() => navigate("/chat", { state: { partnerName: `${c.name} 院長` } })}
              className="w-full bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm border border-gray-100 text-left hover:border-teal-200 transition-colors"
            >
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                {c.initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                <p className="text-xs text-gray-400 truncate">{c.lastMsg}</p>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* クイックアクション */}
      <motion.div {...fade(0.14)}>
        <SectionTitle>⚡ クイックアクション</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <QuickAction icon="🔍" label="医院を探す" sub="エリアから検索" onClick={() => navigate("/search")} color="teal" />
          <QuickAction icon="💬" label="トークを開く" sub={`${d.matches}件のマッチ`} onClick={() => navigate("/talk")} color="violet" />
          <QuickAction icon="📊" label="全国マップ" sub="登録状況を確認" onClick={() => navigate("/dashboard")} color="blue" />
          <QuickAction icon="👤" label="マイページ" sub="設定・プロフィール" onClick={() => navigate("/mypage")} color="gray" />
        </div>
      </motion.div>
    </>
  );
}


// ────────────────────────────
// 医院ホーム
// ────────────────────────────
function ClinicHome({ navigate, profile }) {
  const d = MOCK_CLINIC;
  const clinicName = profile.name || "たなか歯科クリニック";
  const directorName = profile.directorName || "田中 誠一";
  const areaLabel = profile.prefecture
    ? `${profile.prefecture}${profile.area ? ` ${profile.area}` : ""}`
    : "東京都 渋谷区";
  const initial = profile.directorName?.[0] || "田";

  return (
    <>
      {/* 医院カード */}
      <motion.div {...fade(0)} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-sm flex-shrink-0">
            {initial}
          </div>
          <div>
            <p className="font-black text-gray-900">{clinicName}</p>
            <p className="text-xs text-gray-500">{directorName} 院長</p>
            <p className="text-xs text-gray-400">{areaLabel}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
          <StatPill label="マッチ" value={d.matches} color="teal" />
          <StatPill label="スカウト" value={d.scouts} color="violet" />
          <StatPill label="プロフ閲覧" value={d.views} color="blue" />
        </div>
      </motion.div>

      {/* 見学スケジュール */}
      <motion.div {...fade(0.06)}>
        <SectionTitle>📅 見学スケジュール</SectionTitle>
        <div className="space-y-2">
          {d.schedule.map((s, i) => (
            <div key={i} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm border border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-medium">{s.date}</p>
                <p className="font-bold text-gray-800 text-sm">{s.label}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                s.color === "teal"
                  ? "bg-teal-50 text-teal-600 border border-teal-200"
                  : "bg-amber-50 text-amber-600 border border-amber-200"
              }`}>
                {s.tag}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* マッチした学生 */}
      <motion.div {...fade(0.1)}>
        <SectionTitle>🎓 マッチした学生</SectionTitle>
        <div className="space-y-2">
          {d.matchedStudents.map((s, i) => (
            <button
              key={i}
              onClick={() => navigate("/chat", { state: { partnerName: `${s.name} さん` } })}
              className="w-full bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm border border-gray-100 text-left hover:border-violet-200 transition-colors"
            >
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                {s.initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{s.name}</p>
                <p className="text-xs text-gray-400 truncate">{s.univ}</p>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* クイックアクション */}
      <motion.div {...fade(0.14)}>
        <SectionTitle>⚡ クイックアクション</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <QuickAction icon="🔍" label="学生を探す" sub="スワイプして選ぶ" onClick={() => navigate("/clinic")} color="violet" />
          <QuickAction icon="💬" label="トークを開く" sub={`${d.matches}件のマッチ`} onClick={() => navigate("/talk")} color="teal" />
          <QuickAction icon="📊" label="全国マップ" sub="エリア分析" onClick={() => navigate("/dashboard")} color="blue" />
          <QuickAction icon="💴" label="プランを確認" sub="アップグレード" onClick={() => navigate("/pricing")} color="amber" />
        </div>
      </motion.div>
    </>
  );
}

// ────────────────────────────
// 小コンポーネント
// ────────────────────────────
function SectionTitle({ children }) {
  return <p className="text-sm font-black text-gray-700 mb-2">{children}</p>;
}

function StatPill({ label, value, color }) {
  const colors = {
    teal: "text-teal-600",
    rose: "text-rose-500",
    amber: "text-amber-500",
    violet: "text-violet-600",
    blue: "text-blue-600",
  };
  return (
    <div className="text-center">
      <p className={`text-xl font-black ${colors[color] ?? "text-gray-700"}`}>{value}</p>
      <p className="text-[10px] text-gray-400 font-medium">{label}</p>
    </div>
  );
}

function QuickAction({ icon, label, sub, onClick, color }) {
  const bg = {
    teal: "bg-teal-50 border-teal-100 hover:border-teal-300",
    violet: "bg-violet-50 border-violet-100 hover:border-violet-300",
    blue: "bg-blue-50 border-blue-100 hover:border-blue-300",
    amber: "bg-amber-50 border-amber-100 hover:border-amber-300",
    gray: "bg-gray-50 border-gray-100 hover:border-gray-300",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`rounded-xl border p-3 text-left transition-colors ${bg[color] ?? bg.gray}`}
    >
      <span className="text-2xl">{icon}</span>
      <p className="font-bold text-gray-900 text-sm mt-1 leading-tight">{label}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </motion.button>
  );
}
