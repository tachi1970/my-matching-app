import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function Header({ title, showBack, backTarget }) {
  const { mode, setMode, clinicPlan, setClinicPlan } = useApp();
  const navigate = useNavigate();

  function handleBack() {
    if (backTarget) navigate(backTarget);
    else navigate(-1);
  }

  function switchMode(next) {
    setMode(next);
    navigate(next === "student" ? "/lp" : "/clinic");
  }

  function togglePlan() {
    setClinicPlan((p) => (p === "free" ? "standard" : "free"));
  }

  return (
    <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 z-10">
      {/* Left: back + logo */}
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={handleBack}
            className="mr-1 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors text-lg"
          >
            ←
          </button>
        )}
        <img
          src="/mushi.png"
          alt=""
          className="w-6 h-6"
          onError={(e) => (e.target.style.display = "none")}
        />
        <span className="font-black text-gray-900 tracking-tight text-lg">
          {title ?? "DentConnect"}
        </span>
      </div>

      {/* Right: debug plan badge (clinic only) + mode toggle */}
      <div className="flex items-center gap-1.5">
        {mode === "clinic" && (
          <button
            onClick={togglePlan}
            title="デモ用：プラン切り替え"
            className={`text-xs font-bold px-2 py-0.5 rounded border transition-all ${
              clinicPlan === "standard"
                ? "border-yellow-400 text-yellow-600 bg-yellow-50"
                : "border-gray-300 text-gray-400 bg-gray-50"
            }`}
          >
            {clinicPlan === "standard" ? "★PRO" : "FREE"}
          </button>
        )}

        {/* Mode toggle pill */}
        <div className="flex bg-gray-100 rounded-full p-0.5">
          <button
            onClick={() => switchMode("student")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
              mode === "student"
                ? "bg-teal-500 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            学生
          </button>
          <button
            onClick={() => switchMode("clinic")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
              mode === "clinic"
                ? "bg-violet-500 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            医院
          </button>
        </div>
      </div>
    </header>
  );
}
