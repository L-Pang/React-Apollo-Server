const { AuthenticationError } = require('apollo-server');
const faker = require('faker');
const JsonWebToken = require('jsonwebtoken');
const Bcrypt = require('bcryptjs');

const jwtSecret = '34%%##@#FGFKFL';

const Product = require('./models/product');
const Category = require('./models/category');
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
    return await Product.findOne({
        _id: productId
    })
        .exec();
}

async function getCategory(category) {
    return await Product.findOne({
        title: category
    }).exec();
}

async function createProduct(name, location, thumbnail, desc, price, category) {

    return await Product.create({
        name: name,
        location: location,
        thumbnail: thumbnail,
        desc: desc,
        price: price,
        rating: 5,
        category: {
            title: category
        }
    }).catch(function (error) {
        console.log(error)
    });
}

let order = {
    total: 0,
    products: [],
    totalPrice: 0,
    complete: true,
}

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
        // addToOrder: (_, {
        //     productId
        // }) => {
        //     order = {
        //         ...order,
        //         total: order.total + 1,
        //         products: [...order.products, getProduct(productId)],
        //         complete: false,
        //     };
        //     return order;
        // },
        addToOrder: (_, {
            productId, name, location, thumbnail, price
        }) => {
            let product = {
                id: productId,
                name: name,
                location: location,
                thumbnail: thumbnail,
                price: price
            }
            const index = order.products.findIndex(item => {
                return item.id == productId
            });
            if (index >= 0) {
                let orderData = order.products[index];
                let incQty = orderData.qty + 1;
                let incOrder = {
                    ...orderData,
                    qty: incQty
                }
                order.products[index] = incOrder;
                order = {
                    ...order,
                    total: order.total + 1,
                    products: [...order.products],
                    totalPrice: order.totalPrice + product.price,
                    complete: false,
                };
                console.log(order.totalPrice);
            } else {
                product.qty = 1;
                order = {
                    ...order,
                    total: order.total + 1,
                    products: [...order.products, product],
                    totalPrice: order.totalPrice + product.price,
                    complete: false,
                };
                console.log(order.totalPrice);
            }
            return order;
        },
        /*removeFromOrder: (_, {
            productId
        }) => {
            remove = order.products.find(item => item.id == productId);
            qty = remove.qty;
            remove.qty = 0;
            newProducts = order.products.filter(item => item.id !== productId);
            let total = 0;
            let i;
            for (i = 0; i < newProducts.length; i ++) {
                total += newProducts[i].price * newProducts[i].qty;
            }
            order = {
                ...order,
                total: order.total - qty,
                products: [...newProducts],
                totalPrice: total,
                complete: false,
            };
            return order;
        },*/
        incrementQty: (_, {
            productId
        }) => {
            console.log(productId)
            let increment = order.products.find(item => item.id == productId);
            increment.qty++;
            order = {
                ...order,
                total: order.total + 1,
                totalPrice: order.totalPrice + increment.price,
                complete: false,
            };
            console.log(order)
            return order;
        },
        decrementQty: (_, {
            productId
        }) => {
            let decrement = order.products.find(item => item.id == productId);
            decrement.qty--;
            order = {
                ...order,
                total: order.total - 1,
                totalPrice: order.totalPrice - decrement.price,
                complete: false,
            };
            if (decrement.qty <= 0) {
                removeFromOrder(productId);
            }
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
        addProduct: (_, {
            name,
            location,
            thumbnail,
            desc,
            price,
            category
        }) => {
            return createProduct(name, location, thumbnail, desc, price, category);
        },
    },
};

module.exports = resolvers;
