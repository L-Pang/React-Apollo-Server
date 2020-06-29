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
    phone: String!
    orders: [Order]
  }
  type LoginResponse {
    user: User
    token: String!
  }
  type Order {
    id: ID!
    name: String!
    location: String!
    thumbnail: String!
    qty: Int!
    total: Float
    customers: [User]
    status: Boolean
  }
  type Item {
    id: ID!
    name: String!
    location: String!
    thumbnail: String!
    price: Float
    qty: Int!
  }
  type Cart {
    total: Float
    products: [Item]
    totalPrice: Float
    complete: Boolean
  }
  type Query {
    product: Product
    products(limit: Int): [Product]
    categories: [Category]
    cart: Cart
  }
  type Mutation {
    addToCart(productId: ID!, name: String!, location: String!, thumbnail: String!, price: Float): Cart
    removeFromCart(productId: ID!): Cart
    incrementQty(productId: ID!): Cart
    decrementQty(productId: ID!): Cart
    completeCart: Cart
    loginUser(username: String!, password: String!): LoginResponse
    signupUser(username: String!, password: String!, email: String!, phone: String!): User
    addProduct(name: String!, location: String!, thumbnail: String!, desc: String!, price: Float, category: String!): Product
  }
`;

module.exports = typeDefs;