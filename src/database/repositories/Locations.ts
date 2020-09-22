import {IDatabase, IMain} from 'pg-promise';
import {IResult} from 'pg-promise/typescript/pg-subset';
import {locations as sql} from '../sql';
import * as uuidValidate from 'uuid-validate';
import {Location} from '../models';

export interface LocationInputData {
  name: string;
  area?: string;
  returning?: Array<string>;
}

export class LocationsRepository {
  table: string = 'locations';

  columns: Array<string> = [
      'id',
      'name',
      'area',
      'created_at',
      'updated_at',
  ];
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

  private validateUuid(identifier: string): void {
    if (!uuidValidate(identifier, 4)) {
      throw new Error(
          `Invalid identifier provided. Must be a UUID Version 4. ID: ${identifier}`,
      );
    }
  }

  private validateRequestedColumns(columns: Array<string>): void {
    columns.forEach((column) => {
      if (!this.columns.includes(column)) {
        if (column === 'updatedAt' || column === 'createdAt') {
          return;
        }
        throw new Error(
            `Column ${column} requested which does not exist on table.`,
        );
      }
    });
  }

  private normalizeTimestampColumns(columns: Array<string>): Array<string> {
    columns[columns.indexOf('createdAt')] = 'created_at';
    columns[columns.indexOf('updatedAt')] = 'updated_at';

    return columns;
  }

  /**
   * Retrieve a location by its primary key.
   */
  async findById(identifier: string, columns: Array<string>): Promise<Partial<Location> | null> {
    this.validateUuid(identifier);
    this.validateRequestedColumns(columns);

    return await this.db.oneOrNone(sql.findById, {
      identifier,
      columns: this.normalizeTimestampColumns(columns),
    });
  }

  async all(columns: Array<string>): Promise<Partial<Location>[]> {
    this.validateRequestedColumns(columns);
    const values = {
      columns: this.normalizeTimestampColumns(columns),
      where: '',
    };
    return this.db.any(sql.getAll, values)
  }

  async remove(identifier: string): Promise<number> {
    this.validateUuid(identifier);
    const values = {
      identifier,
    };
    const getRowCount = (r: IResult) => r.rowCount;

    return this.db.result(sql.removeById, values, getRowCount);
  }

  async create(data: LocationInputData, columns: Array<string>): Promise<Partial<Location>> {
    const insert = this.pgp.helpers.insert(data, null, this.table);
    const query = `${insert} RETURNING $1:name`;
    return await this.db.one(query, [this.normalizeTimestampColumns(columns)]).then(data => {
      console.log(data);
      return data;
    });
  }
}
