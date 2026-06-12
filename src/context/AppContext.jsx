import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

const DEFAULT_STUDENT = {
  lastName: "田中", firstName: "花子",
  university: "九州歯科大学", year: "3", major: "歯学科",
  prefectureOrigin: "福岡県",
  interests: ["小児歯科", "予防歯科"],
  desiredAreas: ["福岡県"],
  message: "将来は地域の子どもたちの口腔健康を守る歯科医師を目指しています。",
};

const DEFAULT_CLINIC = {
  name: "たなか歯科クリニック",
  prefecture: "東京都", area: "渋谷区",
  directorName: "田中 誠一",
  directorUniv: "東京医科歯科大学",
  directorBackground: "国公立", directorYear: "2005",
  tagline: "患者さんと一緒に、一生口腔ケアを続ける",
  philosophy: "予防を中心に、患者さんが笑顔で通い続けられる医院づくりを目指しています。",
  skills: ["インビザライン", "インプラント", "小児歯科"],
  features: ["優しく教える", "最新機器", "予防歯科"],
  targetMajor: "両方", targetGrades: [3, 4, 5, 6],
  staffDentists: "3", staffHygienists: "5",
  salary: "月給28万円〜", availableDates: [],
};

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AppProvider({ children }) {
  const [mode, setModeRaw] = useState(() => load("dc_mode", "student"));
  const [clinicPlan, setClinicPlanRaw] = useState(() => load("dc_plan", "free"));
  const [studentProfile, setStudentProfile] = useState(() => load("dc_student", DEFAULT_STUDENT));
  const [clinicProfile, setClinicProfile] = useState(() => load("dc_clinic", DEFAULT_CLINIC));
  const [matches, setMatches] = useState(() => load("dc_matches", []));
  const [likeCount, setLikeCount] = useState(() => load("dc_like_count", 0));

  function setMode(m) {
    setModeRaw(m);
    save("dc_mode", m);
  }

  function setClinicPlan(p) {
    const next = typeof p === "function" ? p(clinicPlan) : p;
    setClinicPlanRaw(next);
    save("dc_plan", next);
  }

  function saveStudentProfile(data) {
    setStudentProfile(data);
    save("dc_student", data);
  }

  function saveClinicProfile(data) {
    setClinicProfile(data);
    save("dc_clinic", data);
  }

  function addMatch(partner) {
    const newMatch = {
      id: Date.now() + Math.random(),
      name: partner.name,
      sub: partner.prefecture
        ? `${partner.prefecture}${partner.area ? `・${partner.area}` : ""}`
        : partner.university
          ? `${partner.university}・${partner.year}年`
          : "",
      initial: partner.avatarInitial || partner.initial || partner.name?.[0] || "?",
      gradient: partner.bgColor || "from-teal-400 to-emerald-400",
      lastMsg: "マッチングしました！メッセージを送ってみましょう。",
      time: "たった今",
      unread: 1,
    };
    const updated = [newMatch, ...matches];
    setMatches(updated);
    save("dc_matches", updated);
  }

  function addLike() {
    const next = likeCount + 1;
    setLikeCount(next);
    save("dc_like_count", next);
  }

  return (
    <AppContext.Provider value={{
      mode, setMode,
      clinicPlan, setClinicPlan,
      studentProfile, saveStudentProfile,
      clinicProfile, saveClinicProfile,
      matches, addMatch,
      likeCount, addLike,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
