require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB");
  } catch (e) {
    console.log("Error connecting to MongoDB:", e.message);
  }
  const app = express();
  const httpServer = http.createServer(app);

  const User = require("./models/user");
  const resolvers = require("./graphql/resolvers");
  const typeDefs = require("./graphql/schema");
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: "",
    }
  );

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.toLowerCase().startsWith("bearer ")) {
        const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET);
        const currentUser = await User.findById(decodedToken._id);
        return { currentUser };
      }
      return null;
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: "/",
  });

  const PORT = 4000;

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  );
};

start();
