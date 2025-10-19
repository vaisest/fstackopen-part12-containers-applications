const { UserInputError } = require("apollo-server");
const Book = require("../models/book");
const Author = require("../models/author");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments({}),
    authorCount: async () => Author.countDocuments({}),
    allBooks: async (root, args) => {
      const { author, genre } = args;

      let filter = {};
      if (author) {
        const authorRes = await Author.findOne({ name: author });
        filter = { author: authorRes?._id };
      }
      filter = genre ? { ...filter, genres: genre } : { ...filter };

      return await Book.find(filter).populate("author");
    },
    allAuthors: async () => await Author.find({}),
    me: (root, args, context) => context.currentUser,
  },

  Author: {
    bookCount: async (root) => await Book.countDocuments({ author: root._id }),
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const { title, published, author, genres } = args;

      if (!context.currentUser) {
        throw new UserInputError("Invalid or missing user token.");
      }

      // essentially findOrCreate
      const newAuthor = await Author.findOneAndUpdate(
        { name: author },
        { $setOnInsert: { name: author } },
        { upsert: true, new: true }
      );

      try {
        let book = new Book({
          title,
          published,
          genres,
          author: newAuthor._id,
        });
        await book.save();
        book = book.populate("author");

        pubsub.publish("BOOK_ADDED", { bookAdded: book });

        return book;
      } catch (error) {
        if (error.code === 11000) {
          throw new UserInputError("Book with specified title already exists.");
        }
        throw error;
      }
    },
    editAuthor: async (root, args, context) => {
      const { name, setBornTo } = args;

      if (!context.currentUser) {
        throw new UserInputError("Invalid or missing user token.");
      }

      return await Author.findOneAndUpdate(
        { name },
        { born: setBornTo },
        { new: true }
      );
    },
    createUser: async (root, args) => {
      const { username, favoriteGenre } = args;
      const newUser = new User({ username, favoriteGenre });
      await newUser.save();
      return newUser;
    },
    login: async (root, args) => {
      const { username, password } = args;

      const user = await User.findOne({ username });

      if (!user || password !== "secret") {
        throw new UserInputError("Incorrect username or password");
      }

      return { value: jwt.sign(JSON.stringify(user), process.env.SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};

module.exports = resolvers;
