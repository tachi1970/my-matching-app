import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { prefectures } from "../data/mockClinics";

// ─── 定数 ───────────────────────────────────────────────
const SKILL_OPTIONS = [
  "インプラント","審美歯科","小児歯科","矯正歯科","訪問歯科",
  "口腔外科","ホワイトニング","義歯","エンドドンティクス",
  "マタニティ歯科","予防歯科","障害者歯科",
];
const FEATURE_OPTIONS = [
  "優しく教える","地域密着","最新機器","女性活躍",
  "幅広い症例","チーム医療重視","ワークライフバランス","専門医在籍",
];
const SALARY_OPTIONS = ["〜24万円","25〜27万円","28〜30万円","31万円以上","要相談"];
const STEP_LABELS = ["基本情報","医院の魅力","受け入れ条件","プラン選択"];
const INITIAL_FORM = {
  name:"", prefecture:"", area:"",
  directorName:"", directorUniv:"", directorBackground:null, directorYear:"",
  tagline:"", philosophy:"", skills:[], features:[],
  targetMajor:"両方", targetGrades:[], staffDentists:"", staffHygienists:"",
  salary:"", availableDates:[],
};

// ─── メインコンポーネント ────────────────────────────────
export default function ClinicRegisterPage() {
  const navigate = useNavigate();
  const { setClinicPlan, setMode, saveClinicProfile } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dateInput, setDateInput] = useState("");

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function toggleArr(key, val) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val],
    }));
  }

  function addDate() {
    const d = dateInput.trim();
    if (d && !form.availableDates.includes(d)) {
      update("availableDates", [...form.availableDates, d]);
      setDateInput("");
    }
  }

  function removeDate(d) {
    update("availableDates", form.availableDates.filter((x) => x !== d));
  }

  function complete(plan) {
    saveClinicProfile(form);
    setClinicPlan(plan);
    setMode("clinic");
    setShowSuccess(true);
  }

  const canNext =
    step === 1
      ? form.name.trim() && form.prefecture && form.directorName.trim()
      : true;

  return (
    <div className="flex flex-col h-svh max-w-md mx-auto bg-white">
      {/* ヘッダー */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
        <button
          onClick={() => (step > 1 ? setStep((s) => s - 1) : navigate(-1))}
          className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-lg transition-colors"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-sm">医院の新規登録</p>
          <p className="text-xs text-gray-400">
            STEP {step} / 4 — {STEP_LABELS[step - 1]}
          </p>
        </div>
        <span className="text-xs text-gray-300">{step}/4</span>
      </header>

      {/* プログレスバー */}
      <div className="flex-shrink-0 flex gap-1.5 px-4 py-2.5 bg-white">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all duration-400 ${
              s <= step ? "bg-teal-400" : "bg-gray-100"
            }`}
          />
        ))}
      </div>

      {/* ステップコンテンツ */}
      <div className="flex-1 overflow-y-auto bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.18 }}
            className="px-5 py-5 pb-8"
          >
            {step === 1 && <Step1 form={form} update={update} />}
            {step === 2 && <Step2 form={form} update={update} toggleArr={toggleArr} />}
            {step === 3 && (
              <Step3
                form={form} update={update} toggleArr={toggleArr}
                dateInput={dateInput} setDateInput={setDateInput}
                addDate={addDate} removeDate={removeDate}
              />
            )}
            {step === 4 && <Step4 form={form} onComplete={complete} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 下部ナビ（Step 4はStep4コンポーネント内でハンドル） */}
      {step < 4 && (
        <div className="flex-shrink-0 px-5 pb-8 pt-3 border-t border-gray-100 bg-white">
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext}
            className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold text-base rounded-2xl shadow-md shadow-teal-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            次へ進む →
          </button>
          {step === 1 && !canNext && (
            <p className="text-center text-xs text-gray-400 mt-2">
              ＊ の項目を入力してください
            </p>
          )}
        </div>
      )}

      {/* 登録完了モーダル */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              className="relative bg-white rounded-3xl p-8 text-center w-full max-w-sm shadow-2xl"
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-xl font-black text-gray-900 mb-2">登録完了！</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                <span className="font-semibold text-gray-700">
                  {form.name || "医院"}
                </span>
                の登録が完了しました。<br />
                さっそく学生を探してみましょう！
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/clinic")}
                className="w-full py-4 bg-teal-500 text-white font-bold rounded-2xl shadow-md shadow-teal-100 hover:bg-teal-600 transition-colors"
              >
                学生を探す →
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── STEP 1 ─────────────────────────────────────────────
function Step1({ form, update }) {
  const years = Array.from({ length: 44 }, (_, i) => 2024 - i);

  return (
    <div className="space-y-5">
      <StepTitle
        title="基本情報"
        subtitle="医院と院長先生のプロフィールを入力してください"
      />

      <Field label="医院名" required>
        <Input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="〇〇歯科クリニック"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="都道府県" required>
          <Select value={form.prefecture} onChange={(e) => update("prefecture", e.target.value)}>
            <option value="">選択</option>
            {prefectures.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
        </Field>
        <Field label="エリア・最寄り駅">
          <Input
            value={form.area}
            onChange={(e) => update("area", e.target.value)}
            placeholder="渋谷駅 徒歩5分"
          />
        </Field>
      </div>

      <Divider label="院長プロフィール" />

      <Field label="院長名" required>
        <Input
          value={form.directorName}
          onChange={(e) => update("directorName", e.target.value)}
          placeholder="田中 誠一"
        />
      </Field>

      <Field label="出身大学">
        <Input
          value={form.directorUniv}
          onChange={(e) => update("directorUniv", e.target.value)}
          placeholder="東京医科歯科大学"
        />
      </Field>

      <Field label="大学区分">
        <div className="flex gap-2">
          {["国公立", "私立"].map((t) => (
            <ToggleChip
              key={t}
              selected={form.directorBackground === t}
              onClick={() => update("directorBackground", form.directorBackground === t ? null : t)}
            >
              {t}
            </ToggleChip>
          ))}
        </div>
      </Field>

      <Field label="卒業年">
        <Select value={form.directorYear} onChange={(e) => update("directorYear", e.target.value)}>
          <option value="">選択してください</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}年</option>
          ))}
        </Select>
      </Field>
    </div>
  );
}

// ─── STEP 2 ─────────────────────────────────────────────
function Step2({ form, update, toggleArr }) {
  return (
    <div className="space-y-6">
      <StepTitle
        title="医院の魅力を伝える"
        subtitle="学生が一番気にするポイントを教えてください"
      />

      <Field label="キャッチコピー" hint="学生に最初に伝えたい一言（30文字以内）">
        <Input
          value={form.tagline}
          onChange={(e) => update("tagline", e.target.value.slice(0, 30))}
          placeholder="「患者さんと一緒に、一生口腔ケアを続ける」"
        />
        <p className="text-xs text-gray-400 text-right mt-1">{form.tagline.length}/30</p>
      </Field>

      <Field label="院長からのメッセージ" hint="なぜ学生の見学を受け入れているか、どんな学生に来てほしいか">
        <textarea
          value={form.philosophy}
          onChange={(e) => update("philosophy", e.target.value)}
          placeholder="私たちの医院では、学生時代から現場の空気を感じてほしいと思っています..."
          rows={4}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all resize-none"
        />
      </Field>

      <Field label="学べる技術・診療内容" hint="複数選択できます">
        <TagSelector
          options={SKILL_OPTIONS}
          selected={form.skills}
          onToggle={(v) => toggleArr("skills", v)}
        />
      </Field>

      <Field label="医院の特徴・雰囲気" hint="複数選択できます">
        <TagSelector
          options={FEATURE_OPTIONS}
          selected={form.features}
          onToggle={(v) => toggleArr("features", v)}
        />
      </Field>
    </div>
  );
}

// ─── STEP 3 ─────────────────────────────────────────────
function Step3({ form, update, toggleArr, dateInput, setDateInput, addDate, removeDate }) {
  return (
    <div className="space-y-6">
      <StepTitle
        title="受け入れ条件"
        subtitle="どんな学生をどんな条件で受け入れたいか設定します"
      />

      <Field label="募集対象">
        <div className="flex gap-2">
          {["歯学科", "口腔衛生科", "両方"].map((t) => (
            <ToggleChip
              key={t}
              selected={form.targetMajor === t}
              onClick={() => update("targetMajor", t)}
            >
              {t}
            </ToggleChip>
          ))}
        </div>
      </Field>

      <Field label="歓迎する学年" hint="複数選択できます">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((grade) => (
            <button
              key={grade}
              onClick={() => toggleArr("targetGrades", grade)}
              className={`w-11 h-11 rounded-full text-sm font-bold border-2 transition-all ${
                form.targetGrades.includes(grade)
                  ? "bg-teal-500 border-teal-500 text-white shadow-sm"
                  : "border-gray-200 text-gray-500 hover:border-teal-300"
              }`}
            >
              {grade}年
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="歯科医師スタッフ">
          <div className="relative">
            <Input
              type="number"
              min="0"
              value={form.staffDentists}
              onChange={(e) => update("staffDentists", e.target.value)}
              placeholder="0"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">名</span>
          </div>
        </Field>
        <Field label="衛生士スタッフ">
          <div className="relative">
            <Input
              type="number"
              min="0"
              value={form.staffHygienists}
              onChange={(e) => update("staffHygienists", e.target.value)}
              placeholder="0"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">名</span>
          </div>
        </Field>
      </div>

      <Field label="初任給の目安">
        <div className="flex flex-wrap gap-2">
          {SALARY_OPTIONS.map((s) => (
            <ToggleChip
              key={s}
              selected={form.salary === s}
              onClick={() => update("salary", s === form.salary ? "" : s)}
            >
              {s}
            </ToggleChip>
          ))}
        </div>
      </Field>

      <Field label="直近の見学空き日程" hint='例：6/15(月) 午前　→「追加」ボタンで登録'>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addDate()}
            placeholder="6/15(月) 午前"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all"
          />
          <button
            onClick={addDate}
            className="px-5 py-3 bg-teal-500 text-white rounded-xl text-sm font-bold flex-shrink-0 hover:bg-teal-600 transition-colors shadow-sm"
          >
            追加
          </button>
        </div>

        {form.availableDates.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.availableDates.map((d) => (
              <span
                key={d}
                className="flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium px-3 py-1.5 rounded-full"
              >
                📅 {d}
                <button
                  onClick={() => removeDate(d)}
                  className="text-teal-400 hover:text-teal-700 font-bold leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </Field>
    </div>
  );
}

// ─── STEP 4 ─────────────────────────────────────────────
function Step4({ onComplete }) {
  return (
    <div>
      <StepTitle
        title="プランを選んで完了"
        subtitle="あとからいつでも変更できます。まずは無料ではじめてみましょう"
      />

      <div className="space-y-4 mt-6">
        {/* Free plan */}
        <div className="border-2 border-gray-200 rounded-2xl p-5 bg-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-widest mb-1">FREE</p>
              <p className="text-xl font-black text-gray-900">フリープラン</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-gray-900">¥0</p>
              <p className="text-xs text-gray-400">/ 月</p>
            </div>
          </div>

          <ul className="space-y-2 mb-5">
            {[
              [true, "動画掲載・学生の閲覧"],
              [true, "マッチング成立の通知"],
              [true, "最初の3通メッセージ"],
              [false, "メッセージ無制限（3通以降）"],
              [false, "スカウト機能"],
            ].map(([ok, text]) => (
              <li key={text} className="flex items-center gap-2 text-sm">
                <span className={ok ? "text-teal-500 font-bold" : "text-gray-300"}>
                  {ok ? "✓" : "✕"}
                </span>
                <span className={ok ? "text-gray-700" : "text-gray-400"}>
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onComplete("free")}
            className="w-full py-3.5 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:border-gray-300 transition-colors text-sm"
          >
            まずは無料ではじめる
          </button>
        </div>

        {/* Standard plan */}
        <div className="relative rounded-2xl p-5 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-200">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1 rounded-full shadow">
              ⭐ おすすめ
            </span>
          </div>

          <div className="flex items-start justify-between mb-4 pt-2">
            <div>
              <p className="text-xs font-bold text-violet-200 tracking-widest mb-1">STANDARD</p>
              <p className="text-xl font-black">スタンダードプラン</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black">¥30,000</p>
              <p className="text-xs text-violet-200">/ 月（税抜）</p>
            </div>
          </div>

          <ul className="space-y-2 mb-6">
            {[
              "動画掲載・学生の閲覧",
              "マッチング成立の通知",
              "学生へのメッセージ無制限",
              "スカウト（オファー）機能",
              "検索結果での優先表示",
            ].map((text) => (
              <li key={text} className="flex items-center gap-2 text-sm">
                <span className="text-yellow-300 font-bold">✓</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onComplete("standard")}
            className="w-full py-4 bg-white text-violet-700 font-black rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
          >
            スタンダードで登録する（デモ）
          </motion.button>
          <p className="text-center text-violet-200 text-xs mt-2">
            ※ デモのため実際の課金は発生しません
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── 共通 UI ────────────────────────────────────────────
function StepTitle({ title, subtitle }) {
  return (
    <div className="mb-2">
      <h2 className="text-xl font-black text-gray-900 leading-tight">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-1 text-xs">必須</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-2 leading-relaxed">{hint}</p>}
      {children}
    </div>
  );
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all ${className}`}
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all appearance-none"
    >
      {children}
    </select>
  );
}

function ToggleChip({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
        selected
          ? "bg-teal-500 border-teal-500 text-white shadow-sm"
          : "border-gray-200 text-gray-600 hover:border-teal-200"
      }`}
    >
      {children}
    </button>
  );
}

function TagSelector({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onToggle(opt)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
            selected.includes(opt)
              ? "bg-teal-500 border-teal-500 text-white shadow-sm"
              : "border-gray-200 text-gray-600 bg-white hover:border-teal-200"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
