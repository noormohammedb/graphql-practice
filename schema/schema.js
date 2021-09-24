const gql = require("graphql");
const BookData = require("../BookData.json");

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLID,
} = gql;

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    // id: { type: GraphQLInt },
    // id: { type: GraphQLString },
    name: { type: GraphQLString },
    gener: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      // args: { id: { type: GraphQLInt } },
      // args: { id: { type: GraphQLString } },
      resolve: (parent, args) => {
        console.info("args.id:", args.id);
        console.log(typeof args.id);
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
