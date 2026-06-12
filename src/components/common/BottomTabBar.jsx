import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";

const TABS = [
  {
    key: "home",
    label: "ホーム",
    icon: HomeIcon,
    paths: ["/home"],
  },
  {
    key: "explore",
    label: "探す",
    icon: SearchIcon,
    paths: ["/search", "/feed", "/clinic"],
  },
  {
    key: "talk",
    label: "トーク",
    icon: ChatIcon,
    paths: ["/talk", "/chat"],
  },
  {
    key: "mypage",
    label: "マイページ",
    icon: UserIcon,
    paths: ["/mypage"],
  },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useApp();

  function handleTab(tab) {
    if (tab.key === "explore") {
      navigate(mode === "clinic" ? "/clinic" : "/search");
    } else if (tab.key === "home") {
      navigate("/home");
    } else if (tab.key === "talk") {
      navigate("/talk");
    } else {
      navigate("/mypage");
    }
  }

  function isActive(tab) {
    return tab.paths.some((p) => location.pathname === p || location.pathname.startsWith(p + "/"));
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-md bg-white border-t border-gray-100 shadow-xl pointer-events-auto">
        <div className="flex">
          {TABS.map((tab) => {
            const active = isActive(tab);
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.key}
                whileTap={{ scale: 0.88 }}
                onClick={() => handleTab(tab)}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative"
              >
                {active && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-teal-500 rounded-full"
                  />
                )}
                <Icon
                  active={active}
                  className={`w-6 h-6 transition-colors duration-150 ${
                    active ? "text-teal-500" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-[10px] font-bold transition-colors duration-150 ${
                    active ? "text-teal-500" : "text-gray-400"
                  }`}
                >
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
        {/* iOS セーフエリア */}
        <div className="h-safe-area-bottom bg-white" />
      </div>
    </div>
  );
}

// ──── SVG Icons ────

function HomeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function SearchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ChatIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function UserIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
