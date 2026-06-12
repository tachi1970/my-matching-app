import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "../components/common/Header";
import LineConnectModal from "../components/common/LineConnectModal";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showLine, setShowLine] = useState(false);

  return (
    <div className="max-w-md mx-auto bg-white min-h-svh flex flex-col">
      <Header />

      {/* ===== ファーストビュー ===== */}
      <section className="px-6 pt-10 pb-14 bg-white text-center border-b border-gray-100">
        <div className="w-20 h-20 rounded-3xl bg-teal-50 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <img
            src="/mushi.png"
            alt="DentConnect"
            className="w-14 h-14"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <span className="text-5xl" style={{ display: "none" }}>🦷</span>
        </div>

        <div className="inline-block bg-teal-50 text-teal-600 text-xs font-bold px-4 py-1 rounded-full mb-4 tracking-wider">
          歯科大生 × 歯科医院 マッチング
        </div>

        <h1 className="text-2xl font-black text-gray-900 leading-snug mb-4">
          「働く」前に、「出会う」。<br />
          <span className="text-teal-500">全国の歯科医院から、</span><br />
          あなただけのメンターを<br />見つけよう。
        </h1>

        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          1年生から気軽に見学できる。<br />
          動画でわかる、リアルな医院の空気。
        </p>

        <button
          onClick={() => navigate("/search")}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold text-base py-4 rounded-2xl shadow-md shadow-teal-100 transition-all mb-3"
        >
          🔍 今すぐ医院を探す（無料）
        </button>

        <button
          onClick={() => setShowLine(true)}
          className="w-full bg-[#06C755] hover:bg-[#05a948] text-white font-bold text-base py-4 rounded-2xl shadow-md text-center transition-colors"
        >
          📲 LINEで無料事前登録
        </button>
      </section>

      {/* ===== 課題への共感 ===== */}
      <section className="px-6 py-12">
        <p className="text-xs font-black text-gray-400 tracking-widest text-center mb-6">
          こんな悩み、ありませんか？
        </p>
        <div className="space-y-3">
          {[
            { emoji: "😰", text: "就活の時期まで、現場の雰囲気を知る機会がほぼない" },
            { emoji: "🤔", text: "求人票の文字だけでは、院長の人柄や職場環境がわからない" },
            { emoji: "😣", text: "どの医院を見学すればいいのか、探す手段がない" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 flex items-start gap-3 border border-gray-100 shadow-sm"
            >
              <span className="text-2xl flex-shrink-0">{item.emoji}</span>
              <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 解決策 ===== */}
      <section className="px-6 pb-12">
        <p className="text-xs font-black text-teal-500 tracking-widest text-center mb-2">
          FEATURES
        </p>
        <h2 className="text-xl font-black text-gray-900 text-center mb-8 leading-tight">
          DentConnectの3つの特徴
        </h2>
        <div className="space-y-4">
          {[
            {
              num: "01",
              icon: "🎬",
              title: "動画でわかる、リアルな空気",
              desc: "院内の雰囲気、先生の話し方、スタッフの笑顔。文字では伝わらない「その医院らしさ」が、ショート動画で一瞬でわかります。",
              accent: "border-l-teal-400",
            },
            {
              num: "02",
              icon: "🎓",
              title: "1年生から気軽にいける見学",
              desc: "「まだ早いかな」は不要。1年生からでも歓迎してくれる医院だけを厳選。就活よりずっと前から、現場を知るチャンスがあります。",
              accent: "border-l-blue-400",
            },
            {
              num: "03",
              icon: "⚡",
              title: "サクサク探せる直感UI",
              desc: "エリア選択 → 動画を見る → ♡いいね。まるでSNSを使うように、全国の歯科医院を探せます。",
              accent: "border-l-violet-400",
            },
          ].map((item) => (
            <div
              key={item.num}
              className={`bg-white rounded-2xl p-5 border border-gray-100 border-l-4 ${item.accent} shadow-sm`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.icon}</span>
                <p className="text-xs font-black text-gray-300">{item.num}</p>
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 医院の先生方へ ===== */}
      <section className="mx-6 mb-10 bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-6 border border-violet-100">
        <p className="text-xs font-black text-violet-500 tracking-widest mb-2">FOR CLINIC</p>
        <h2 className="text-lg font-black text-gray-900 mb-2 leading-snug">
          医院の先生方へ
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-5">
          DentConnectで医院の魅力を動画で伝え、<br />
          理念に共感する学生と出会えます。<br />
          まずは無料ではじめてみましょう。
        </p>
        <button
          onClick={() => navigate("/clinic-register")}
          className="w-full py-3.5 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-xl shadow-md shadow-violet-100 text-sm transition-colors"
        >
          🏥 医院を無料登録する →
        </button>
      </section>

      {/* ===== 行動喚起 ===== */}
      <section className="px-6 pb-14 text-center">
        <h2 className="text-xl font-black text-gray-900 mb-2">今すぐ、出会いを始めよう</h2>
        <p className="text-gray-400 text-sm mb-6">学生の利用は完全無料</p>

        <button
          onClick={() => navigate("/search")}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold text-base py-4 rounded-2xl shadow-md shadow-teal-100 mb-3 transition-colors"
        >
          🔍 医院を探してみる
        </button>
        <button
          onClick={() => setShowLine(true)}
          className="w-full bg-[#06C755] hover:bg-[#05a948] text-white font-bold text-base py-4 rounded-2xl shadow-md text-center transition-colors"
        >
          📲 LINEで事前登録（通知を受け取る）
        </button>

        <p className="text-gray-300 text-xs mt-8">
          © 2025 DentConnect, Inc. All rights reserved.
        </p>
      </section>

      {/* LINE連携デモモーダル */}
      <AnimatePresence>
        {showLine && (
          <LineConnectModal
            onClose={() => setShowLine(false)}
            onRegister={() => {
              setShowLine(false);
              navigate("/student-register");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
