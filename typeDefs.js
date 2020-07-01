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
    profilePic: String!
    orders: [ID]
    role: String!
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
    productId: ID!
    userId: ID!
    complete: Boolean
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
  type Review {
    id: ID!
    comment: String!
    rating: Float
    productId: ID!
    userId: ID!
    userName: String!
  }
  type Query {
    product(productId: ID!): Product
    products(limit: Int): [Product]
    categories: [Category]
    cart: Cart
    currentUser: User
    orders: [Order]
    reviews(productId: ID!): [Review]
    currentUserReviews: [Review]
    search(term: String!): [Product]
    user(id: ID!): User
    permission: Boolean
  }
  type Mutation {
    addToCart(productId: ID!, name: String!, location: String!, thumbnail: String!, price: Float): Cart
    removeFromCart(productId: ID!): Cart
    incrementQty(productId: ID!): Cart
    decrementQty(productId: ID!): Cart
    completeCart: Cart
    loginUser(username: String!, password: String!): LoginResponse
    signupUser(username: String!, password: String!, email: String!, phone: String!): LoginResponse
    editUser(password: String!, email: String!, phone: String!, profilePic: String!): User
    addProduct(name: String!, location: String!, thumbnail: String!, desc: String!, price: Float, category: String!): Product
    addReview(comment: String!, rating: Float!, productId: ID!, userId: ID!): Review
  }
`;

module.exports = typeDefs;