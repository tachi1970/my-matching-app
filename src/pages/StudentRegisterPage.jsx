import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { STUDENT_INTEREST_TAGS } from "../data/mockStudents";
import { prefectures } from "../data/mockClinics";

const DESIRED_AREAS = [...prefectures, "地元を希望"];

const STEP_LABELS = ["基本情報", "希望・興味", "自己PR"];

const INITIAL_FORM = {
  lastName: "",
  firstName: "",
  university: "",
  year: "",
  major: "",
  prefectureOrigin: "",
  interests: [],
  desiredAreas: [],
  message: "",
  agreeTerms: false,
};

function slide(dir = 1) {
  return {
    initial: { opacity: 0, x: 40 * dir },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 * dir },
    transition: { duration: 0.22 },
  };
}

export default function StudentRegisterPage() {
  const navigate = useNavigate();
  const { setMode, saveStudentProfile } = useApp();
  const [step, setStep] = useState(0); // 0,1,2 = form steps; 3 = success
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  function toggleArray(field, value) {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }));
  }

  function validateStep(s) {
    const e = {};
    if (s === 0) {
      if (!form.lastName.trim())  e.lastName = "姓を入力してください";
      if (!form.firstName.trim()) e.firstName = "名を入力してください";
      if (!form.university.trim()) e.university = "大学名を入力してください";
      if (!form.year) e.year = "学年を選択してください";
      if (!form.major) e.major = "専攻を選択してください";
    }
    if (s === 1) {
      if (!form.prefectureOrigin) e.prefectureOrigin = "出身地を選択してください";
      if (form.interests.length === 0) e.interests = "1つ以上選択してください";
      if (form.desiredAreas.length === 0) e.desiredAreas = "1つ以上選択してください";
    }
    if (s === 2) {
      if (!form.agreeTerms) e.agreeTerms = "利用規約に同意してください";
    }
    return e;
  }

  function goNext() {
    const e = validateStep(step);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setDirection(1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => s - 1);
  }

  function handleSubmit() {
    const e = validateStep(2);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    saveStudentProfile(form);
    setMode("student");
    setDirection(1);
    setStep(3);
  }

  return (
    <div className="flex flex-col min-h-svh max-w-md mx-auto bg-white">
      {/* ヘッダー */}
      <header className="flex-shrink-0 flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-white">
        {step < 3 && step > 0 && (
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 text-lg transition-colors"
          >
            ←
          </button>
        )}
        {(step === 0 || step === 3) && (
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 text-lg transition-colors"
          >
            ←
          </button>
        )}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xl">🦷</span>
          <span className="font-black text-gray-900 text-base">
            {step < 3 ? "学生新規登録" : "登録完了"}
          </span>
        </div>
      </header>

      {/* ステップインジケーター */}
      {step < 3 && (
        <div className="flex-shrink-0 px-5 py-3 bg-white border-b border-gray-50">
          <div className="flex items-center gap-2 mb-2">
            {STEP_LABELS.map((label, i) => (
              <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                      i < step
                        ? "bg-teal-500 text-white"
                        : i === step
                        ? "bg-teal-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs font-bold ${i === step ? "text-teal-600" : "text-gray-400"}`}>
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full ${i < step ? "bg-teal-400" : "bg-gray-100"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* フォームエリア */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && (
            <motion.div key="step0" {...slide(direction)} className="px-5 py-6 space-y-5">
              <StepTitle icon="👤" title="基本情報" sub="あなたのプロフィールを教えてください" />

              {/* 名前 */}
              <div>
                <Label required>お名前</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                      placeholder="田中"
                      className={InputClass(errors.lastName)}
                    />
                    {errors.lastName && <ErrMsg>{errors.lastName}</ErrMsg>}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                      placeholder="花子"
                      className={InputClass(errors.firstName)}
                    />
                    {errors.firstName && <ErrMsg>{errors.firstName}</ErrMsg>}
                  </div>
                </div>
              </div>

              {/* 大学名 */}
              <div>
                <Label required>大学名</Label>
                <input
                  type="text"
                  value={form.university}
                  onChange={(e) => set("university", e.target.value)}
                  placeholder="例：九州歯科大学"
                  className={InputClass(errors.university)}
                />
                {errors.university && <ErrMsg>{errors.university}</ErrMsg>}
              </div>

              {/* 学年 */}
              <div>
                <Label required>学年</Label>
                <div className="flex gap-2 flex-wrap">
                  {["1", "2", "3", "4", "5", "6"].map((y) => (
                    <button
                      key={y}
                      onClick={() => set("year", y)}
                      className={`w-14 h-11 rounded-xl font-bold text-sm border-2 transition-colors ${
                        form.year === y
                          ? "bg-teal-500 border-teal-500 text-white"
                          : "bg-white border-gray-200 text-gray-600 hover:border-teal-300"
                      }`}
                    >
                      {y}年
                    </button>
                  ))}
                </div>
                {errors.year && <ErrMsg>{errors.year}</ErrMsg>}
              </div>

              {/* 専攻 */}
              <div>
                <Label required>専攻</Label>
                <div className="flex gap-2">
                  {["歯学科", "口腔衛生科"].map((m) => (
                    <button
                      key={m}
                      onClick={() => set("major", m)}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-colors ${
                        form.major === m
                          ? "bg-teal-500 border-teal-500 text-white"
                          : "bg-white border-gray-200 text-gray-600 hover:border-teal-300"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                {errors.major && <ErrMsg>{errors.major}</ErrMsg>}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" {...slide(direction)} className="px-5 py-6 space-y-6">
              <StepTitle icon="🗺️" title="希望・興味" sub="希望エリアと興味のある分野を選んでください" />

              {/* 出身地 */}
              <div>
                <Label required>出身地（都道府県）</Label>
                <select
                  value={form.prefectureOrigin}
                  onChange={(e) => set("prefectureOrigin", e.target.value)}
                  className={`${InputClass(errors.prefectureOrigin)} appearance-none`}
                >
                  <option value="">選択してください</option>
                  {prefectures.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.prefectureOrigin && <ErrMsg>{errors.prefectureOrigin}</ErrMsg>}
              </div>

              {/* 興味のある分野 */}
              <div>
                <Label required>興味のある分野（複数選択可）</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {STUDENT_INTEREST_TAGS.map((tag) => (
                    <Chip
                      key={tag}
                      selected={form.interests.includes(tag)}
                      onClick={() => toggleArray("interests", tag)}
                      color="teal"
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
                {errors.interests && <ErrMsg>{errors.interests}</ErrMsg>}
              </div>

              {/* 希望エリア */}
              <div>
                <Label required>将来働きたいエリア（複数選択可）</Label>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {DESIRED_AREAS.map((area) => (
                    <Chip
                      key={area}
                      selected={form.desiredAreas.includes(area)}
                      onClick={() => toggleArray("desiredAreas", area)}
                      color="violet"
                      small
                    >
                      {area}
                    </Chip>
                  ))}
                </div>
                {errors.desiredAreas && <ErrMsg>{errors.desiredAreas}</ErrMsg>}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...slide(direction)} className="px-5 py-6 space-y-5">
              <StepTitle icon="✍️" title="自己PR" sub="医院の先生方へのメッセージを書きましょう（任意）" />

              {/* 自己PR */}
              <div>
                <Label>自己PRメッセージ（任意）</Label>
                <textarea
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="例：将来は地域の子どもたちの口腔健康を守る歯科医師を目指しています。見学を通じて現場の雰囲気を体感したいです！"
                  rows={5}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none leading-relaxed"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{form.message.length} / 200文字</p>
              </div>

              {/* 登録内容プレビュー */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">登録内容の確認</p>
                <div className="space-y-2 text-sm">
                  <PreviewRow label="名前">{form.lastName} {form.firstName}</PreviewRow>
                  <PreviewRow label="大学">{form.university}</PreviewRow>
                  <PreviewRow label="学年・専攻">{form.year}年生 / {form.major}</PreviewRow>
                  <PreviewRow label="出身地">{form.prefectureOrigin}</PreviewRow>
                  <PreviewRow label="興味分野">{form.interests.slice(0, 3).join("・")}{form.interests.length > 3 ? `…他${form.interests.length - 3}件` : ""}</PreviewRow>
                  <PreviewRow label="希望エリア">{form.desiredAreas.slice(0, 3).join("・")}{form.desiredAreas.length > 3 ? `…他${form.desiredAreas.length - 3}件` : ""}</PreviewRow>
                </div>
              </div>

              {/* 利用規約 */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <div
                    onClick={() => set("agreeTerms", !form.agreeTerms)}
                    className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                      form.agreeTerms ? "bg-teal-500 border-teal-500" : "border-gray-300"
                    }`}
                  >
                    {form.agreeTerms && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2 6 5 9 10 3" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed">
                    <span className="text-teal-600 font-semibold underline">利用規約</span>および
                    <span className="text-teal-600 font-semibold underline">プライバシーポリシー</span>
                    に同意します
                  </span>
                </label>
                {errors.agreeTerms && <ErrMsg>{errors.agreeTerms}</ErrMsg>}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="flex flex-col items-center justify-center px-6 py-16 text-center min-h-[60vh]"
            >
              {/* 成功アイコン */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center mb-6 shadow-sm"
              >
                <span className="text-5xl">🎉</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-black text-gray-900 mb-2">登録完了！</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-2">
                  {form.lastName} {form.firstName} さん、<br />
                  DentConnectへようこそ🦷
                </p>
                <p className="text-gray-400 text-xs mb-8">
                  全国の歯科医院があなたを待っています
                </p>
              </motion.div>

              {/* アクションボタン */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="w-full space-y-3"
              >
                <button
                  onClick={() => navigate("/search")}
                  className="w-full bg-teal-500 text-white font-bold text-base py-4 rounded-2xl shadow-md shadow-teal-100 transition-opacity active:opacity-80"
                >
                  🔍 医院を探してみる →
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="w-full bg-white text-gray-700 font-bold text-sm py-3.5 rounded-2xl border border-gray-200 transition-colors hover:border-teal-300"
                >
                  ホームへ
                </button>
              </motion.div>

              {/* 登録内容サマリー */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 w-full bg-gray-50 rounded-2xl px-4 py-4 text-left border border-gray-100"
              >
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">登録プロフィール</p>
                <p className="font-black text-gray-900 text-base">{form.lastName} {form.firstName}</p>
                <p className="text-sm text-gray-500">{form.university} {form.year}年生（{form.major}）</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.interests.slice(0, 4).map((t) => (
                    <span key={t} className="text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full font-medium">{t}</span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* フッターボタン */}
      {step < 3 && (
        <div className="flex-shrink-0 px-5 py-4 bg-white border-t border-gray-100">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={step === 2 ? handleSubmit : goNext}
            className="w-full bg-teal-500 text-white font-bold text-base py-4 rounded-2xl shadow-md shadow-teal-100 transition-opacity active:opacity-80"
          >
            {step === 2 ? "登録する 🎉" : "次へ →"}
          </motion.button>
          <p className="text-center text-xs text-gray-400 mt-2">
            ステップ {step + 1} / {STEP_LABELS.length}
          </p>
        </div>
      )}
    </div>
  );
}

// ──── 小コンポーネント ────

function StepTitle({ icon, title, sub }) {
  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <h2 className="text-lg font-black text-gray-900">{title}</h2>
      </div>
      <p className="text-sm text-gray-400">{sub}</p>
    </div>
  );
}

function Label({ children, required }) {
  return (
    <p className="text-sm font-bold text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-1 text-xs">*</span>}
    </p>
  );
}

function ErrMsg({ children }) {
  return <p className="text-red-400 text-xs mt-1 font-medium">{children}</p>;
}

function InputClass(err) {
  return `w-full rounded-2xl border ${err ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"} px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-shadow`;
}

function Chip({ children, selected, onClick, color, small = false }) {
  const active = {
    teal: "bg-teal-500 border-teal-500 text-white",
    violet: "bg-violet-500 border-violet-500 text-white",
  };
  const inactive = "bg-white border-gray-200 text-gray-600 hover:border-gray-300";
  const size = small ? "px-2.5 py-1 text-xs" : "px-3.5 py-2 text-sm";
  return (
    <button
      onClick={onClick}
      className={`${size} rounded-full border-2 font-bold transition-colors ${
        selected ? (active[color] ?? active.teal) : inactive
      }`}
    >
      {children}
    </button>
  );
}

function PreviewRow({ label, children }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-400 text-xs font-medium w-20 flex-shrink-0">{label}</span>
      <span className="text-gray-700 text-xs font-semibold flex-1">{children || "—"}</span>
    </div>
  );
}
