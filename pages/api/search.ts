import type { Applicant } from './lib/applicant'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB } from './lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Applicant[] | { message: string }>
) {
  const db = await getDB();

  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Name is required' });
      return;
    }
    const response = await db.all<Applicant[]>(
      "SELECT * FROM applicant WHERE name LIKE ?",
      [`%${name}%`]
    );
    res.status(200).json(response);
  } else {
    const response = await db.all<Applicant[]>("select * from applicant");
    res.status(200).json(response);
  }

  db.close();
}
