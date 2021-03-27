import { QueryObserverResult, useQuery } from "react-query";
import { DisplayAPIClient } from "../../constants";
import { StaffMember } from "../../api/gen";

const useMembers = (): QueryObserverResult<StaffMember[], Error> => {
  return useQuery("membersCache", () => DisplayAPIClient.dataStaffGet());
};

export default useMembers;
