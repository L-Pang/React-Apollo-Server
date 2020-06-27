const { AuthenticationError } = require('apollo-server');
const faker = require('faker');
const JsonWebToken = require('jsonwebtoken');
const Bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const jwtSecret = '34%%##@#FGFKFL';

const Product = require('./models/product');
const Category = require('./models/category');
const User = require('./models/user');
const Order = require('./models/order');

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

let cart = {
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
    //     cart: () => cart,
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
        cart: () => cart,
    },
    Mutation: {
        // addToCart: (_, {
        //     id
        // }) => {
        //     cart = {
        //         ...cart,
        //         total: cart.total + 1,
        //         products: [...cart.products, mockProduct(id)],
        //     };
        //     return cart;
        // },
        addToCart: (_, {
            productId, name, location, thumbnail, price
        }) => {
            let product = {
                id: productId,
                name: name,
                location: location,
                thumbnail: thumbnail,
                price: price
            }
            const index = cart.products.findIndex(item => {
                return item.id == productId
            });
            if (index >= 0) {
                let cartData = cart.products[index];
                let incQty = cartData.qty + 1;
                let incCart = {
                    ...cartData,
                    qty: incQty
                }
                cart.products[index] = incCart;
                cart = {
                    ...cart,
                    total: cart.total + 1,
                    products: [...cart.products],
                    totalPrice: cart.totalPrice + product.price,
                    complete: false,
                };
            } else {
                product.qty = 1;
                cart = {
                    ...cart,
                    total: cart.total + 1,
                    products: [...cart.products, product],
                    totalPrice: cart.totalPrice + product.price,
                    complete: false,
                };
            }
            return cart;
        },
        /*removeFromCart: (_, {
            productId
        }) => {
            remove = cart.products.find(item => item.id == productId);
            qty = remove.qty;
            remove.qty = 0;
            newProducts = cart.products.filter(item => item.id !== productId);
            let total = 0;
            let i;
            for (i = 0; i < newProducts.length; i ++) {
                total += newProducts[i].price * newProducts[i].qty;
            }
            cart = {
                ...cart,
                total: cart.total - qty,
                products: [...newProducts],
                totalPrice: total,
                complete: false,
            };
            return cart;
        },*/
        incrementQty: (_, {
            productId
        }) => {
            console.log(productId)
            let increment = cart.products.find(item => item.id == productId);
            increment.qty++;
            cart = {
                ...cart,
                total: cart.total + 1,
                totalPrice: cart.totalPrice + increment.price,
                complete: false,
            };
            return cart;
        },
        decrementQty: (_, {
            productId
        }) => {
            let decrement = cart.products.find(item => item.id == productId);
            decrement.qty--;
            cart = {
                ...cart,
                total: cart.total - 1,
                totalPrice: cart.totalPrice - decrement.price,
                complete: false,
            };
            if (decrement.qty <= 0) {
              newProducts = cart.products.filter(item => item.id !== productId);
              cart = {
                  ...cart,
                  total: cart.total,
                  products: [...newProducts],
                  totalPrice: cart.totalPrice,
                  complete: false,
              };
            }
            return cart;
        },
        completeCart: (_, {}, {
            token
        }) => {
            const isValid = token ? isTokenValid(token) : false;

            if (isValid) {
                // cart = {
                //     ...cart,
                //     complete: true,
                // };
                cart = {
                    total: 0,
                    products: [],
                    totalPrice: 0,
                    complete: true,
                };

                return cart;
            }
            throw new AuthenticationError(
                'Wrong password!',
            );
        },
        loginUser: async (_, {
            username,
            password
        }) => {
            let isValid;
            // const user = {
            //     username: 'test',
            //     password: '$2b$10$5dwsS5snIRlKu8ka5r7z0eoRyQVAsOtAZHkPJuSx.agOWjchXhSum',
            // };
            const user = await User.findOne({ username: username }).exec();
            console.log(user)

            if (!user) {
                throw new Error('Invalid username!')
            }

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
        signupUser: async (_, {
            username,
            password,
            email,
            phone
        }) => {
            console.log(username, password, email, phone)
            const user = await User.create({
                username: username,
                password: await Bcrypt.hash(password, 10),
                email: email,
                phone: phone,
                orders: []
            }).catch(function (error) {
                console.log(error)
            });
            const token = JsonWebToken.sign({
                user: user.username
                }, jwtSecret, {
                    expiresIn: 3600,
            });
            // return json web token
            return {
                username,
                token,
            };
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
