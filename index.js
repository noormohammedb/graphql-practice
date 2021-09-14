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

const gqlSchema = new GraphQLSchema({ query: rootQuery });
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
