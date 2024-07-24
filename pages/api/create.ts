import type { NextApiRequest, NextApiResponse } from 'next';

import { getDB } from './lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { name, phone } = req.body;

  if (typeof name !== 'string' || typeof phone !== 'string') {
    res.status(400).json({ message: 'Invalid input' });
    return;
  }

  const db = await getDB();

  try {
    const query = 'INSERT INTO applicant (name, phone) VALUES (?, ?)';
    const result = await db.run(query, [name, phone]);

    res.status(201).json({ id: result.lastID, message: 'Applicant added successfully' });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message || 'Internal server error';
    res.status(500).json({ message: errorMessage });
  } finally {
    db.close();
  }
}
