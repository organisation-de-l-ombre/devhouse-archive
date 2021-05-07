import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function useScrollPosition() {
  const [position, setPosition] = useState(window.scrollY);
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
