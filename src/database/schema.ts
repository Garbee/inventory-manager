const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

const LocationType = new GraphQLObjectType({
  name: 'location',
  fields: {
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    area: {
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
        id: {type: GraphQLString},
      },
    },
    locations: {
      type: GraphQLList(LocationType),
      resolve(parentValue:any, args:any) {

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
