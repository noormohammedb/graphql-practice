const app = require("express")();
// const { graphqlHTTP: expressGraphQL } = require("express-graphql");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const schema = require("./schema/schema");

const port = process.env.PORT || 9908;

app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log(`server listening on :${port}`);
});
