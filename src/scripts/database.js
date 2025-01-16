import Database from "better-sqlite3";
import * as dotenv from "dotenv";
dotenv.config();
import { getXataClient } from "../xata.js";

export const setupDatabase = async () => {
  const db = new Database(process.env.DATABASE_PATH);

  const sql = `
CREATE TABLE IF NOT EXISTS \`session\` (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  \`sessionTimestamp\` TEXT NOT NULL DEFAULT '2022-09-01T06:20:42.888Z',
  \`createdTimestamp\` TEXT NOT NULL DEFAULT '2022-09-01T06:21:10.125Z',
  \`discordUserId\` TEXT NOT NULL DEFAULT '',
  \`note\` TEXT,
  \`editedTimestamp\` TEXT,
  \`sessionDateString\` TEXT NOT NULL DEFAULT '',
  \`replyId\` TEXT,
  \`exercise\` TEXT NOT NULL DEFAULT 'yoga'
);

CREATE TABLE IF NOT EXISTS \`yogis\` (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  \`timezone\` TEXT
);
`;

  db.exec(sql);
  console.log("Tables created!");
};

export const importFromXata = async () => {
  const xata = getXataClient();
  const db = new Database(process.env.DATABASE_PATH);
  const records = await xata.db.session.getAll();

  const insertStatement = db.prepare(`
  INSERT OR IGNORE INTO session (
    id,
    sessionTimestamp,
    createdTimestamp,
    discordUserId,
    note,
    editedTimestamp,
    sessionDateString,
    replyId,
    exercise
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

  records.forEach((record) => {
    insertStatement.run(
      record.id,
      record.sessionTimestamp.toISOString() || null,
      record.createdTimestamp.toISOString() || null,
      record.discordUserId,
      record.note,
      record.editedTimestamp?.toISOString() || null,
      record.sessionDateString,
      record.replyId,
      record.exercise
    );
  });

  const countStatement = db.prepare(`
  SELECT COUNT(*) as count
  FROM session
`);

  const count = countStatement.get();
  console.log("Records inserted:", count.count);
};

// Set up the database
await setupDatabase();
await importFromXata();
