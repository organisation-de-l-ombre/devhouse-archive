import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { MdClose } from "react-icons/md";
import { CSSTransition } from "react-transition-group";
import { FunctionComponent } from "@typings/FunctionComponent";
import classnames from "classnames";
import { SerializedStyles } from "@emotion/react";
import BodyContext from "@contexts/body";
import { useTranslation } from "react-i18next";
import FlexContainer from "../FlexContainer/FlexContainer";
import styles from "./Modal.module.scss";
import "./Animations.scss";

interface ModalProps {
  modalCSS?: SerializedStyles;
  modalClassName?: string;
  containerCSS?: SerializedStyles;
  containerClassName?: string;
  windowsIcon?: ReactNode;
  windowTitle: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  closeOnEchap?: boolean;
}

const Modal: FunctionComponent<HTMLDivElement, ModalProps> = ({
  children,
  modalCSS,
  modalClassName,
  containerCSS,
  containerClassName,
  windowsIcon,
  windowTitle,
  open,
  setOpen,
  closeOnEchap = true,
}) => {
  const { t } = useTranslation("root");
  const { setScroll } = useContext(BodyContext);
  const onPressEchap = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    },
    [setOpen]
  );

  useEffect(() => {
    setScroll(!open);
  }, [open, setScroll]);

  useEffect((): (() => void) => {
    if (closeOnEchap) {
      window.addEventListener("keydown", onPressEchap);
    }

    return (): void => {
      if (closeOnEchap) {
        window.removeEventListener("keydown", onPressEchap);
      }
    };
  }, [closeOnEchap, onPressEchap]);

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
            <MdClose
              onClick={() => setOpen(!open)}
              aria-label="Close"
              title={t("global.close")}
            />
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
