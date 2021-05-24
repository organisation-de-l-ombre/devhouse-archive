/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React from "react";
import { MdClose } from "react-icons/md";
import { CSSTransition } from "react-transition-group";
import FlexContainer from "../FlexContainer/FlexContainer";
import styles from "./Modal.module.scss";
import "./Animations.scss";

const Modal: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    containerClassName?: string;
    modalClassName?: string;
    windowTitle: React.ReactNode;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
> = ({
  children,
  containerClassName,
  modalClassName,
  windowTitle,
  open,
  setOpen,
  ...props
}) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "visible";
    }
  }, [open]);

  return (
    <CSSTransition
      in={open}
      timeout={300}
      unmountOnExit
      classNames="modal-transitions"
    >
      <div className={styles.background} onClick={() => setOpen(!open)}>
        <div
          className={`${styles.modal}${
            modalClassName ? ` ${modalClassName}` : ""
          }`}
          onClick={(event) => event.stopPropagation()}
          {...props}
        >
          <div className={styles.headers}>
            <h2>{windowTitle}</h2>
            <MdClose onClick={() => setOpen(!open)} />
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
