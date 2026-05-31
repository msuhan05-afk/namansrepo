"use client";

import { useEffect, useMemo, useState } from "react";

export function useXp() {
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.min(100, Math.round(ratio * 100)));
      setUnlocked(Math.min(8, Math.floor(ratio * 9)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return useMemo(() => {
    const xp = progress * 18;
    const level = Math.max(1, Math.floor(xp / 300) + 1);
    return { progress, xp, level, unlocked };
  }, [progress, unlocked]);
}
