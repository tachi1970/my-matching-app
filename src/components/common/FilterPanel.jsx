import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * groups: Array<{
 *   label: string,
 *   options: string[],
 *   isSelected: (val: string) => boolean,
 *   onToggle: (val: string) => void,
 *   multi?: boolean,
 * }>
 * accentColor: 'teal' | 'violet'
 */
export default function FilterPanel({ groups, activeCount, onReset, accentColor = "teal" }) {
  const [open, setOpen] = useState(false);

  const selectedClass =
    accentColor === "violet"
      ? "bg-violet-500 border-violet-500 text-white"
      : "bg-teal-500 border-teal-500 text-white";

  return (
    <div className="border-b border-gray-100 bg-white">
      {/* Toggle row */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">絞り込み</span>
          {activeCount > 0 && (
            <span
              className={`text-white text-xs font-bold px-2 py-0.5 rounded-full ${
                accentColor === "violet" ? "bg-violet-500" : "bg-teal-500"
              }`}
            >
              {activeCount}
            </span>
          )}
        </div>
        <span className="text-gray-400 text-xs">
          {open ? "▲ 閉じる" : "▼ 開く"}
        </span>
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="filter-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-4 border-t border-gray-50">
              {groups.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {group.label}
                    {group.multi && (
                      <span className="ml-1 font-normal normal-case tracking-normal text-gray-300">
                        （複数選択可）
                      </span>
                    )}
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
                    {group.options.map((opt) => {
                      const selected = group.isSelected(opt);
                      return (
                        <motion.button
                          key={opt}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => group.onToggle(opt)}
                          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-150 ${
                            selected
                              ? selectedClass
                              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {opt}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {activeCount > 0 && (
                <button
                  onClick={() => { onReset(); setOpen(false); }}
                  className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
                >
                  フィルターをリセット
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
