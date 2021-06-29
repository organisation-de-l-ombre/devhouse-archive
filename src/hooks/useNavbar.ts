import { useState, useCallback } from "react";

interface NavbarHook {
  open: boolean;
  isMobileNavbar: () => boolean;
  manageNavbar: () => void;
}

const useNavbar = (): NavbarHook => {
  const [open, setOpen] = useState<boolean>(false);

  const isMobileNavbar = useCallback((): boolean => {
    return window.matchMedia("(max-width: 900px)").matches;
  }, []);

  const manageNavbar = useCallback((): void => {
    if (isMobileNavbar()) {
      setOpen(!open);
    }
  }, [isMobileNavbar, open]);

  return { open, isMobileNavbar, manageNavbar };
};

export default useNavbar;
