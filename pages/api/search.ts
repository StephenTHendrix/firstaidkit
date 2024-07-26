import type { Applicant } from './lib/applicant';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDB } from './lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Applicant[] | { message: string }>
) {
  const db = await getDB();

  if (req.method === 'POST') {
    const { name, sortColumn, sortOrder, filter } = req.body;
    let query = "SELECT * FROM applicant WHERE 1=1";
    const params: (string | number)[] = [];

    if (name) {
      query += " AND name LIKE ?";
      params.push(`%${name}%`);
    }

    if (filter) {
      query += " AND screener = ?";
      params.push(filter);
    }

    if (sortColumn && sortOrder) {
      query += ` ORDER BY ${sortColumn} ${sortOrder.toUpperCase()}`;
    }

    try {
      const response = await db.all<Applicant[]>(query, params);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: 'Database query failed' });
    }
  } else {
    try {
      const response = await db.all<Applicant[]>("SELECT * FROM applicant");
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: 'Database query failed' });
    }
  }

  db.close();
}
