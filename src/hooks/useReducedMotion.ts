import { useEffect, useState } from "react";

const useReducedMotion = (): boolean => {
  const [matches, setMatches] = useState<boolean>(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect((): (() => void) => {
    const matchQuery: MediaQueryList = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const handleChange = (): void => {
      setMatches(matchQuery.matches);
    };

    handleChange();

    matchQuery.addEventListener("change", handleChange);

    return () => {
      matchQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return matches;
};

export default useReducedMotion;
