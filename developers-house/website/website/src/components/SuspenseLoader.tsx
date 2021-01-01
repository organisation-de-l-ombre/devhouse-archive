import React, {
  PropsWithChildren,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import ReactLoaders from "react-loaders";
import "loaders.css/src/animations/line-scale.scss";
import "./loader.scss";

const messages = [
  "Cooking some cookies 🍪",
  "Ouhh the website ~",
  "This seems slow..."
];

export const Loader = () => {
  const [message, setMessage] = useState<null | string>(null);
  const changeMessage = useCallback(() => {
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);
  const timeout = useRef<number>();

  useEffect(() => {
    timeout.current = (setInterval(changeMessage, 5000) as unknown) as number;
    return () => {
      clearInterval(timeout.current);
    };
  }, [changeMessage]);

  return (
    <div className={"loader"}>
      <div className={"centered"}>
        <ReactLoaders innerClassName={"color"} type="line-scale" active />
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

/**
 * @param root0
 * @param root0.children
 */
export default function SuspenseLoader({ children }: PropsWithChildren<{}>) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}
