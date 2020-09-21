import {IDatabase, IMain} from 'pg-promise';
import {IResult} from 'pg-promise/typescript/pg-subset';

export class LocationsRepository {
  /**
   * @param db
   * Automated database connection context/interface.
   *
   * If you ever need to access other repositories from this one,
   * you will have to replace type 'IDatabase<any>' with 'any'.
   *
   * @param pgp
   * Library's root, if ever needed, like to access 'helpers'
   * or other namespaces available from the root.
   */
  constructor(private db: IDatabase<any>, private pgp: IMain) {
    /*
      If your repository needs to use helpers like ColumnSet,
      you should create it conditionally, inside the constructor,
      i.e. only once, as a singleton.
    */
    this.db = db;
    this.pgp = pgp;
  }

  async find() {}
}
