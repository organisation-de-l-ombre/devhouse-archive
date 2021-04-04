import React from "react";
import styles from "./button.module.scss";

export type SimplifiedHTMLProperties<T> = React.DetailedHTMLProps<
  React.HTMLAttributes<T>,
  T
> & { variant?: string };

const rippleEvent = (event: React.MouseEvent): boolean => {
  const button: HTMLDivElement = event.currentTarget as HTMLDivElement;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  // eslint-disable-next-line no-multi-assign
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
  circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
  circle.classList.add(styles.ripple);

  button.appendChild(circle);

  setTimeout(() => {
    button.removeChild(circle);
  }, 600);

  return true;
};

const Ripple: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
> = ({ className, onClick, ...props }) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={[className, styles.relative].join(" ")}
      onClick={(e) => rippleEvent(e) && onClick && onClick(e)}
      {...props}
    />
  );
};
const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    large?: boolean;
    margin?: boolean;
  }
> = ({ className, margin, large, onClick, ...props }) => (
  <button
    className={[
      className,
      styles.relative,
      styles.button,
      large && styles.large,
      margin && styles.margin,
    ].join(" ")}
    onClick={(e) => rippleEvent(e) && onClick && onClick(e)}
    type="button"
    {...props}
  />
);

const ButtonImage: React.FC<SimplifiedHTMLProperties<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={[className, styles.image].join(" ")} {...props} />;

export default Button;
export { Button, ButtonImage, Ripple };
