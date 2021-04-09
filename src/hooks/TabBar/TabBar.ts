import React from "react";
import { TabBarHook } from "./Types";

const useTabBar = (): TabBarHook => {
  const [open, setOpen] = React.useState<boolean>(false);

  const manageTabBar = React.useCallback((): void => {
    if (window.matchMedia("(max-width: 1000px)").matches) {
      setOpen(!open);
    }
  }, [open]);

  return { open, manageTabBar };
};

export default useTabBar;
