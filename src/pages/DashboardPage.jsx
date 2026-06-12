import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '../components/common/Header';

// 47都道府県 × (col, row) タイルマップ座標 + ダミーデータ
const PREF_DATA = [
  { name: '北海道', short: '北海', col: 9, row: 0,  clinics: 36, students: 96 },
  { name: '青森県', short: '青森', col: 8, row: 1,  clinics: 12, students: 32 },
  { name: '秋田県', short: '秋田', col: 7, row: 2,  clinics: 10, students: 26 },
  { name: '岩手県', short: '岩手', col: 9, row: 2,  clinics: 10, students: 28 },
  { name: '山形県', short: '山形', col: 8, row: 3,  clinics: 10, students: 28 },
  { name: '宮城県', short: '宮城', col: 9, row: 3,  clinics: 24, students: 64 },
  { name: '新潟県', short: '新潟', col: 7, row: 4,  clinics: 16, students: 44 },
  { name: '福島県', short: '福島', col: 8, row: 4,  clinics: 16, students: 44 },
  { name: '石川県', short: '石川', col: 6, row: 5,  clinics: 14, students: 38 },
  { name: '富山県', short: '富山', col: 7, row: 5,  clinics: 12, students: 34 },
  { name: '群馬県', short: '群馬', col: 8, row: 5,  clinics: 18, students: 48 },
  { name: '栃木県', short: '栃木', col: 9, row: 5,  clinics: 18, students: 50 },
  { name: '茨城県', short: '茨城', col: 10, row: 5, clinics: 22, students: 60 },
  { name: '鳥取県', short: '鳥取', col: 4, row: 6,  clinics: 8,  students: 22 },
  { name: '島根県', short: '島根', col: 3, row: 6,  clinics: 8,  students: 22 },
  { name: '福井県', short: '福井', col: 6, row: 6,  clinics: 10, students: 28 },
  { name: '岐阜県', short: '岐阜', col: 7, row: 6,  clinics: 18, students: 48 },
  { name: '長野県', short: '長野', col: 8, row: 6,  clinics: 16, students: 44 },
  { name: '埼玉県', short: '埼玉', col: 9, row: 6,  clinics: 55, students: 150 },
  { name: '千葉県', short: '千葉', col: 10, row: 6, clinics: 48, students: 130 },
  { name: '兵庫県', short: '兵庫', col: 4, row: 7,  clinics: 38, students: 104 },
  { name: '京都府', short: '京都', col: 5, row: 7,  clinics: 30, students: 84 },
  { name: '滋賀県', short: '滋賀', col: 6, row: 7,  clinics: 14, students: 36 },
  { name: '愛知県', short: '愛知', col: 7, row: 7,  clinics: 59, students: 164 },
  { name: '山梨県', short: '山梨', col: 8, row: 7,  clinics: 10, students: 28 },
  { name: '東京都', short: '東京', col: 9, row: 7,  clinics: 89, students: 240 },
  { name: '岡山県', short: '岡山', col: 4, row: 8,  clinics: 22, students: 58 },
  { name: '大阪府', short: '大阪', col: 5, row: 8,  clinics: 71, students: 196 },
  { name: '奈良県', short: '奈良', col: 6, row: 8,  clinics: 14, students: 38 },
  { name: '三重県', short: '三重', col: 7, row: 8,  clinics: 14, students: 38 },
  { name: '静岡県', short: '静岡', col: 8, row: 8,  clinics: 28, students: 76 },
  { name: '神奈川県', short: '神奈', col: 9, row: 8, clinics: 63, students: 176 },
  { name: '広島県', short: '広島', col: 3, row: 8,  clinics: 28, students: 76 },
  { name: '山口県', short: '山口', col: 2, row: 8,  clinics: 14, students: 38 },
  { name: '和歌山県', short: '和歌', col: 5, row: 9, clinics: 10, students: 28 },
  { name: '香川県', short: '香川', col: 4, row: 9,  clinics: 12, students: 34 },
  { name: '徳島県', short: '徳島', col: 5, row: 10, clinics: 10, students: 28 },
  { name: '愛媛県', short: '愛媛', col: 3, row: 10, clinics: 16, students: 44 },
  { name: '高知県', short: '高知', col: 4, row: 10, clinics: 10, students: 26 },
  { name: '佐賀県', short: '佐賀', col: 0, row: 10, clinics: 10, students: 28 },
  { name: '福岡県', short: '福岡', col: 1, row: 10, clinics: 55, students: 156 },
  { name: '大分県', short: '大分', col: 2, row: 10, clinics: 14, students: 38 },
  { name: '長崎県', short: '長崎', col: 0, row: 11, clinics: 14, students: 40 },
  { name: '熊本県', short: '熊本', col: 1, row: 11, clinics: 20, students: 56 },
  { name: '宮崎県', short: '宮崎', col: 2, row: 11, clinics: 12, students: 34 },
  { name: '鹿児島県', short: '鹿児', col: 1, row: 12, clinics: 16, students: 44 },
  { name: '沖縄県', short: '沖縄', col: 0, row: 13, clinics: 18, students: 50 },
];

const COLS = 11;
const ROWS = 14;
const CELL = 34;
const GAP = 2;

function clinicColor(v) {
  if (v >= 60) return { bg: '#0f766e', text: '#fff' };
  if (v >= 35) return { bg: '#14b8a6', text: '#fff' };
  if (v >= 20) return { bg: '#5eead4', text: '#0f5f5a' };
  if (v >= 10) return { bg: '#99f6e4', text: '#0f5f5a' };
  return       { bg: '#f0fdfa', text: '#0f766e' };
}

function studentColor(v) {
  if (v >= 150) return { bg: '#6d28d9', text: '#fff' };
  if (v >= 90)  return { bg: '#8b5cf6', text: '#fff' };
  if (v >= 50)  return { bg: '#c4b5fd', text: '#4c1d95' };
  if (v >= 25)  return { bg: '#ddd6fe', text: '#4c1d95' };
  return        { bg: '#f5f3ff', text: '#6d28d9' };
}

const CLINIC_LEGEND = [
  { bg: '#f0fdfa', label: '1–9' },
  { bg: '#99f6e4', label: '10–19' },
  { bg: '#5eead4', label: '20–34' },
  { bg: '#14b8a6', label: '35–59' },
  { bg: '#0f766e', label: '60+' },
];
const STUDENT_LEGEND = [
  { bg: '#f5f3ff', label: '1–24' },
  { bg: '#ddd6fe', label: '25–49' },
  { bg: '#c4b5fd', label: '50–89' },
  { bg: '#8b5cf6', label: '90–149' },
  { bg: '#6d28d9', label: '150+' },
];

const totalClinics  = PREF_DATA.reduce((s, p) => s + p.clinics, 0);
const totalStudents = PREF_DATA.reduce((s, p) => s + p.students, 0);

export default function DashboardPage() {
  const [view, setView] = useState('clinics');
  const [selected, setSelected] = useState(null);

  const mapW = COLS * CELL + (COLS - 1) * GAP;

  const legend = view === 'clinics' ? CLINIC_LEGEND : STUDENT_LEGEND;

  return (
    <div className="flex flex-col min-h-svh max-w-md mx-auto bg-gray-50">
      <Header title="全国ダッシュボード" showBack backTarget="/" />

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">

        {/* サマリーカード */}
        <div className="grid grid-cols-3 gap-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl p-3 text-center shadow-sm"
          >
            <div className="text-2xl font-black text-teal-600">{totalClinics.toLocaleString()}</div>
            <div className="text-[11px] text-teal-500 font-semibold mt-0.5">登録医院</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-3 text-center shadow-sm"
          >
            <div className="text-2xl font-black text-violet-600">{totalStudents.toLocaleString()}</div>
            <div className="text-[11px] text-violet-500 font-semibold mt-0.5">学生登録</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-3 text-center shadow-sm"
          >
            <div className="text-2xl font-black text-gray-700">47</div>
            <div className="text-[11px] text-gray-400 font-semibold mt-0.5">都道府県</div>
          </motion.div>
        </div>

        {/* 表示切替トグル */}
        <div className="flex bg-white rounded-2xl p-1 shadow-sm">
          <button
            onClick={() => { setView('clinics'); setSelected(null); }}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              view === 'clinics'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            🏥 登録医院数
          </button>
          <button
            onClick={() => { setView('students'); setSelected(null); }}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              view === 'students'
                ? 'bg-violet-500 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            🎓 学生希望数
          </button>
        </div>

        {/* タイルマップ */}
        <div className="bg-white rounded-2xl shadow-sm p-3">
          <p className="text-[11px] text-gray-400 mb-2 font-medium">
            タイルをタップで詳細表示 ▼
          </p>
          <div className="overflow-x-auto">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
                gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
                gap: `${GAP}px`,
                width: mapW,
              }}
            >
              {PREF_DATA.map((pref) => {
                const val = view === 'clinics' ? pref.clinics : pref.students;
                const c = view === 'clinics' ? clinicColor(pref.clinics) : studentColor(pref.students);
                const isSelected = selected?.name === pref.name;
                return (
                  <button
                    key={pref.name}
                    onClick={() => setSelected(isSelected ? null : pref)}
                    style={{
                      gridColumnStart: pref.col + 1,
                      gridRowStart: pref.row + 1,
                      backgroundColor: c.bg,
                      color: c.text,
                      width: CELL,
                      height: CELL,
                      outline: isSelected ? '2px solid #f59e0b' : 'none',
                      outlineOffset: '-2px',
                    }}
                    className="rounded flex flex-col items-center justify-center leading-none transition-transform active:scale-95"
                  >
                    <span style={{ fontSize: '7px', fontWeight: 700, lineHeight: 1.1 }}>
                      {pref.short}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 900, lineHeight: 1.2 }}>
                      {val}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 選択した都道府県の詳細 */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-sm p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-black text-gray-900">{selected.name}</span>
                <button
                  onClick={() => setSelected(null)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-teal-50 rounded-xl p-3 text-center">
                  <div className="text-3xl font-black text-teal-700">{selected.clinics}</div>
                  <div className="text-xs text-teal-600 font-semibold mt-0.5">登録医院</div>
                </div>
                <div className="bg-violet-50 rounded-xl p-3 text-center">
                  <div className="text-3xl font-black text-violet-700">{selected.students}</div>
                  <div className="text-xs text-violet-600 font-semibold mt-0.5">学生希望</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 凡例 */}
        <div className="bg-white rounded-2xl shadow-sm p-3">
          <p className="text-[11px] text-gray-400 font-medium mb-2">
            {view === 'clinics' ? '医院数（色の濃さ）' : '学生数（色の濃さ）'}
          </p>
          <div className="flex items-center gap-1">
            {legend.map(({ bg, label }) => (
              <div key={label} className="flex flex-col items-center gap-0.5 flex-1">
                <div
                  className="w-full h-5 rounded"
                  style={{ backgroundColor: bg, border: '1px solid #e5e7eb' }}
                />
                <span className="text-[9px] text-gray-400 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
