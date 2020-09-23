import {IResult} from 'pg-promise/typescript/pg-subset';
import {BaseRepository} from './BaseRepository';
import {locations as sql} from '../sql';
import {Location} from '../models';

export interface LocationInputData {
  name: string;
  area?: string;
  returning?: Array<string>;
}

export class LocationsRepository extends BaseRepository {
  table: string = 'locations';

  protected readonly columns: Array<string> = [
      'id',
      'name',
      'area',
      'created_at',
      'updated_at',
  ];

  /**
   * Retrieve a location by its primary key.
   */
  async findById(identifier: string, columns: Array<string>): Promise<Partial<Location> | null> {
    this.validateUuid(identifier);
    this.validateRequestedColumns(columns);

    return await this.db.oneOrNone(sql.findById, {
      identifier,
      columns: this.decamelizeColumns(columns),
    });
  }

  async all(columns: Array<string>): Promise<Partial<Location>[]> {
    this.validateRequestedColumns(columns);
    const values = {
      columns: this.decamelizeColumns(columns),
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
    return await this.db.one(query, [this.decamelizeColumns(columns)]);
  }
}
