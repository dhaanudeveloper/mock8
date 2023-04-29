const express = require("express")
const mongoose = require("mongoose")
const restRoute = express.Router()
restRoute.use(express.json())


const { RestModel } = require("../model/restmodel")

// GETTING ALL THE RESTAURANTS
restRoute.get("/", async (req, res) => {
    try {
        const data = await RestModel.find()
        res.send({ "Restaurants": data })
    }
    catch (err) {
        res.send({ "Message": "error" })
    }
})


// POSTING NEW RESTAURANT
restRoute.post("/", async (req, res) => {
    const { name, address: { street, city, state, country, zip }, menu: [{ menuname, description, price, image }] } = req.body
    try {
        const data = new RestModel({ name, address: { street, city, state, country, zip }, menu: [{ menuname, description, price, image }] })
        await data.save()
        res.send({ "Message": "Data saved" })
    }
    catch (err) {
        res.send({ "Message": "error" })
    }
})


// GET SPECIFIC RESTAURANT
restRoute.get("/:id", async (req, res) => {
    const ID = req.params.id
    try {
        let data = await RestModel.findOne({ _id: ID })
        res.status(200).send({ "Message": data })
    }
    catch (err) {
        res.send({ "Message": "error" })
    }
})


// GET MENU OF SPECIFIC RESTAURANT
restRoute.get("/:id/menu", async (req, res) => {
    const ID = req.params.id
    try {
        let data = await RestModel.findOne({ _id: ID })
        res.status(200).send({ "MENU": data.menu })
    }
    catch (err) {
        res.send({ "Message": "error" })
    }
})


// ADD MENU to SPECIFIC RESTAURANT
restRoute.post("/:id/menu", async (req, res) => {
    const ID = req.params.id
    const { description, price, image } = req.body
    try {
        let data = await RestModel.findOne({ _id: ID })
        let payload = {
            "description": description, "price": price, "image": image
        }
        data.menu.push(payload)
        await data.save()

        res.status(200).send({ "Menu": data.menu })
    }
    catch (err) {
        res.send({ "Message": "error" })
    }
})


// DELETE SPECIFIC MENU to SPECIFIC RESTAURANT
restRoute.delete("/:id/menu/:Id", async (req, res) => {
    const ID1 = req.params.id
    const ID2 = req.params.Id
    try {
        let data = await RestModel.findOneAndDelete({ _id: ID1, menu: [{ _id: ID2 }], })
        res.status(202).send({ "Message": "Deletion done" })
    }
    catch (err) {
        res.send({ "Message": "error" })
    }
})



module.exports = {
    restRoute
}

