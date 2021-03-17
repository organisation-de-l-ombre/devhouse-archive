import React from "react";

const useTabBar = (): { open: boolean; manageTabBar: () => void } => {
  const [open, setOpen] = React.useState<boolean>(false);
  const manageTabBar = () => {
    if (window.matchMedia("(max-width: 1000px)").matches) {
      setOpen(!open);
    }
  };

  return { open, manageTabBar };
};

export default useTabBar;
