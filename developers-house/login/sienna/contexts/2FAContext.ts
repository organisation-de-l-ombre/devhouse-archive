import { createContext, Dispatch, SetStateAction } from "react";
import { TwoFASessionReponse } from "../lib/api/2fa";

interface TwoFAContextData {
  session: TwoFASessionReponse;
}
interface TwoFAContextObject {
  data: TwoFAContextData;
  setTwoFaData?: Dispatch<SetStateAction<TwoFAContextData>>;
}

const TwoFAContext = createContext<TwoFAContextObject>({
  data: null,
  setTwoFaData: undefined,
});

export { TwoFAContext };
export type { TwoFAContextData, TwoFAContextObject };
