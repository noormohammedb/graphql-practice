const gql = require("graphql");
const { BookData, authorData } = require("../Data.json");

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
    authorId: { type: GraphQLInt },
    author: {
      type: AuthorType,
      resolve: (parent) => {
        console.info("Book Type author resolve parent:", parent);
        return authorData.find((iterator) => parent.authorId == iterator.id);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    // age: { type: GraphQLInt },
    age: { type: GraphQLInt },
    book: {
      type: GraphQLList(BookType),
      // type: BookType,
      resolve: (parent) => {
        return BookData.filter(
          (BookIterator) => parent.id == BookIterator.authorId
        );
      },
    },
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
        console.info("book Query args.id:", args.id, typeof args.id);
        const book = BookData.find((iterator) => iterator.id == args.id);
        console.log(book);
        return book;
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: () => {
        console.info("Books Query", typeof BookData);
        return BookData;
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) =>
        authorData.find((iterator) => iterator.id == args.id),
    },
    authors: {
      type: new GraphQLList(AuthorType),
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => authorData,
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
