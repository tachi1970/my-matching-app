import { AnimatePresence, motion } from "framer-motion";

export default function MushiPopup({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: [0, 1.3, 1.1, 1], rotate: [0, 10, -8, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, times: [0, 0.4, 0.7, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <img
              src="/mushi.png"
              alt="虫歯の虫"
              className="w-40 h-40 drop-shadow-2xl"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div
              style={{ display: "none" }}
              className="w-40 h-40 rounded-full bg-yellow-300 text-7xl items-center justify-center shadow-2xl"
            >
              🦷
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-yellow-400 text-gray-900 font-bold text-lg px-6 py-2 rounded-full shadow-lg"
            >
              ★ スーパーライク！
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
