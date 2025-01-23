// pages/api/default.ts
// notify admin of new user and their role, since none assigned yet

import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });
  const { email, role } = req.body;

  // not implemented yet
  return res.status(501).json({ error: 'Not implemented yet' });
};
