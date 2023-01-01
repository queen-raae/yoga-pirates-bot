import {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";
declare const tables: readonly [
  {
    readonly name: "log";
    readonly columns: readonly [
      {
        readonly name: "description";
        readonly type: "text";
      },
      {
        readonly name: "discordUserId";
        readonly type: "string";
        readonly notNull: true;
        readonly defaultValue: "";
      },
      {
        readonly name: "createdTimestamp";
        readonly type: "datetime";
        readonly notNull: true;
        readonly defaultValue: "2021-04-01T18:46:52.292Z";
      },
      {
        readonly name: "logDate";
        readonly type: "datetime";
        readonly notNull: true;
        readonly defaultValue: "2021-01-01T18:47:57.127Z";
      },
      {
        readonly name: "editedTimestamp";
        readonly type: "datetime";
      }
    ];
  }
];
export declare type SchemaTables = typeof tables;
export declare type InferredTypes = SchemaInference<SchemaTables>;
export declare type Log = InferredTypes["log"];
export declare type LogRecord = Log & XataRecord;
export declare type DatabaseSchema = {
  log: LogRecord;
};
declare const DatabaseClient: any;
export declare class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions);
}
export declare const getXataClient: () => XataClient;
export {};
