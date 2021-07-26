import { GlobalState } from "@store/types";
import { useSelector } from "react-redux";

interface ClientHook {
  clientId?: string;
}

const useClient = (): ClientHook => {
  const clientId = useSelector(
    (state: GlobalState): string | undefined => state.account.clientId
  );

  return { clientId };
};

export { useClient };
