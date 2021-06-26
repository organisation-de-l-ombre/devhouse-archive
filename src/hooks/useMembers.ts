import { QueryObserverResult, useQuery } from "react-query";
import { StaffMember } from "@developers-house/abdera";
import { usePreload } from "@components/PreloadContext/PreloadContext";
import { DisplayAPIClient } from "../constants";

const useMembers = (): QueryObserverResult<StaffMember[], Error> => {
  usePreload((client) =>
    client.prefetchQuery("developers-house/members", () =>
      DisplayAPIClient.dataStaffGet()
    )
  );
  return useQuery("developers-house/members", () =>
    DisplayAPIClient.dataStaffGet()
  );
};

export default useMembers;
