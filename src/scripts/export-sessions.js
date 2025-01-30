import { getXataClient } from "../xata.js";
import { writeFileSync } from "fs";
import * as dotenv from "dotenv";
dotenv.config();

const xata = getXataClient();

const records = await xata.db.session.getAll();

console.log("number of sessions", records.length);

const recordsAsString = JSON.stringify(records);

writeFileSync("sessions.json", recordsAsString);

const yogis = await xata.db.yogis.getAll();

console.log("number of yogis", yogis.length);

const yogisAsString = JSON.stringify(yogis);

writeFileSync("yogis.json", yogisAsString);
