import getApplicationID from "@lib/getApplicationID";
import { updateClient } from "@store/internal/actions";
import { InternalState } from "@store/internal/types";
import { GlobalState } from "@store/Types";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ClientHook {
  clientID: string;
  setClientID: () => Promise<void>;
}

const useClient = (): ClientHook => {
  const { clientID } = useSelector(
    (state: GlobalState): InternalState => state.internal
  );
  const dispatch = useDispatch();

  const setClientID = useCallback(async (): Promise<void> => {
    dispatch(updateClient(await getApplicationID()));
  }, [dispatch]);

  return { clientID, setClientID };
};

export { useClient };
