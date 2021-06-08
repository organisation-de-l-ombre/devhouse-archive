import { QueryObserverResult, useQuery } from "react-query";
import { StaffMember } from "@developers-house/abdera";
import { DisplayAPIClient } from "../constants";

const useMembers = (): QueryObserverResult<StaffMember[], Error> => {
  return useQuery("developers-house/members", () =>
    DisplayAPIClient.dataStaffGet()
  );
};

export default useMembers;
