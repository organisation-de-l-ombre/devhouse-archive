import React from "react";
import styles from "./Button.module.scss";

const event = (
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  const button = event.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
  circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
  circle.classList.add(styles.ripple);

  const ripple = button.getElementsByClassName(styles.ripple)[0];

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);

  if (onClick) {
    onClick(event);
  }
};

export const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = (props) => {
  return (
    <button
      {...props}
      className={styles.button}
      onClick={event(props.onClick)}
    />
  );
};
export * from "./ButtonContainer";
