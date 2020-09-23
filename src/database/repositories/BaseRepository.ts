import {IDatabase, IMain} from 'pg-promise';
import uuidValidate from 'uuid-validate';
import decamelize from 'decamelize';
import camelCase from 'camelcase';

export abstract class BaseRepository {
    protected readonly db;
    protected readonly pgp;
    protected abstract readonly columns: Array<string>;

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
      constructor(db: IDatabase<any>, pgp: IMain) {
        /*
          If your repository needs to use helpers like ColumnSet,
          you should create it conditionally, inside the constructor,
          i.e. only once, as a singleton.
        */
        this.db = db;
        this.pgp = pgp;
      }

      protected validateUuid(identifier: string): void {
          if (!uuidValidate(identifier, 4)) {
            throw new Error(
                `Invalid identifier provided. Must be a UUID Version 4. ID: ${identifier}`,
            );
          }
        }

        protected validateRequestedColumns(columns: Array<string>): void {
          console.log(columns);
          columns.forEach((column) => {
              const columnNameExists = (name: string) => {
                      return name === column || camelCase(name) === column;
              };

              if (this.columns.some(columnNameExists) === false) {
                    throw new Error(
                        `Column ${column} requested which does not exist on table.`,
                    );
              }
          });
        }

        protected decamelizeColumns(columns: Array<string>): Array<string> {
            return columns.map(name => decamelize(name));
          }
}