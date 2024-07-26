import type { Applicant } from './lib/applicant';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDB } from './lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ applicants: Applicant[], total: number } | { message: string }>
) {
  const db = await getDB();

  const { name, sortColumn, sortOrder, filter, page = 1, pageSize = 10 } = req.body;
  let query = "SELECT * FROM applicant WHERE 1=1";
  let countQuery = "SELECT COUNT(*) as count FROM applicant WHERE 1=1";
  const params: (string | number)[] = [];
  const countParams: (string | number)[] = [];

  if (name) {
    query += " AND name LIKE ?";
    countQuery += " AND name LIKE ?";
    params.push(`%${name}%`);
    countParams.push(`%${name}%`);
  }

  if (filter) {
    query += " AND screener = ?";
    countQuery += " AND screener = ?";
    params.push(filter);
    countParams.push(filter);
  }

  if (sortColumn && sortOrder) {
    query += ` ORDER BY ${sortColumn} ${sortOrder.toUpperCase()}`;
  }

  query += ` LIMIT ? OFFSET ?`;
  params.push(pageSize, (page - 1) * pageSize);

  try {
    const response = await db.all<Applicant[]>(query, params);
    const countResult = await db.get<{ count: number }>(countQuery, countParams);
    const total = countResult?.count || 0;
    res.status(200).json({ applicants: response, total });
  } catch (error) {
    res.status(500).json({ message: 'Database query failed' });
  }

  db.close();
}
