import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
        }
    ]
    });

    // Middleware pre para find y findOne
    cartSchema.pre(['find', 'findOne'], function(next) {
    this.populate('products.product');
    next();
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;