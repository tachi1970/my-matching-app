import { useState, useEffect } from "react";

export function useActions(items, filterKey, { onMatch } = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [showSuperMatch, setShowSuperMatch] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setShowMatch(false);
    setShowSuperMatch(false);
  }, [filterKey]);

  const current = items[currentIndex] ?? null;
  const hasMore = currentIndex < items.length;

  function next() {
    setCurrentIndex((i) => i + 1);
  }

  function skip() {
    next();
  }

  function like() {
    if (current) onMatch?.(current);
    setShowMatch(true);
  }

  function dismissMatch() {
    setShowMatch(false);
    next();
  }

  function superLike() {
    if (current) onMatch?.(current);
    setShowSuperMatch(true);
  }

  function dismissSuperMatch() {
    setShowSuperMatch(false);
    next();
  }

  function reset() {
    setCurrentIndex(0);
    setShowMatch(false);
    setShowSuperMatch(false);
  }

  return {
    current,
    hasMore,
    showMatch,
    showSuperMatch,
    skip,
    like,
    superLike,
    dismissMatch,
    dismissSuperMatch,
    reset,
  };
}
