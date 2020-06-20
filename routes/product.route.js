const ProductController = require("../controllers/product.controller")
const express = require('express');
const router = express.router();

router.post("/create", ProductController.create);

module.exports = router