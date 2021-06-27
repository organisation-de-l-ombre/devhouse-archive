/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { MdClose } from "react-icons/md";
import { CSSTransition } from "react-transition-group";
import { FunctionComponent } from "@typings/FunctionComponent";
import classnames from "classnames";
import { SerializedStyles } from "@emotion/react";
import BodyContext from "@contexts/body";
import FlexContainer from "../FlexContainer/FlexContainer";
import styles from "./Modal.module.scss";
import "./Animations.scss";

const Modal: FunctionComponent<
  HTMLDivElement,
  {
    modalCSS?: SerializedStyles;
    modalClassName?: string;
    containerCSS?: SerializedStyles;
    containerClassName?: string;
    windowsIcon?: ReactNode;
    windowTitle: ReactNode;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
  }
> = ({
  children,
  modalCSS,
  modalClassName,
  containerCSS,
  containerClassName,
  windowsIcon,
  windowTitle,
  open,
  setOpen,
}) => {
  const { setScroll } = useContext(BodyContext);

  useEffect(() => {
    setScroll(!open);
  }, [open, setScroll]);

  return (
    <CSSTransition
      in={open}
      timeout={300}
      unmountOnExit
      classNames="modal-transitions"
    >
      <FlexContainer
        fullCentered
        className={styles.background}
        onClick={() => setOpen(!open)}
      >
        <FlexContainer
          column
          css={modalCSS}
          className={classnames(styles.modal, modalClassName)}
          onClick={(event) => event.stopPropagation()}
        >
          <FlexContainer
            verticallyCentered
            spaceBetween
            className={styles.headers}
          >
            <FlexContainer fullCentered>
              {windowsIcon && windowsIcon}
              <h1>{windowTitle}</h1>
            </FlexContainer>
            <MdClose onClick={() => setOpen(!open)} />
          </FlexContainer>
          <FlexContainer
            column
            expand
            css={containerCSS}
            className={containerClassName}
          >
            {children}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </CSSTransition>
  );
};

export default Modal;
