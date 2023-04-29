const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const userRoute = express.Router()
userRoute.use(express.json())

const { UserModel } = require("../model/usermodel")

userRoute.post("/register", async (req, res) => {
    const { name, email, password, address: { street, city, state, country, zip } } = req.body
    const userFound = await UserModel.findOne({ email })
    if (userFound) {
        res.send({ "message": "Already User registered" })
    }
    else {
        try {
            bcrypt.hash(password, 5, async function (err, hash) {
                const data = new UserModel({ name, email, password: hash, address: { street, city, state, country, zip } })
                await data.save()
                res.status(201).send({ "message": "User registered" })
            });

        }
        catch (err) {
            res.send({ "message": "ERROR" })
        }
    }
})


userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body
    let data = await UserModel.findOne({ email })
    try {
        bcrypt.compare(password, data.password, function (err, result) {
            if (result) {
                var token = jwt.sign({ userID: data._id }, 'masai');
                res.status(201).send({ "message": "Validation done", "token": token })
            }
            else {
                res.send({ "message": "INVALID credentials" })
            }
        });
    }
    catch (err) {
        res.send({ "message": "ERROR" })
    }
})


userRoute.patch("/user/:id/reset", async (req, res) => {
    const ID = req.params.id
    const { current_password, new_password } = req.body
    let data = await UserModel.findOne({ _id: ID })
    try {
        bcrypt.compare(current_password, data.password, function (err, result) {
            if (result) {
                // current_password matches 
                bcrypt.hash(new_password, 5, async function (err, hash) {
                    if (err) {
                        res.send({ "message": "ERROR" })
                    }
                    else {
                        let payload = { password: hash }
                        let userData = await UserModel.findOneAndUpdate({ _id: ID }, payload)
                        res.status(204).send({ "message": "Password Updated" })
                    }

                });
            }
            else {
                res.send({ "message": "INVALID credentials" })
            }
        });
    }
    catch (err) {
        res.send({ "message": "ERROR" })
    }
})





module.exports = {
    userRoute
}