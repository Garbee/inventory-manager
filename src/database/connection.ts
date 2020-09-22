import * as pgPromise from 'pg-promise';
import {LocationsRepository, IExtensions} from './repositories';
import {IClient} from 'pg-promise/typescript/pg-subset';
import * as camelcaseKeys from 'camelcase-keys';

const databaseConfig = {
  "host": process.env.DATABASE_HOST,
  "port": parseInt(process.env.DATABASE_PORT || '5432', 10),
  "database": process.env.DATABASE_NAME,
  "user": process.env.DATABASE_USER,
  "password": process.env.DATABASE_PASSWORD,
};

type ExtendedProtocol = pgPromise.IDatabase<IExtensions> & IExtensions;

// pg-promise initialization options:
const initOptions: pgPromise.IInitOptions<IExtensions> = {
  extend(obj: ExtendedProtocol, dc: any) {
    obj.locations = new LocationsRepository(obj, pgp);
  },
  receive(
      data: any[], result: pgPromise.IResultExt,
      e: pgPromise.IEventContext<IClient>) {
    result.rows = camelcaseKeys(data);
  }
};

const pgp: pgPromise.IMain = pgPromise(initOptions);

const db: ExtendedProtocol = pgp(databaseConfig);

export {db, pgp};