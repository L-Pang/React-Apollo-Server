const express = require('express');
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

httpServer.listen({ port: 4000, host: '0.0.0.0'}, () => {
    console.log('Apollo Server on http://localhost:4000/graphql');
});