
import {QueryFile, IQueryFileOptions} from 'pg-promise';

const {join: joinPath} = require('path');

///////////////////////////////////////////////
// Helper for linking to external query files;
const sql = function(file: string): QueryFile {

  const fullPath: string = joinPath(__dirname, file);

  const options: IQueryFileOptions = {

    // minifying the SQL is always advised;
    // see also option 'compress' in the API;
    minify: true

    // See also property 'params' for two-step template formatting
  };

  const qf: QueryFile = new QueryFile(fullPath, options);

  if (qf.error) {
    // Something is wrong with our query file :(
    // Testing all files through queries can be cumbersome,
    // so we also report it here, while loading the module:
    console.error(qf.error);
  }

  return qf;

  // See QueryFile API:
  // http://vitaly-t.github.io/pg-promise/QueryFile.html
}

export const locations = {
  findById: sql('./locations/findById.sql'),
  getAll: sql('./locations/all.sql'),
  removeById: sql('./locations/removeById.sql'),
};