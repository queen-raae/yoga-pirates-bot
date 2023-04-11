import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";
declare const tables: readonly [
  {
    readonly name: "session";
    readonly columns: readonly [
      {
        readonly name: "sessionTimestamp";
        readonly type: "datetime";
        readonly notNull: true;
        readonly defaultValue: "2022-09-01T06:20:42.888Z";
      },
      {
        readonly name: "createdTimestamp";
        readonly type: "datetime";
        readonly notNull: true;
        readonly defaultValue: "2022-09-01T06:21:10.125Z";
      },
      {
        readonly name: "discordUserId";
        readonly type: "string";
        readonly notNull: true;
        readonly defaultValue: "";
      },
      {
        readonly name: "note";
        readonly type: "text";
      },
      {
        readonly name: "editedTimestamp";
        readonly type: "datetime";
      },
      {
        readonly name: "sessionDateString";
        readonly type: "string";
        readonly notNull: true;
        readonly defaultValue: "";
      },
      {
        readonly name: "replyId";
        readonly type: "string";
      },
      {
        readonly name: "exercise";
        readonly type: "string";
        readonly notNull: true;
        readonly defaultValue: "yoga";
      }
    ];
  },
  {
    readonly name: "yogis";
    readonly columns: readonly [
      {
        readonly name: "timezone";
        readonly type: "string";
      }
    ];
  }
];
export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;
export type Session = InferredTypes["session"];
export type SessionRecord = Session & XataRecord;
export type Yogis = InferredTypes["yogis"];
export type YogisRecord = Yogis & XataRecord;
export type DatabaseSchema = {
  session: SessionRecord;
  yogis: YogisRecord;
};
declare const DatabaseClient: any;
export declare class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions);
}
export declare const getXataClient: () => XataClient;
export {};
