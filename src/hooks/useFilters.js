import { useState, useMemo } from "react";

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

function toggleSingle(current, val) {
  return current === val ? null : val;
}

// ===== 学生モード：医院絞り込み =====
export function useClinicFilters(baseClinics) {
  const [targetMajor, setTargetMajor] = useState(null);
  const [features, setFeatures] = useState([]);
  const [directorBackground, setDirectorBackground] = useState(null);

  function toggleTargetMajor(v) { setTargetMajor((p) => toggleSingle(p, v)); }
  function toggleFeature(v) { setFeatures((p) => toggle(p, v)); }
  function toggleDirectorBackground(v) { setDirectorBackground((p) => toggleSingle(p, v)); }

  function reset() {
    setTargetMajor(null);
    setFeatures([]);
    setDirectorBackground(null);
  }

  const activeCount =
    (targetMajor ? 1 : 0) + features.length + (directorBackground ? 1 : 0);

  const filterKey = JSON.stringify({ targetMajor, features, directorBackground });

  const filtered = useMemo(() => {
    return baseClinics.filter((c) => {
      if (targetMajor && c.targetMajor !== "両方" && c.targetMajor !== targetMajor)
        return false;
      if (
        features.length > 0 &&
        !features.some(
          (f) => c.features?.includes(f) || c.skills?.includes(f)
        )
      )
        return false;
      if (directorBackground && c.directorBackground !== directorBackground)
        return false;
      return true;
    });
  }, [baseClinics, targetMajor, features, directorBackground]);

  return {
    filtered,
    filterKey,
    activeCount,
    state: { targetMajor, features, directorBackground },
    toggleTargetMajor,
    toggleFeature,
    toggleDirectorBackground,
    reset,
  };
}

// ===== 医院モード：学生絞り込み =====
export function useStudentFilters(baseStudents) {
  const [universityType, setUniversityType] = useState(null);
  const [interests, setInterests] = useState([]);
  const [desiredAreas, setDesiredAreas] = useState([]);

  function toggleUniversityType(v) { setUniversityType((p) => toggleSingle(p, v)); }
  function toggleInterest(v) { setInterests((p) => toggle(p, v)); }
  function toggleDesiredArea(v) { setDesiredAreas((p) => toggle(p, v)); }

  function reset() {
    setUniversityType(null);
    setInterests([]);
    setDesiredAreas([]);
  }

  const activeCount =
    (universityType ? 1 : 0) + interests.length + desiredAreas.length;

  const filterKey = JSON.stringify({ universityType, interests, desiredAreas });

  const filtered = useMemo(() => {
    return baseStudents.filter((s) => {
      if (universityType && s.universityType !== universityType) return false;
      if (interests.length > 0 && !interests.some((i) => s.interests?.includes(i)))
        return false;
      if (desiredAreas.length > 0 && !desiredAreas.some((a) => s.desiredAreas?.includes(a)))
        return false;
      return true;
    });
  }, [baseStudents, universityType, interests, desiredAreas]);

  return {
    filtered,
    filterKey,
    activeCount,
    state: { universityType, interests, desiredAreas },
    toggleUniversityType,
    toggleInterest,
    toggleDesiredArea,
    reset,
  };
}
