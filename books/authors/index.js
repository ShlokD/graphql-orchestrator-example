const fs = require("fs");
const path = require("path");
const { GraphQLObjectType, GraphQLString } = require("graphql");

const fetchAuthors = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, "./authors.json"), (err, data) => {
      console.log({ err, data });
      if (err) reject(err);

      const jsonData = JSON.parse(data);
      resolve(jsonData.authors);
    });
  });
};

const fetchAllAuthors = () => {
  return fetchAuthors().then((authorData) => Object.values(authorData));
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

module.exports = {
  fetchAllAuthors,
  fetchAuthors,
  AuthorType,
};
