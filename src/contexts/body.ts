import { createContext, Dispatch, SetStateAction } from "react";

interface BodyContextType {
  scroll: boolean;
  setScroll: Dispatch<SetStateAction<boolean>>;
}

const BodyContext = createContext<BodyContextType>({
  scroll: true,
  setScroll: () => {},
});

export default BodyContext;
