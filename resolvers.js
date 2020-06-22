const { AuthenticationError } = require('apollo-server');
const faker = require('faker');
const JsonWebToken = require('jsonwebtoken');
const Bcrypt = require('bcryptjs');

const jwtSecret = '34%%##@#FGFKFL';

const Product = require('./models/product');
const Category = require('./models/category');
const { ObjectId, isValidObjectId } = require('mongoose');
const mongoose = require('mongoose');
// const User = require('./models/user');

const isTokenValid = token => {
    const bearerToken = token.split(' ');

    if (bearerToken) {
        return JsonWebToken.verify(bearerToken[1], jwtSecret, error => {
            if (error) {
                return false;
            }

            return true;
        });
    }

    return false;
};

const mockCategory = () => ({
    id: faker.random.number,
    title: faker.random.arrayElement(['food', 'drink']),
});

const mockProduct = (id = false) => ({
    id: id || faker.random.number,
    name: faker.commerce.productName,
    location: faker.commerce.productName,
    thumbnail: faker.image.imageUrl(
        400,
        400,
        faker.random.arrayElement(['food', 'drink']),
    ),
    desc: faker.commerce.productName,
    price: faker.commerce.price(),
    rating: faker.random.number,
    category: mockCategory(),
});

async function getProduct(productId) {
    console.log(isValidObjectId(productId))
    // return await Product.findOne({ name: "Caesar Salad" }).exec();
    // return await Product.findOne({ _id: mongoose.Types.ObjectId('5eed8ebd6d21b5a10a1c666f') }).exec()
    return await Product.findOne({ _id: productId }).exec();
}

let order = {
    total: 0,
    products: [],
    complete: true,
};

const resolvers = {
    // Query: {
    //     product: () => mockProduct(),
    //     products: (_, { limit = 10 }) =>
    //         Array.from(Array(limit), () => mockProduct()),
    //     categories: (_, { limit = 10 }) =>
    //         Array.from(Array(limit), () => mockCategory()),
    //     order: () => order,
    // },
    Query: {
        product: () => Product.find({})
            .catch(err => {
                console.error(err)
            }),
        products: () => Product.find({})
            .catch(err => {
                console.error(err)
            }),
        categories: () => Category.find({})
            .catch(err => {
                console.error(err)
            }),
        // user: () => User.find({}),
        order: () => order,
    },
    Mutation: {
        // addToOrder: (_, {
        //     id
        // }) => {
        //     order = {
        //         ...order,
        //         total: order.total + 1,
        //         products: [...order.products, mockProduct(id)],
        //     };
        //     return order;
        // },
        addToOrder: (_, {
            productId
        }, { token }) => {
            console.log(productId)
            order = {
                ...order,
                total: order.total + 1,
                products: [...order.products, getProduct(productId)],
                complete: false,
            };
            console.log(order)
            return order;
        },
        completeOrder: (_, { }, {
            token
        }) => {
            const isValid = token ? isTokenValid(token) : false;

            if (isValid) {
                // order = {
                //     ...order,
                //     complete: true,
                // };
                order = {
                    total: 0,
                    products: [],
                    complete: true,
                };

                return order;
            }
            throw new AuthenticationError(
                'Please provide (valid) authentication details',
            );
        },
        loginUser: async (_, {
            username,
            password
        }) => {
            let isValid;
            const user = {
                username: 'test',
                password: '$2b$10$5dwsS5snIRlKu8ka5r7z0eoRyQVAsOtAZHkPJuSx.agOWjchXhSum',
            };

            if (username === user.username) {
                isValid = await Bcrypt.compareSync(password, user.password);
            }

            if (isValid) {
                const token = JsonWebToken.sign({
                    user: user.username
                }, jwtSecret, {
                    expiresIn: 3600,
                });
                return {
                    username,
                    token,
                };
            }
            throw new AuthenticationError(
                'Please provide (valid) authentication details',
            );
        },
    },
};

module.exports = resolvers;