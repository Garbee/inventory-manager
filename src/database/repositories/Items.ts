import {IResult} from 'pg-promise/typescript/pg-subset';
import { BaseRepository } from './BaseRepository';
import {items as sql} from '../sql';
import { Item } from '../models';

export interface ItemInputData {
  industryIdentifiers?: object;
  name?: string;
  title?: string;
  subtitle?: string;
  locationId?: string;
}

export class ItemsRepository extends BaseRepository {
  protected readonly table = 'items';
  protected readonly columns = [
    'id',
    'industry_identifiers',
    'name',
    'title',
    'subtitle',
    'location_id',
    'created_at',
    'updated_at',
  ];

  /**
     * Retrieve a location by its primary key.
     */
    async findById(identifier: string, columns: Array<string>): Promise<Partial<Item> | null> {
      this.validateUuid(identifier);
      this.validateRequestedColumns(columns);

      return await this.db.oneOrNone(sql.findById, {
        identifier,
        columns: this.decamelizeColumns(columns),
      });
    }

    async all(columns: Array<string>): Promise<Partial<Item>[]> {
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

      async create(data: ItemInputData, columns: Array<string>): Promise<Partial<Item>> {
        const insert = this.pgp.helpers.insert(data, null, this.table);
        const query = `${insert} RETURNING $1:name`;
        return await this.db.one(query, [this.decamelizeColumns(columns)]);
      }
}
