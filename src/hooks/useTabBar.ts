import { useState, useCallback } from "react";

interface TabBarHook {
  open: boolean;
  manageTabBar: () => void;
}

const useTabBar = (): TabBarHook => {
  const [open, setOpen] = useState<boolean>(false);

  const manageTabBar = useCallback((): void => {
    if (window.matchMedia("(max-width: 1000px)").matches) {
      setOpen(!open);
    }
  }, [open]);

  return { open, manageTabBar };
};

export default useTabBar;
