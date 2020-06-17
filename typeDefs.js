const { gql } = require('apollo-server');

const typeDefs = gql `
  type Product {
    id: ID!
    name: String!
    location: String!
    thumbnail: String!
    desc: String!
    price: Float
    rating: Float
    category: Category
  }
  type Category {
    id: ID!
    title: String!
  }
  type User {
    id: ID!
    username: String!
    password: String!
    email: String!
    phone: Int!
    token: String!
  }
  type Order {
    total: Float
    products: [Product]
    complete: Boolean
  }
  input OrderInput {
    productId: ID!
  }
  type Query {
    product: Product
    products(limit: Int): [Product]
    categories: [Category]
    order: Order
  }
  type Mutation {
    addToOrder(input: OrderInput!): Order
    completeOrder: Order
    loginUser(username: String!, password: String!): User
  }
`;

module.exports = typeDefs;