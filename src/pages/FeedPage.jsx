import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { mockClinics, CLINIC_FEATURE_TAGS } from "../data/mockClinics";
import { useActions } from "../hooks/useActions";
import { useClinicFilters } from "../hooks/useFilters";
import ClinicCard from "../components/clinic/ClinicCard";
import BottomActionBar from "../components/common/BottomActionBar";
import MushiPopup from "../components/animations/MushiPopup";
import MatchPopup from "../components/animations/MatchPopup";
import Header from "../components/common/Header";
import FilterPanel from "../components/common/FilterPanel";
import BottomTabBar from "../components/common/BottomTabBar";

export default function FeedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefecture = location.state?.prefecture;

  // 都道府県で絞り込み
  const prefFiltered = prefecture
    ? mockClinics.filter((c) => c.prefecture === prefecture)
    : mockClinics;

  // タグフィルター
  const {
    filtered,
    filterKey,
    activeCount,
    state: fState,
    toggleTargetMajor,
    toggleFeature,
    toggleDirectorBackground,
    reset: resetFilters,
  } = useClinicFilters(prefFiltered);

  const {
    current,
    hasMore,
    showMushi,
    showMatch,
    skip,
    like,
    superLike,
    dismissMatch,
    reset,
  } = useActions(filtered, filterKey);

  function handleGoToChat() {
    navigate("/chat", { state: { partnerName: `${current?.name} 院長` } });
  }

  const isBlocked = !hasMore || !current || showMushi || showMatch;

  // FilterPanel のグループ定義
  const filterGroups = [
    {
      label: "募集対象",
      options: ["歯学科", "口腔衛生科"],
      isSelected: (v) => fState.targetMajor === v,
      onToggle: toggleTargetMajor,
    },
    {
      label: "特徴・技術",
      options: CLINIC_FEATURE_TAGS,
      isSelected: (v) => fState.features.includes(v),
      onToggle: toggleFeature,
      multi: true,
    },
    {
      label: "院長出身",
      options: ["国公立", "私立"],
      isSelected: (v) => fState.directorBackground === v,
      onToggle: toggleDirectorBackground,
    },
  ];

  return (
    <div className="flex flex-col h-svh max-w-md mx-auto bg-white relative overflow-hidden">
      <Header showBack backTarget="/search" />

      {prefecture && (
        <div className="flex-shrink-0 px-4 py-1.5 bg-teal-50 border-b border-teal-100">
          <span className="text-xs text-teal-600 font-semibold">
            📍 {prefecture}の医院を表示中
          </span>
        </div>
      )}

      {/* フィルターパネル */}
      <FilterPanel
        groups={filterGroups}
        activeCount={activeCount}
        onReset={resetFilters}
        accentColor="teal"
      />

      {/* カードエリア */}
      <div className="flex-1 relative overflow-hidden">
        {hasMore && current ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + filterKey}
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.25 }}
            >
              <ClinicCard clinic={current} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <EmptyState
            hasFilters={activeCount > 0}
            onReset={activeCount > 0 ? resetFilters : reset}
          />
        )}
      </div>

      <BottomActionBar
        onSkip={skip}
        onSuperLike={superLike}
        onLike={like}
        disabled={isBlocked}
      />

      <MushiPopup visible={showMushi} />
      <MatchPopup
        visible={showMatch}
        partnerName={current?.name ?? ""}
        onGoToChat={handleGoToChat}
        onDismiss={dismissMatch}
      />
      <BottomTabBar />
    </div>
  );
}

function EmptyState({ hasFilters, onReset }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8 text-center pb-24">
      <div className="text-5xl mb-4">{hasFilters ? "🔍" : "🦷"}</div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">
        {hasFilters ? "条件に合う医院が見つかりません" : "全部チェックしました！"}
      </h2>
      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
        {hasFilters
          ? "絞り込み条件を変えてみましょう。"
          : "気になった医院には、ぜひ見学申し込みをしてみましょう。"}
      </p>
      <button
        onClick={onReset}
        className="bg-teal-500 text-white font-bold px-8 py-3 rounded-full shadow-md hover:bg-teal-600 transition-colors"
      >
        {hasFilters ? "フィルターをリセット" : "もう一度見る"}
      </button>
    </div>
  );
}
