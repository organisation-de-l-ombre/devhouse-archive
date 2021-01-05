import React from "react";
import styles from "./button.module.scss";

export type SimplifiedHTMLProperties<T> = React.DetailedHTMLProps<
  React.HTMLAttributes<T>,
  T
> & { variant?: string };

const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & { variant?: string }
> = ({ className, variant, ...props }) => (
  <button
    className={[className, styles.button, styles[`button__${variant}`]].join(
      " "
    )}
    type="button"
    {...props}
  />
);

const ButtonImage: React.FC<SimplifiedHTMLProperties<HTMLImageElement>> = ({
  className,
  ...props
}) => <div className={[className, styles.image].join(" ")} {...props} />;

export default Button;
export { Button, ButtonImage };
