import pgPromise from "pg-promise";
import {
  LocationsRepository,
  ItemsRepository,
  IExtensions,
} from "./repositories";
import { IClient } from "pg-promise/typescript/pg-subset";
import camelcaseKeys from "camelcase-keys";

const databaseConfig = {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "5432", 10),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  capSQL: true,
};

type ExtendedProtocol = pgPromise.IDatabase<IExtensions> & IExtensions;

const initOptions: pgPromise.IInitOptions<IExtensions> = {
  query(e: pgPromise.IEventContext) {
    // use a better monitor here
    // console.log(e.query);
  },
  extend(obj: ExtendedProtocol, dc: any) {
    obj.locations = new LocationsRepository(obj, pgp);
    obj.items = new ItemsRepository(obj, pgp);
  },
  receive(
    data: any[],
    result: pgPromise.IResultExt,
    e: pgPromise.IEventContext
  ) {
    result.rows = camelcaseKeys(data);
  },
};

const pgp: pgPromise.IMain = pgPromise(initOptions);

const db: ExtendedProtocol = pgp(databaseConfig);

export { db, pgp };
