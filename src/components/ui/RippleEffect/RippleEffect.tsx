import React from "react";
import { useNavbar } from "@hooks/Navbar";
import styles from "./RippleEffect.module.scss";

const RippleEffect: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { navbar?: boolean }
> = ({ className, navbar, onClick, ...props }) => {
  const { isMobileNavbar } = useNavbar();
  const ripple = React.useCallback((event: React.MouseEvent): void => {
    const button = event.currentTarget as HTMLDivElement;
    const circle: HTMLSpanElement = document.createElement("span");
    const diameter: number = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = `${diameter}px`;
    circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
    circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
    circle.classList.add(styles.ripple);

    button.appendChild(circle);

    setTimeout(() => {
      if (button) {
        button.removeChild(circle);
      }
    }, 600);
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={`${styles["ripple-root"]}${className ? ` ${className}` : ""}`}
      onClick={(event): void => {
        if (onClick) {
          onClick(event);
        }
        if (navbar && isMobileNavbar()) {
          ripple(event);
        }
      }}
      {...props}
    />
  );
};

export default RippleEffect;
