import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { mockStudents, STUDENT_INTEREST_TAGS, DESIRED_AREA_TAGS } from "../data/mockStudents";
import { useStudentFilters } from "../hooks/useFilters";
import { useActions } from "../hooks/useActions";
import { useApp } from "../context/AppContext";
import Header from "../components/common/Header";
import FilterPanel from "../components/common/FilterPanel";
import MatchPopup from "../components/animations/MatchPopup";
import BottomTabBar from "../components/common/BottomTabBar";

const UNIV_TYPE_STYLE = {
  国公立: "bg-indigo-100 text-indigo-700 border-indigo-300",
  私立: "bg-rose-100 text-rose-700 border-rose-300",
};

export default function ClinicFeedPage() {
  const navigate = useNavigate();
  const { clinicPlan } = useApp();
  const [showScoutPaywall, setShowScoutPaywall] = useState(false);

  const {
    filtered,
    filterKey,
    activeCount,
    state: fState,
    toggleUniversityType,
    toggleInterest,
    toggleDesiredArea,
    reset: resetFilters,
  } = useStudentFilters(mockStudents);

  const {
    current,
    hasMore,
    showMatch,
    like,
    skip,
    dismissMatch,
  } = useActions(filtered, filterKey);

  function handleScout() {
    if (clinicPlan === "free") {
      setShowScoutPaywall(true);
    } else {
      like();
    }
  }
  function handleLike() { like(); }

  function handleGoToChat() {
    navigate("/chat", {
      state: { partnerName: current?.name + " さん" },
    });
  }

  function handleDismiss() {
    dismissMatch();
  }

  // FilterPanel グループ定義
  const filterGroups = [
    {
      label: "大学区分",
      options: ["国公立", "私立"],
      isSelected: (v) => fState.universityType === v,
      onToggle: toggleUniversityType,
    },
    {
      label: "興味・専門分野",
      options: STUDENT_INTEREST_TAGS,
      isSelected: (v) => fState.interests.includes(v),
      onToggle: toggleInterest,
      multi: true,
    },
    {
      label: "将来働きたいエリア",
      options: DESIRED_AREA_TAGS,
      isSelected: (v) => fState.desiredAreas.includes(v),
      onToggle: toggleDesiredArea,
      multi: true,
    },
  ];

  return (
    <div className="flex flex-col h-svh max-w-md mx-auto bg-white">
      <Header />

      {/* Sub-header */}
      <div className="flex-shrink-0 px-4 py-2 bg-violet-50 border-b border-violet-100">
        <p className="text-xs text-violet-600 font-semibold">
          🏥 医院モード ― 見学に来てほしい学生を探す
        </p>
      </div>

      {/* フィルターパネル */}
      <FilterPanel
        groups={filterGroups}
        activeCount={activeCount}
        onReset={resetFilters}
        accentColor="violet"
      />

      {/* カードエリア */}
      <div className="flex-1 relative overflow-hidden">
        {hasMore && current ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + filterKey}
              className="absolute inset-0 overflow-y-auto pb-4"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.25 }}
            >
              <StudentCard student={current} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <EmptyState
            hasFilters={activeCount > 0}
            onReset={activeCount > 0 ? resetFilters : undefined}
          />
        )}
      </div>

      {/* アクションバー（タブバーの上に固定） */}
      {hasMore && current && (
        <div className="fixed bottom-14 left-0 right-0 z-40 flex justify-center">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-md border-t border-gray-100 px-8 py-4 flex items-center justify-between">
            <ActionBtn
              onClick={skip}
              icon="✕"
              label="スキップ"
              color="bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-400"
              size="w-14 h-14"
            />
            <ActionBtn
              onClick={handleScout}
              icon="★"
              label="スカウト"
              color="bg-yellow-50 text-yellow-500 hover:bg-yellow-100"
              size="w-20 h-20"
              textSize="text-3xl"
            />
            <ActionBtn
              onClick={handleLike}
              icon="♡"
              label="いいね"
              color="bg-gray-100 text-red-400 hover:bg-red-50 hover:text-red-500"
              size="w-14 h-14"
            />
          </div>
        </div>
      )}
      {/* タブバー用スペーサー */}
      <div className="flex-shrink-0 h-14" />

      <MatchPopup
        visible={showMatch}
        partnerName={current?.name + " さん"}
        onGoToChat={handleGoToChat}
        onDismiss={handleDismiss}
      />
      <BottomTabBar />

      {/* スカウト ペイウォールモーダル */}
      <AnimatePresence>
        {showScoutPaywall && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowScoutPaywall(false)}
            />
            <motion.div
              className="relative w-full max-w-sm bg-white rounded-3xl p-7 text-center shadow-2xl"
              initial={{ scale: 0.8, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 320 }}
            >
              <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4 text-3xl">
                ★
              </div>
              <h2 className="text-lg font-black text-gray-900 mb-1">
                スカウト機能
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                スカウト（オファー）機能の利用には<br />
                <span className="font-semibold text-gray-700">スタンダードプラン</span>への登録が必要です
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setShowScoutPaywall(false); navigate("/pricing"); }}
                className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-2xl shadow-md shadow-violet-200 mb-3"
              >
                プランを見る →
              </motion.button>
              <button
                onClick={() => setShowScoutPaywall(false)}
                className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
              >
                閉じる
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────── StudentCard ────────────────

function StudentCard({ student }) {
  return (
    <div className="p-4">
      {/* アバターカード */}
      <div
        className={`w-full h-52 rounded-2xl bg-gradient-to-br ${student.bgColor} flex flex-col items-center justify-center mb-5 relative overflow-hidden`}
      >
        <img
          src="/mushi_icon.png"
          alt=""
          className="w-20 h-20 mb-3 drop-shadow-lg"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div
          className="w-20 h-20 mb-3 rounded-full bg-white/30 text-white text-4xl font-bold items-center justify-center"
          style={{ display: "none" }}
        >
          {student.initial}
        </div>
        <p className="text-white font-bold text-xl">{student.name}</p>
        <p className="text-white/80 text-sm">{student.year}年生</p>

        {/* 大学区分バッジ */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border bg-white/90 ${
              UNIV_TYPE_STYLE[student.universityType] ?? ""
            }`}
          >
            {student.universityType}
          </span>
        </div>
      </div>

      {/* 詳細情報 */}
      <div className="space-y-5">
        {/* 大学 */}
        <InfoRow label="大学">
          <p className="text-gray-700 text-sm">🎓 {student.university}</p>
        </InfoRow>

        {/* 出身地 */}
        <InfoRow label="出身地">
          <p className="text-gray-700 text-sm">📍 {student.prefectureOrigin}</p>
        </InfoRow>

        {/* 興味・関心 */}
        <InfoRow label="興味・関心">
          <div className="flex flex-wrap gap-2">
            {student.interests.map((item) => (
              <Tag key={item} color="violet">{item}</Tag>
            ))}
          </div>
        </InfoRow>

        {/* 将来働きたいエリア */}
        <InfoRow label="将来働きたいエリア">
          <div className="flex flex-wrap gap-2">
            {student.desiredAreas.map((area) => (
              <Tag key={area} color="teal">{area}</Tag>
            ))}
          </div>
        </InfoRow>

        {/* インターン希望日 */}
        {student.availableDates?.length > 0 && (
          <InfoRow label="インターン希望日程">
            <div className="flex flex-wrap gap-2">
              {student.availableDates.map((d) => (
                <span
                  key={d}
                  className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  📅 {d}
                </span>
              ))}
            </div>
          </InfoRow>
        )}

        {/* 自己PR */}
        <InfoRow label="自己PR">
          <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-100">
            {student.message}
          </p>
        </InfoRow>
      </div>
    </div>
  );
}

function InfoRow({ label, children }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      {children}
    </div>
  );
}

function Tag({ children, color }) {
  const styles = {
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${styles[color] ?? styles.violet}`}>
      {children}
    </span>
  );
}

function ActionBtn({ onClick, icon, label, color, size, textSize = "text-2xl" }) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      aria-label={label}
      className={`${size} rounded-full shadow-md flex items-center justify-center font-bold ${textSize} ${color} transition-colors duration-150`}
    >
      {icon}
    </motion.button>
  );
}

function EmptyState({ hasFilters, onReset }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8 text-center">
      <div className="text-5xl mb-4">{hasFilters ? "🔍" : "🎓"}</div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">
        {hasFilters ? "条件に合う学生が見つかりません" : "全員チェックしました！"}
      </h2>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        {hasFilters
          ? "絞り込み条件を変えてみましょう。"
          : "スカウトした学生からの返信をお待ちください。"}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="bg-violet-500 text-white font-bold px-8 py-3 rounded-full shadow-md hover:bg-violet-600 transition-colors"
        >
          フィルターをリセット
        </button>
      )}
    </div>
  );
}
