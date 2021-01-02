/*
 * The API for the projects.
 */

import axios from "axios";
import { ServerResponse } from "./types/Response";
import { returnOrThrow } from "./utils";
import { Projects } from "./types/Projects";

const fetchProjects = async (): Promise<ServerResponse<Projects>> => {
  const { data } = await axios.get("/api/v2/projects");
  return returnOrThrow(data);
};

/*
 * Used to fetch the description from a gist or something.
 */
const fetchProjectDescription = async (
  fetchLocation: string
): Promise<string> => {
  /*
   * Only from gist or discord. No insecure shady website.
   */
  if (!/https:\/\/(gist.github.com|cdn.discordapp.com).*/.test(fetchLocation)) {
    throw new Error(
      "Cannot fetch the requested source. This one is not allowed!"
    );
  }

  const { data, status } = await axios.get<string>(fetchLocation);

  if (status !== 200) {
    throw new Error("Failed to load the description.");
  }
  return data;
};

export { fetchProjectDescription, fetchProjects };
