/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import { MdClose } from "react-icons/md";
import { CSSTransition } from "react-transition-group";
import styles from "./Modal.module.scss";
import Button from "../Button/Button";
import FlexContainer from "../FlexContainer/FlexContainer";
import "./Animations.scss";

const Modal: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    containerClassName?: string;
    windowTitle: React.ReactNode;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
> = ({
  children,
  containerClassName,
  windowTitle,
  open,
  setOpen,
  ...props
}) => {
  return (
    <CSSTransition
      in={open}
      timeout={300}
      unmountOnExit
      classNames="modal-transitions"
    >
      <div className={styles.background} onClick={() => setOpen(!open)}>
        <div
          className={styles.modal}
          onClick={(event) => event.stopPropagation()}
          {...props}
        >
          <div className={styles.headers}>
            <h2>{windowTitle}</h2>
            <Button onClick={() => setOpen(!open)}>
              <MdClose />
            </Button>
          </div>
          <FlexContainer
            className={`${styles.container}${
              containerClassName ? ` ${containerClassName}` : ""
            }`}
          >
            {children}
          </FlexContainer>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Modal;
