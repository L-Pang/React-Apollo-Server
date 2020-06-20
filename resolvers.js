const {
    AuthenticationError
} = require('apollo-server');
const faker = require('faker');
const JsonWebToken = require('jsonwebtoken');
const Bcrypt = require('bcryptjs');

const jwtSecret = '34%%##@#FGFKFL';

const Product = require('./models/product');
const Category = require('./models/category');
const User = require('./models/user');

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

let order = {
    total: 0,
    products: [],
    complete: false,
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
                .then(doc => {
                    console.log(doc)
                })
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
        addToOrder: (_, {
            id
        }) => {
            order = {
                ...order,
                total: order.total + 1,
                products: [...order.products, mockProduct(id)],
            };
            console.log(order)
            return order;
        },
        completeOrder: (_, { }, {
            token
        }) => {
            const isValid = token ? isTokenValid(token) : false;

            if (isValid) {
                order = {
                    ...order,
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