import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { prefectures } from "../data/mockClinics";
import Header from "../components/common/Header";
import BottomTabBar from "../components/common/BottomTabBar";

const regions = [
  {
    name: "北海道・東北",
    prefs: ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
  },
  {
    name: "関東",
    prefs: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
  },
  {
    name: "中部",
    prefs: [
      "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
      "岐阜県", "静岡県", "愛知県", "三重県",
    ],
  },
  {
    name: "近畿",
    prefs: ["滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
  },
  {
    name: "中国・四国",
    prefs: ["鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県"],
  },
  {
    name: "九州・沖縄",
    prefs: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"],
  },
];

export default function AreaSearchPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [activeRegion, setActiveRegion] = useState(null);

  function handleSelect(pref) {
    setSelected(pref === selected ? null : pref);
  }

  function handleStart() {
    navigate("/feed", { state: { prefecture: selected } });
  }

  function handleAll() {
    navigate("/feed", { state: { prefecture: null } });
  }

  return (
    <div className="flex flex-col h-svh max-w-md mx-auto bg-white">
      <Header showBack backTarget="/home" />

      {/* Hero section */}
      <div className="flex-shrink-0 bg-gradient-to-b from-teal-500 to-teal-600 px-4 py-5">
        <h1 className="text-white text-xl font-bold leading-snug">
          どのエリアの歯科医院を<br />探しますか？
        </h1>
        <p className="text-teal-100 text-xs mt-1">見学・メンター探しをスタート</p>
      </div>

      {/* Search body */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* All Japan */}
        <button
          onClick={handleAll}
          className="w-full mb-4 py-3 rounded-xl bg-teal-50 border-2 border-teal-300 text-teal-700 font-bold text-sm hover:bg-teal-100 transition-colors"
        >
          🗾 全国すべてから探す
        </button>

        {/* Regions */}
        {regions.map((region) => (
          <div key={region.name} className="mb-3">
            <button
              onClick={() =>
                setActiveRegion(activeRegion === region.name ? null : region.name)
              }
              className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors mb-2"
            >
              <span className="font-semibold text-gray-700 text-sm">
                {region.name}
              </span>
              <span className="text-gray-400 text-xs">
                {activeRegion === region.name ? "▲" : "▼"}
              </span>
            </button>

            {activeRegion === region.name && (
              <div className="flex flex-wrap gap-2 px-1">
                {region.prefs.map((pref) => (
                  <button
                    key={pref}
                    onClick={() => handleSelect(pref)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
                      selected === pref
                        ? "bg-teal-500 border-teal-500 text-white shadow-sm scale-105"
                        : "bg-white border-gray-200 text-gray-700 hover:border-teal-300"
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="flex-shrink-0 px-4 pb-20 pt-3 border-t border-gray-100 bg-white">
        {selected ? (
          <button
            onClick={handleStart}
            className="w-full py-4 bg-teal-500 text-white font-bold text-base rounded-2xl shadow-lg hover:bg-teal-600 transition-colors"
          >
            📍 {selected} の医院を見る →
          </button>
        ) : (
          <p className="text-center text-sm text-gray-400">
            エリアを選んでください
          </p>
        )}
      </div>

      <BottomTabBar />
    </div>
  );
}
