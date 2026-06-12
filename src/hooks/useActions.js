import { useState, useEffect } from "react";

export function useActions(clinics, filterKey) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMushi, setShowMushi] = useState(false);
  const [showMatch, setShowMatch] = useState(false);

  // フィルター変更時にインデックスをリセット
  useEffect(() => {
    setCurrentIndex(0);
    setShowMatch(false);
  }, [filterKey]);

  const current = clinics[currentIndex] ?? null;
  const hasMore = currentIndex < clinics.length;

  function next() {
    setCurrentIndex((i) => i + 1);
  }

  function skip() {
    next();
  }

  function like() {
    setShowMatch(true);
  }

  function dismissMatch() {
    setShowMatch(false);
    next();
  }

  function superLike() {
    setShowMushi(true);
    setTimeout(() => {
      setShowMushi(false);
      next();
    }, 1800);
  }

  function reset() {
    setCurrentIndex(0);
    setShowMatch(false);
  }

  return {
    current,
    hasMore,
    showMushi,
    showMatch,
    skip,
    like,
    superLike,
    dismissMatch,
    reset,
  };
}
