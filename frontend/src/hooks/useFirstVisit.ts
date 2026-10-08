import { useEffect, useState } from "react";
import { ROOM_CODE_KEY, VISITED_KEY } from "../utils/storageKeys";

// Lit le stockage navigateur après le montage (évite un décalage d'hydratation)
export function useFirstVisit() {
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [hasCheckedVisit, setHasCheckedVisit] = useState(false);

  useEffect(() => {
    const code = sessionStorage.getItem(ROOM_CODE_KEY);
    const visited = localStorage.getItem(VISITED_KEY);
    setTimeout(() => {
      setSavedCode(code);
      setIsFirstVisit(!visited);
      if (!visited) localStorage.setItem(VISITED_KEY, "true");
      setHasCheckedVisit(true);
    }, 0);
  }, []);

  return { savedCode, isFirstVisit, hasCheckedVisit };
}
