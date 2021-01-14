import React, {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
} from "react";
import styles from "./typewriter.module.scss";

const wait = (time: number): Promise<void> => {
  return new Promise<void>((e) => {
    setTimeout(e, time);
  });
};

const updateText = (
  initialIndex: number,
  children: ReactNode,
  ref: RefObject<HTMLParagraphElement>,
  characterDisplayInterval: number,
  ended?: () => unknown
) => {
  return async () => {
    let index = initialIndex;
    index += 1;
    if (children?.toString()[index] && ref.current) {
      try {
        ref.current.innerHTML += children.toString()[index];
        await wait(characterDisplayInterval);
        ref.current.setAttribute(
          "animation-frame",
          `${requestAnimationFrame(
            updateText(index, children, ref, characterDisplayInterval, ended)
          )}`
        );
        return;
      } catch (_) {
        /* Ignore animation errors */
      }
    }
    if (!children?.toString()[index] && ended) ended();
  };
};

const TypeWriter = ({
  children,
  characterDisplayInterval,
  ended,
}: PropsWithChildren<{
  characterDisplayInterval: number;
  ended?: () => unknown;
}>): ReactElement => {
  // eslint-disable-next-line
  const ref: RefObject<HTMLParagraphElement> = useRef<any>();
  useEffect(() => {
    if (ref.current) {
      const currentId = ref.current.getAttribute("animation-frame");
      if (currentId) {
        cancelAnimationFrame(parseInt(currentId, 10));
      }
      ref.current.innerHTML = "";
      ref.current.setAttribute(
        "animation-frame",
        `${requestAnimationFrame(
          updateText(-1, children, ref, characterDisplayInterval, ended)
        )}`
      );
    }
  }, [characterDisplayInterval, children, ended]);

  return <p ref={ref} className={styles.typeWriter} />;
};

export { TypeWriter };
