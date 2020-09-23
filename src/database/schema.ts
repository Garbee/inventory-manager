import {
  GraphQLResolveInfo,
  buildSchema,
} from 'graphql';
import graphqlFields from 'graphql-fields';
import {db} from './connection';
import {LocationInputData} from './repositories/Locations';
import {Location, Item} from './models';
import {ItemInputData} from './repositories/Items';

export const schema = buildSchema(`
  input ItemInput {
    name: String
    title: String
    subtitle: String
  }

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

  type Item {
    id: ID!
    name: String
    title: String
    subtitle: String
    location: Location
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    location(id: ID!): Location
    locations: [Location]
    item(id: ID!): Item
    items: [Item]
  }

  type Mutation {
    createLocation(input: LocationInput!): Location
    createItem(input: ItemInput!): Item
  }
`);

export const rootValue = {
  location: async (
      {id}: { id: string },
      context: any,
      info: GraphQLResolveInfo) => {
    // @ts-ignore
    const fields = Object.keys(graphqlFields(info, null, 2));
    return await db.locations.findById(id, fields);
  },
  item: async (
      {id}: { id: string },
      context: any,
      info: GraphQLResolveInfo) => {
    // @ts-ignore
    const fields = Object.keys(graphqlFields(info, null, 2));
    return await db.items.findById(id, fields);
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
  items: async (
        obj: any,
        context: any,
        info: GraphQLResolveInfo) => {
      // @ts-ignore
      const fields = graphqlFields(info, null, 2);
      const columns = Object.keys(fields);

      return db.items.all(columns);
    },
  createLocation: async (
      input: { input: LocationInputData },
      _: any,
      info: GraphQLResolveInfo): Promise<Partial<Location>> => {
    // @ts-ignore
    const fields = Object.keys(graphqlFields(info), null, 2);
    return await db.locations.create(input.input, fields);
  },
  createItem: async (
      input: { input: ItemInputData },
      _: any,
      info: GraphQLResolveInfo): Promise<Partial<Item>> => {
    // @ts-ignore
    const fields = Object.keys(graphqlFields(info), null, 2);
    return await db.items.create(input.input, fields);
  },
};
