import { GlobalState } from "@store/types";
import { useSelector } from "react-redux";

const useClient = (): string | null => {
  return useSelector((state: GlobalState) => state.account.clientId);
};

export { useClient };
