import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function usePath() {
  const { pathname } = useLocation();
  return pathname;
}
export function useStartsWith(...paths: string[]) {
  const { pathname } = useLocation();
  const [value, setValue] = useState(false);
  useEffect(() => {
    setValue(
      paths.reduce<boolean>((val, c) => val && pathname.startsWith(c), true)
    );
  }, [pathname, paths]);
  return value;
}
