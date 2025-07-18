import { useState, useCallback } from "react";

interface SidebarHook {
  open: boolean;
  manageSidebar: () => void;
}

const useSidebar = (): SidebarHook => {
  const [open, setOpen] = useState<boolean>(false);

  const manageSidebar = useCallback((): void => {
    if (window.matchMedia("(max-width: 1100px)").matches) {
      setOpen(!open);
    }
  }, [open]);

  return { open, manageSidebar };
};

export default useSidebar;
