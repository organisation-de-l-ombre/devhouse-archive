import React from "react";
import { NavbarManagement } from "./Types";

const useNavbar = (): NavbarManagement => {
  const [open, setOpen] = React.useState<boolean>(false);
  const manageNavbar = React.useCallback((): void => {
    if (window.matchMedia("(max-width: 800px)").matches) {
      setOpen(!open);
    }
  }, [open]);

  return { open, manageNavbar };
};

export default useNavbar;
