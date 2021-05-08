import React from "react";
import styles from "./Button.module.scss";

const onButtonClick = (
  onClick: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>
  ) => void
) => (
  event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>
) => {
  const button = event.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = `${diameter}px`;
  circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
  circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
  circle.classList.add(styles.ripple);

  const ripple = button.getElementsByClassName(styles.ripple)[0];

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);

  onClick(event);
};

const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ onClick, ...props }) => {
  return (
    <button
      {...props}
      type="button"
      className={styles.button}
      onClick={onButtonClick(onClick)}
    />
  );
};

const ButtonLink: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
> = ({ onClick, children, ...props }) => {
  return (
    // eslint-disable-next-line
    <a {...props} className={styles.button} onClick={onButtonClick(onClick)}>
      {children}
    </a>
  );
};

export { Button, ButtonLink };
export * from "./ButtonContainer";
