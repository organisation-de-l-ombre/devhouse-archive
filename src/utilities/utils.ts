import { ServerResponse } from "./types/Response";

/**
 * @param response
 */
function returnOrThrow<T>(response: ServerResponse<T>): ServerResponse<T> {
  if (response.code === 200) {
    return response;
  }
  throw new Error(`Failed to load the members ${response.message}`);
}

export { returnOrThrow };
