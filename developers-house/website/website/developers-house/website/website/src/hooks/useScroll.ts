import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function useScrollPosition(): number {
  const [position, setPosition] = useState(
    typeof window !== "undefined" ? window.scrollY : 0
  );
  const page = useLocation();

  const listener = useCallback(() => {
    setPosition(window.scrollY);
  }, []);

  useEffect(() => {
    listener();
    document.addEventListener("scroll", listener);
    return () => document.removeEventListener("scroll", listener);
  }, [listener, page]);
  return position;
}
