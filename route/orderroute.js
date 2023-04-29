const express = require("express")
const mongoose = require("mongoose")
const orderRoute = express.Router()
orderRoute.use(express.json())

const { RestModel } = require("../model/restmodel")
const { OrderModel } = require("../model/ordermodel")
const { UserModel } = require("../model/usermodel")


// POST AN ORDER
orderRoute.post("/", async (req, res) => {
    const { user, restaurant, items: [{ name, price, quantity }], totalPrice, deliveryAddress: { street, city, state, country, zip }, status } = req.body
    try {
        const data = new OrderModel({
            user, restaurant, items: [{ name, price, quantity }], totalPrice, deliveryAddress: { street, city, state, country, zip }, status
        })
        await data.save()
        res.send({ "Message": "Data saved" })
    }
    catch (err) {
        res.send({ "Message": "error" })
    }
})


// GET ALL ORDERS ( along with populated users and restaurants - ref made between order models and all the other 2 models)
orderRoute.get("/", async (req, res) => {
    try {
        let data = await OrderModel.findOne().populate('user restaurant')
        res.status(200).send({ "Orders": data })
    }
    catch (err) {
        res.send({ "Message": "error" })
    }
})


// GET specific order
orderRoute.get("/:id", async (req, res) => {
    const ID = req.params.id
    try {
        let data = await OrderModel.findOne({ _id: ID }).populate('user restaurant')
        res.status(200).send({ "Your Orders": data })
    }
    catch (err) {
        res.send({ "Message": "error" })
    }
})


// update status of specific order
orderRoute.patch("/:id", async (req, res) => {
    const ID = req.params.id
    const { status } = req.body;

    try {
        let data = await OrderModel.findOneAndUpdate({ _id: ID }, { status })
        res.status(200).send({ "Message": "Order status updated" })
    }
    catch (err) {
        res.send({ "Message": "error" })
    }
})



module.exports = {
    orderRoute
}