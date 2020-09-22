import {
  GraphQLResolveInfo,
  buildSchema,
} from 'graphql';
import * as graphqlFields from 'graphql-fields';
import {db} from './connection';
import {LocationInputData} from './repositories/Locations';
import {Location} from './models';

export const schema = buildSchema(`
  input LocationInput {
    name: String!
    area: String
  }
  
  type Location {
    id: ID!
    name: String!
    area: String
    createdAt: String!
    updatedAt: String!
  }
  
  type Query {
    location(id: ID!): Location
    locations: [Location]
  }
  
  type Mutation {
    createLocation(input: LocationInput!): Location
  }
`);

export const rootValue = {
  location: async (
      obj: any,
      {id}: { id: string },
      context: any,
      info: GraphQLResolveInfo) => {
    // @ts-ignore
    const fields = graphqlFields(info, null, 2);
    return await db.locations.findById(id, fields);
  },
  locations: async (
      obj: any,
      context: any,
      info: GraphQLResolveInfo) => {
    // @ts-ignore
    const fields = graphqlFields(info, null, 2);
    const columns = Object.keys(fields);

    return db.locations.all(columns);
  },
  createLocation: async (
      input: { input: LocationInputData },
      _: any,
      info: GraphQLResolveInfo): Promise<Partial<Location>> => {
    // @ts-ignore
    const fields = Object.keys(graphqlFields(info), null, 2);
    return await db.locations.create(input.input, fields);
  },
};
