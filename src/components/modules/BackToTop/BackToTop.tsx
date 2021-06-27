import React, { useCallback, useEffect, useState } from "react";
import { RiArrowUpSLine } from "react-icons/ri";
import { FunctionComponent } from "@typings/FunctionComponent";
import { css } from "@emotion/react";

const BackToTop: FunctionComponent<HTMLAnchorElement> = ({ href }) => {
  const [show, setShow] = useState<boolean>(false);
  const scrollSpy = useCallback((): void => {
    setShow(window.scrollY > window.innerHeight);
  }, []);

  useEffect((): (() => void) => {
    window.addEventListener("scroll", scrollSpy);

    return (): void => {
      window.removeEventListener("scroll", scrollSpy);
    };
  }, [scrollSpy]);

  return (
    <a
      css={css`
        z-index: 9;
        padding: 1rem;
        width: 20px;
        height: 20px;
        position: fixed;
        right: 1.5rem;
        bottom: 1.5rem;
        transform: translateY(${show ? "0" : "150%"});
        border: 0.2rem solid var(--secondary-background-color);
        border-radius: 50%;
        background-color: var(--primary-background-color);
        transition: transform 300ms, border 0.5s;

        svg {
          transform: scale(1.5);
          transition: fill 0.5s;
          fill: var(--secondary-background-color-hover);
        }

        &:hover {
          border: 0.2rem solid var(--font-color-hover);

          svg {
            fill: var(--font-color-hover);
          }
        }
      `}
      href={href || "#"}
      aria-label="Back to the top of the page"
    >
      <RiArrowUpSLine />
    </a>
  );
};

export default BackToTop;
