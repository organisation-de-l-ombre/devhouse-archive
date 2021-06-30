import { createContext, Dispatch, SetStateAction } from "react";

interface BodyContextProps {
  scroll: boolean;
  setScroll: Dispatch<SetStateAction<boolean>>;
}

const BodyContext = createContext<BodyContextProps>({
  scroll: true,
  setScroll: () => {},
});

export default BodyContext;
