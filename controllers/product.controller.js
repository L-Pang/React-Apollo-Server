const ProductModel = require("./models/product")
const response = require("v-response");

exports.create_product = (req, res, next) => {
    let product_body = req.body;
    const new_product = new ProductModel(product_body);
    new_product.save()
        .then(saved => {
            if (!saved) {
                return res.status(400)
                    .json(vm.ApiResponse(false, 400, "unable to save product"))
            }
            if (saved) {
                return res.status(201)
                    .json(vm.ApiResponse(true, 201, "product created sucessfully", saved))
            }

        }).catch(error => {
            return res.status(501)
                .json(vm.ApiResponse(false, 500, "an error occur", undefined, error))
        })
};