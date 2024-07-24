import type { NextApiRequest, NextApiResponse } from 'next';

import { getDB } from './lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { id } = req.body;

  if (typeof id !== 'number') {
    res.status(400).json({ message: 'Invalid input' });
    return;
  }

  const db = await getDB();

  try {
    const query = 'DELETE FROM applicant WHERE id = ?';
    const result = await db.run(query, [id]);

    if (result.changes === 0) {
      res.status(404).json({ message: 'Applicant not found' });
    } else {
      res.status(200).json({ message: 'Applicant deleted successfully' });
    }
  } catch (error: unknown) {
    const errorMessage = (error as Error).message || 'Internal server error';
    res.status(500).json({ message: errorMessage });
  } finally {
    db.close();
  }
}
