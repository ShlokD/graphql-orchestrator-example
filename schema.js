const fs = require("fs");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLString,
} = require("graphql");

const mergeBooksAndAuthors = (books, authors) => {
  return books.map((book) => {
    const authorId = book.author.id;
    const author = authors[authorId];
    return {
      title: book.title,
      author: {
        name: author.name,
        about: author.about,
      },
    };
  });
};

const fetchAllBooks = () => {
  const fetchBooks = new Promise((resolve, reject) => {
    fs.readFile("./books.json", (err, data) => {
      if (err) reject(err);
      const jsonData = JSON.parse(data);
      resolve(jsonData.books);
    });
  });

  const fetchAuthors = new Promise((resolve, reject) => {
    fs.readFile("./authors.json", (err, data) => {
      if (err) reject(err);
      const jsonData = JSON.parse(data);
      resolve(jsonData.authors);
    });
  });

  return Promise.all([fetchBooks, fetchAuthors]).then(([books, authors]) => {
    return mergeBooksAndAuthors(books, authors);
  });
};

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "Someone who writes books",
  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: (author) => author.name,
    },
    about: {
      type: GraphQLString,
      resolve: (author) => author.about,
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "Something you read",
  fields: () => ({
    bookid: {
      type: GraphQLString,
      resolve: (book) => book.id,
    },
    title: {
      type: GraphQLString,
      resolve: (book) => book.title,
    },
    author: {
      type: AuthorType,
      resolve: (book) => book.author,
    },
  }),
});

const RootBooksQuery = new GraphQLObjectType({
  name: "BooksQuery",
  description: "List of all books",
  fields: () => ({
    allBooks: {
      type: new GraphQLList(BookType),
      resolve: (root) => fetchAllBooks(),
    },
  }),
});

const BooksSchema = new GraphQLSchema({ query: RootBooksQuery });

module.exports = { BooksSchema };
