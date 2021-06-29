import { InternalState } from "@store/internal/types";
import { GlobalState } from "@store/types";
import { useSelector } from "react-redux";

interface ClientHook {
  clientID: string;
}

const useClient = (): ClientHook => {
  const { clientID } = useSelector(
    (state: GlobalState): InternalState => state.internal
  );

  return { clientID };
};

export { useClient };
