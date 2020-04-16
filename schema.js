const fs = require("fs");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLString,
} = require("graphql");

const { fetchAllAuthors, AuthorType } = require("./books/authors");
const { fetchAllBooks, BookType } = require("./books");

const RootBooksQuery = new GraphQLObjectType({
  name: "BooksQuery",
  description: "List of all books",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      resolve: (root) => fetchAllBooks(),
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: (root) => fetchAllAuthors(),
    },
    uuid: {
      type: GraphQLString,
      resolve: (root) => `${Math.random() * 100000}`,
    },
  }),
});

const BooksSchema = new GraphQLSchema({ query: RootBooksQuery });

module.exports = { BooksSchema };
