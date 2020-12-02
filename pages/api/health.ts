import { NextApiRequest, NextApiResponse } from "next";

/*
 * Just checks if the service is alive.
 */
export default (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;
  res.end();
};
