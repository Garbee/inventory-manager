const {
  GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull,
} = require('graphql');

const StorageLocationType = new GraphQLObjectType({
  name: 'StorageLocation',
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
    storageLocation: {
      type: StorageLocationType,
      args: {
        id: {type: GraphQLString},
      },
    },
    storageLocations: {
      type: GraphQLList(StorageLocationType),
      resolve(parentValue, args) {

      }
    }
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addStorageLocation: {
      type: StorageLocationType,
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

const schema = new GraphQLSchema({
  query: rootQuery,
});

module.exports = {
  schema,
};
