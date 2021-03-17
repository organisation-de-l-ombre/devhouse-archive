import React from "react";
import { AiOutlineLink } from "react-icons/ai";
import styles from "./TabBar.module.scss";
import Button from "../../ui/Button/Button";

const TabBar: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { open: boolean; manageTabBar: () => void }
> = ({ className, children, open, manageTabBar }) => {
  const [scroll, setScroll] = React.useState<boolean>(false);
  const scrollSpy = (): void => {
    if ((window.scrollY > 525 && !scroll) || (window.scrollY < 525 && scroll)) {
      setScroll(!scroll);
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", scrollSpy);

    return () => window.removeEventListener("scroll", scrollSpy);
  });

  return (
    <div
      className={`${styles["navigation-container"]}${
        className ? ` ${className}` : ""
      }${scroll ? ` ${styles.fixed}` : ""}`}
    >
      <Button onClick={manageTabBar}>
        <AiOutlineLink />
        <span>Accéder à la navigation</span>
      </Button>
      <div
        className={`${styles["navigation-items"]}${
          open ? ` ${styles.open}` : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default TabBar;
