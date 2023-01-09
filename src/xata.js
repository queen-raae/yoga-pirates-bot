// Generated by Xata Codegen 0.21.0. Please do not edit.
import { buildClient } from "@xata.io/client";
/** @typedef { import('./types').SchemaTables } SchemaTables */
/** @type { SchemaTables } */
const tables = [
  {
    name: "session",
    columns: [
      {
        name: "sessionTimestamp",
        type: "datetime",
        notNull: true,
        defaultValue: "2022-09-01T06:20:42.888Z",
      },
      {
        name: "createdTimestamp",
        type: "datetime",
        notNull: true,
        defaultValue: "2022-09-01T06:21:10.125Z",
      },
      {
        name: "discordUserId",
        type: "string",
        notNull: true,
        defaultValue: "",
      },
      { name: "note", type: "text" },
      { name: "editedTimestamp", type: "datetime" },
      {
        name: "sessionDateString",
        type: "string",
        notNull: true,
        defaultValue: "",
      },
      { name: "replyId", type: "string" },
    ],
  },
];
/** @type { import('../../client/src').ClientConstructor<{}> } */
const DatabaseClient = buildClient();
const defaultOptions = {
  databaseURL:
    "https://Yoga-Pirates-mlief7.us-east-1.xata.sh/db/yoga-pirates-log",
};
/** @typedef { import('./types').DatabaseSchema } DatabaseSchema */
/** @extends DatabaseClient<DatabaseSchema> */
export class XataClient extends DatabaseClient {
  constructor(options) {
    super({ ...defaultOptions, ...options }, tables);
  }
}
let instance = undefined;
/** @type { () => XataClient } */
export const getXataClient = () => {
  if (instance) return instance;
  instance = new XataClient();
  return instance;
};
