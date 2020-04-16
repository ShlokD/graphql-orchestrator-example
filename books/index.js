const fs = require("fs");
const path = require("path");
const { GraphQLObjectType, GraphQLString } = require("graphql");

const { fetchAuthors, AuthorType } = require("./authors");

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

const fetchBooks = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, "./books.json"), (err, data) => {
      if (err) reject(err);
      const jsonData = JSON.parse(data);
      
      resolve(jsonData.books);
    });
  });
};

const fetchAllBooks = () => {
  return Promise.all([fetchBooks(), fetchAuthors()]).then(([books, authors]) => {
    return mergeBooksAndAuthors(books, authors);
  });
};

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

module.exports = {
  fetchBooks,
  fetchAllBooks,
  BookType,
};
