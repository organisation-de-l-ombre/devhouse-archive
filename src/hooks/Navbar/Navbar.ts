import React from "react";
import { NavbarHook } from "./Types";

const useNavbar = (): NavbarHook => {
  const [open, setOpen] = React.useState<boolean>(false);

  const isMobileNavbar = React.useCallback((): boolean => {
    return window.matchMedia("(max-width: 800px)").matches;
  }, []);
  const manageNavbar = React.useCallback((): void => {
    if (isMobileNavbar()) {
      setOpen(!open);
    }
  }, [isMobileNavbar, open]);

  return { open, isMobileNavbar, manageNavbar };
};

export default useNavbar;
