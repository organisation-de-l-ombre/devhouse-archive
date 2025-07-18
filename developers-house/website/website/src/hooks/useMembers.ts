import { QueryObserverResult, useQuery } from "react-query";
import { StaffMember } from "@developers-house/abdera";
import { usePreload } from "@components/PreloadContext/PreloadContext";
import { DisplayAPIClient } from "../constants";

const useMembers = (): QueryObserverResult<StaffMember[], Error> => {
  usePreload((client) => ({
    promise: client.prefetchQuery("developers-house/members", () =>
      DisplayAPIClient.dataStaffGet()
    ),
    cache: true,
    queryKey: "developers-house/members",
  }));
  return useQuery("developers-house/members", () =>
    DisplayAPIClient.dataStaffGet()
  );
};

export default useMembers;
