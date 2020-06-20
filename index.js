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

// httpServer.listen({ port: process.env.PORT || 4000, hostname: '0.0.0.0' }, () => {
//     console.log('Apollo Server on http://localhost:' + process.env.PORT + '/ graphql');
// });

httpServer.listen({
    port: 4000,
}, () => {
    console.log('Apollo Server on 4000/graphql');
});

// const MongoClient = require('mongodb').MongoClient;
// const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-3pmsx.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {
//     useNewUrlParser: true
// });


// client.connect(err => {
//     // const collection = client.db("Foodie-db").collection("Foodie");
//     db = client.db("Foodie-db")
//     console.log("Connected correctly to server");
//     // perform actions on the collection object
//     client.close();
// });

const mongoose = require('mongoose');
const { mongo } = require('mongoose');
mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-3pmsx.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))