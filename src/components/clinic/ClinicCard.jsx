import VideoPlayer from "./VideoPlayer";

const MAJOR_STYLE = {
  歯学科: "bg-blue-100 text-blue-700 border-blue-300",
  口腔衛生科: "bg-rose-100 text-rose-700 border-rose-300",
  両方: "bg-teal-100 text-teal-700 border-teal-300",
};

export default function ClinicCard({ clinic }) {
  return (
    <div className="w-full h-full overflow-y-auto">
      {/* 動画エリア — スクロールで上に流れる */}
      <div className="w-full h-64 relative overflow-hidden">
        <VideoPlayer
          videoUrl={clinic.videoUrl}
          bgColor={clinic.bgColor}
          avatarInitial={clinic.avatarInitial}
        />
        {/* 名前オーバーレイ */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-8 pb-3">
          <h2 className="text-white text-xl font-bold leading-tight">{clinic.name}</h2>
          <p className="text-white/80 text-xs mt-0.5">
            {clinic.prefecture} {clinic.area}
          </p>
        </div>
        {/* バッジ群 */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            見学枠 残{clinic.slots}
          </span>
          {clinic.targetMajor && (
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm bg-white/90 ${
                MAJOR_STYLE[clinic.targetMajor] ?? ""
              }`}
            >
              {clinic.targetMajor}
            </span>
          )}
        </div>
        {/* 院長出身バッジ */}
        {clinic.directorBackground && (
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              院長：{clinic.directorBackground}出身
            </span>
          </div>
        )}
      </div>

      {/* 詳細エリア — 動画の下に自然に続く */}
      <div className="bg-white px-4 pt-4 pb-52">

        {/* 基本情報（スタッフ・初任給） */}
        <Section title="基本情報">
          <div className="grid grid-cols-3 gap-2">
            <InfoTile label="歯科医師" value={`${clinic.staffDentists}名`} icon="👨‍⚕️" />
            <InfoTile label="衛生士" value={`${clinic.staffHygienists}名`} icon="💊" />
            <InfoTile label="初任給目安" value={clinic.salary} icon="💴" />
          </div>
        </Section>

        {/* 空き日程 */}
        {clinic.availableDates?.length > 0 && (
          <Section title="直近の見学空き日程">
            <div className="flex flex-wrap gap-2">
              {clinic.availableDates.map((d) => (
                <span
                  key={d}
                  className="flex items-center gap-1 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  📅 {d}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* 院長プロフィール */}
        <Section title="院長プロフィール">
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-sm">
              {clinic.avatarInitial}
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm">{clinic.directorName} 先生</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {clinic.directorUniv}（{clinic.directorBackground}）卒
              </p>
              <p className="text-xs text-gray-400">卒業年：{clinic.directorYear}年</p>
            </div>
          </div>
        </Section>

        {/* 医院の理念 */}
        <Section title="医院の理念">
          <div className="relative bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl px-5 py-5 border border-teal-100">
            <span className="absolute top-3 left-4 text-4xl text-teal-200 font-serif leading-none select-none">
              "
            </span>
            <p className="text-teal-900 text-base font-bold leading-relaxed pt-4 pb-1">
              {clinic.tagline.replace(/「|」/g, "")}
            </p>
            <span className="absolute bottom-2 right-4 text-4xl text-teal-200 font-serif leading-none select-none rotate-180 inline-block">
              "
            </span>
          </div>
        </Section>

        {/* 院長からのメッセージ */}
        <Section title="院長からのメッセージ">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {clinic.avatarInitial}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm leading-tight">{clinic.directorName} 院長</p>
                <p className="text-xs text-gray-400">{clinic.directorUniv}</p>
              </div>
            </div>
            <div className="px-4 py-4">
              <p className="text-gray-700 text-sm leading-loose whitespace-pre-line">
                {clinic.philosophy}
              </p>
            </div>
          </div>
        </Section>

        {/* 学べる技術 */}
        <Section title="学べる技術">
          <div className="flex flex-wrap gap-1.5">
            {clinic.skills.map((s) => (
              <Tag key={s} color="blue">{s}</Tag>
            ))}
          </div>
        </Section>

        {/* 特徴タグ */}
        {clinic.features?.length > 0 && (
          <Section title="医院の特徴">
            <div className="flex flex-wrap gap-1.5">
              {clinic.features.map((f) => (
                <Tag key={f} color="amber">{f}</Tag>
              ))}
            </div>
          </Section>
        )}

        {/* 対象学年 */}
        <Section title="見学を歓迎する学年">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((grade) => (
              <div
                key={grade}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  clinic.targetGrades.includes(grade)
                    ? "bg-teal-500 border-teal-500 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-300"
                }`}
              >
                {grade}年
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoTile({ label, value, icon }) {
  return (
    <div className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
      <p className="text-lg mb-0.5">{icon}</p>
      <p className="text-gray-800 text-xs font-bold leading-tight">{value}</p>
      <p className="text-gray-400 text-xs mt-0.5">{label}</p>
    </div>
  );
}

function Tag({ children, color }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
  };
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${styles[color] ?? styles.blue}`}
    >
      {children}
    </span>
  );
}
