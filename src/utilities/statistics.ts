import { ServerResponse } from "./types/Response";
import axios from "axios";
import { returnOrThrow } from "./utils";
import { ServicesStatistics, StatusPageStatus } from "./types/Statistics";

const fetchStats = async (): Promise<ServerResponse<ServicesStatistics>> => {
  const { data } = await axios.get<ServerResponse<ServicesStatistics>>(
    "/api/v2/stats"
  );
  return returnOrThrow(data);
};

const fetchStatus = async (): Promise<StatusPageStatus> => {
  const { data, status } = await axios.get<StatusPageStatus>(
    "https://y1fy407df5vm.statuspage.io/api/v2/status.json"
  );

  if (status === 200) {
    return data;
  }
  throw new Error("Failed to fetch the status from the status page.");
};

export { fetchStats, fetchStatus };
