require("dotenv").config();
const express = require("express");
const cors = require("cors");
const graphqlHTTP = require("express-graphql");

const schema = require("./schema").BooksSchema;

const port = process.env.PORT;

const app = express();

app.use(
  "/graphql",
  cors(),
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const server = app.listen(port, () => {
  console.log(`App listening at ${port}`);
});
