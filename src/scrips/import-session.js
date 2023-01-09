import { getXataClient } from "./../xata.js";
import { readFileSync } from "fs";
import * as dotenv from "dotenv";
dotenv.config();

const xata = getXataClient();

const recordsAsString = readFileSync("sessions.json");

const records = await xata.db.session.create(JSON.parse(recordsAsString));

console.log("number of sessions", records.length);
