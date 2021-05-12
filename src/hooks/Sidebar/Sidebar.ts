import React from "react";
import { SidebarHook } from "@hooks/Sidebar/Types";

const useSidebar = (): SidebarHook => {
  const [open, setOpen] = React.useState<boolean>(false);
  const manageSidebar = React.useCallback((): void => {
    if (window.matchMedia("(max-width: 1100px)").matches) {
      setOpen(!open);
    }
  }, [open]);

  return { open, manageSidebar };
};

export default useSidebar;
