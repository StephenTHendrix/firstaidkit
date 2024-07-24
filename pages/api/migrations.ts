import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "./lib/db";
import { Applicant } from "./lib/applicant";

type ApiResponse = {
  message: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    await runMigrations();
    res.status(200).json({ message: "All migrations successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Migration failed", error: "Internal Server Error" });
  }
}

const runMigrations = async () => {
  await addIdColumn();
  // Example function just to confirm extendability
  await addCreatedAtColumn();
};

const addIdColumn = async () => {
  const db = await getDB();

  try {
    await db.exec("BEGIN TRANSACTION");

    await db.exec(`
      CREATE TABLE applicant_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        screener TEXT
      )
    `);

    await db.exec(`
      INSERT INTO applicant_new (name, phone, screener) 
      SELECT name, phone, screener FROM applicant
    `);

    await db.exec("DROP TABLE applicant");
    await db.exec("ALTER TABLE applicant_new RENAME TO applicant");

    await db.exec("COMMIT");

    db.close();
  } catch (error) {
    await db.exec("ROLLBACK");
    db.close();
    throw error;
  }
};

const addCreatedAtColumn = async () => {
    const db = await getDB();
    const currentDateTime = new Date().toISOString();
  
    try {
      await db.exec("BEGIN TRANSACTION");
  
      await db.exec(`
        ALTER TABLE applicant ADD COLUMN created_at TEXT
      `);
  
      await db.exec(`
        UPDATE applicant SET created_at = '${currentDateTime}'
      `);
  
      await db.exec("COMMIT");
  
      db.close();
    } catch (error) {
      await db.exec("ROLLBACK");
      db.close();
      throw error;
    }
  };
