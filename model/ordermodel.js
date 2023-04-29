const mongoose = require("mongoose")
const { UserModel } = require("./usermodel")
const { RestModel } = require("./restmodel")


const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: UserModel },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: RestModel },
    items: [{
        name: String,
        price: Number,
        quantity: Number
    }],
    totalPrice: Number,
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String
    },
    status: String
})


const OrderModel = mongoose.model("orders", orderSchema)


module.exports = {
    OrderModel
}