const express = require('express');
// const mongoose = require('mongoose')
const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');

const resolvers = require('./resolvers.js');
const typeDefs = require('./typeDefs.js');

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, connection }) => ({
        token: req ? req.headers.authorization : connection.context.authorization,
    }),
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

// httpServer.listen({ port: process.env.PORT || 4000, hostname: '0.0.0.0' }, () => {
//     console.log('Apollo Server on http://localhost:' + process.env.PORT + '/ graphql');
// });

// connect to our MongoDB server.
// const db = mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@my-first-cluster-hr6uj.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)

httpServer.listen({
    port: 4000,
}, () => {
    console.log('Apollo Server on 4000/graphql');
});
