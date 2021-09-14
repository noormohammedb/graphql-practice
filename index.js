const app = require("express")();

const port = process.env.PORT || 9909;
const userData = require("./MOCK_DATA.json");
const expressGraphQL = require("express-graphql").graphqlHTTP;

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} = require("graphql");

const userType = new GraphQLObjectType({
  name: "user",
  fields: () => ({
    id: { type: GraphQLInt },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

const rootQuery = new GraphQLObjectType({
  name: "helloworld",
  fields: () => ({
    message: {
      type: GraphQLString,
      resolve: () => {
        console.log("resolved helloworld");
        return "Hello World!";
      },
    },
    test: {
      type: GraphQLInt,
      resolve: () => 4,
    },
    getAllUser: {
      type: new GraphQLList(userType),
      resolve: () => userData,
    },
  }),
});

const mutation = new GraphQLObjectType({
  name: "mutation",
  fields: () => ({
    createUser: {
      type: userType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        // return "lksdf";
        userData.push({
          id: userData.length + 1,
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          password: args.password,
        });
        return { ...args, id: userData.length + 1 };
      },
    },
  }),
});

const gqlSchema = new GraphQLSchema({ query: rootQuery, mutation: mutation });
app.use(
  "/graphql",
  expressGraphQL({
    graphiql: true,
    schema: gqlSchema,
  })
);

app.listen(port, () => {
  console.log(`app listening on ${port}`);
});
