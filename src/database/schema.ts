import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLResolveInfo,
} from 'graphql';
import * as graphqlFields from 'graphql-fields';
import {db} from './connection';

const LocationType = new GraphQLObjectType({
  name: 'location',
  fields: {
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    area: {
      type: GraphQLString,
    },
    createdAt: {
      type: GraphQLString,
    },
    updatedAt: {
      type: GraphQLString,
    },
  },
});

const rootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    location: {
      type: LocationType,
      args: {
        id: {type: GraphQLID},
      },
    },
    locations: {
      type: GraphQLList(LocationType),
      resolve(root:any, args:any, context:any, info:GraphQLResolveInfo) {
        // @ts-ignore
        const fields = graphqlFields(info, null, 2);
        const columns = Object.keys(fields);

        return db.locations.all(columns);
      }
    }
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addStorageLocation: {
      type: LocationType,
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        area: {
          type: GraphQLString,
        }
      }
    }
  }
});

export const schema = new GraphQLSchema({
  query: rootQuery,
});
