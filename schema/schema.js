const gql = require("graphql");
const { ObjectId } = require("mongodb");

const { db } = require("../database");

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLID,
} = gql;

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    gener: { type: GraphQLString },
    authorId: { type: GraphQLID },
    author: {
      type: AuthorType,
      resolve: async (parent) => {
        console.info("Book Type author resolve parent:", parent);
        const authorFromDB = await db
          .collection("authors")
          .findOne({ _id: ObjectId(parent.authorId) });
        console.info("authorFromDB:", authorFromDB);

        return {
          id: authorFromDB._id.toString(),
          name: authorFromDB.name,
          age: authorFromDB.age,
        };
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve: async (parent) => {
        const bookFromDB = await db
          .collection("books")
          .find({ authorId: parent.id })
          .toArray();
        console.info("bookFromDB:", bookFromDB);
        const newBooksArray = bookFromDB.map((data) => ({
          id: data._id.toString(),
          name: data.name,
          gener: data.gener,
          authorId: data.authorId,
        }));
        return newBooksArray;
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
      resolve: async (parent, args) => {
        console.info("book Query args.id:", args.id, typeof args.id);
        const bookData = await db
          .collection("books")
          .findOne({ _id: ObjectId(args.id) });
        console.info("bookData:", bookData);
        return {
          id: bookData._id.toString(),
          name: bookData.name,
          gener: bookData.gener,
          authorId: bookData.authorId,
        };
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: async () => {
        console.info("Books Query");
        const booksFromDB = await db.collection("books").find();
        const booksArray = await booksFromDB.toArray();
        const newBooksArray = booksArray.map((data) => ({
          id: data._id.toString(),
          name: data.name,
          gener: data.gener,
          authorId: data.authorId,
        }));
        return newBooksArray;
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args) => {
        const authorFromDB = await db
          .collection("authors")
          .findOne({ _id: ObjectId(args.id) });
        console.info("authorFromDB:", authorFromDB);
        return {
          id: authorFromDB._id.toString(),
          name: authorFromDB.name,
          age: authorFromDB.age,
        };
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args) => {
        const authorsFromDB = await db.collection("authors").find();
        const authorsArray = await authorsFromDB.toArray();
        const newAuthorsArray = authorsArray.map((data) => ({
          id: data._id.toString(),
          name: data.name,
          age: data.age,
        }));
        return newAuthorsArray;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        gener: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        try {
          const dbResult = await db.collection("books").insertOne({ ...args });
          console.info("dbResult:", dbResult);
          return { ...args, id: dbResult.insertedId.toString() };
        } catch (dbInsertationError) {
          console.log("DB Insertation Error in Book Mutation");
          console.error(dbInsertationError);
          return new Error();
        }
      },
    },
    addAuthor: {
      type: AuthorType,
      args: {
        // id: { type: GraphQLID },
        name: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (parent, args) => {
        console.info("args:", args);
        try {
          const dbResult = await db
            .collection("authors")
            .insertOne({ ...args });
          console.info("dbResult:", dbResult);
          return { ...args, id: dbResult.insertedId.toString() };
        } catch (dbInsertationError) {
          console.log("DB Insertation Error in Author Mutation");
          console.error(dbInsertationError);
          return new Error();
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
