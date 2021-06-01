import React, {
  DetailedHTMLProps,
  PropsWithChildren,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactLoaders from "react-loaders";
import styles from "./loader.module.scss";

const messages = [
  "Cooking some cookies 🍪",
  "Ouhh the website ~",
  "This seems slow...",
];

export const Loader: React.FC<
  DetailedHTMLProps<Record<string, never>, HTMLDivElement>
> = () => {
  const [msg, setMsg] = useState<string>();
  const changeMessage = useCallback(() => {
    setMsg(messages[Math.floor(Math.random() * messages.length)]);
  }, []);
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timeout.current = setInterval(changeMessage, 5000);
    return () => {
      if (timeout.current) {
        clearInterval(timeout.current);
      }
    };
  }, [changeMessage]);

  return (
    <div className={styles.loader}>
      <div className={styles.centered}>
        <ReactLoaders innerClassName={styles.color} type="line-scale" active />
        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
};

export default function SuspenseLoader({
  children,
}: PropsWithChildren<unknown>): React.ReactElement {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}
