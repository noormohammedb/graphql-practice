const gql = require("graphql");
const BookData = require("../BookData.json");

const { GraphQLObjectType, GraphQLList, GraphQLSchema, GraphQLString } = gql;

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    gener: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: gql.GraphQLInt } },
      // args: { id: { type: GraphQLString } },
      resolve: (parent, args) => {
        const book = BookData.find((iterator) => iterator.id == args.id);
        console.log(book);
        return book;
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: () => {
        console.log(typeof BookData);
        return BookData;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
