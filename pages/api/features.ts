import { NextApiRequest, NextApiResponse } from 'next'

/*
 * Get the list of enabled features.
 */
export default (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;
};