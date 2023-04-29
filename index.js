const express = require("express")
const app = express()
app.use(express.json())

const { connection } = require("./config/db")
const { userRoute } = require("./route/userroute")
const { restRoute } = require("./route/restroute")
const { orderRoute } = require("./route/orderroute")


app.get("/", async (req, res) => {
    res.send("Welcome to Backend")
})

app.use("/", userRoute)
app.use("/restaurants", restRoute)
app.use("/orders", orderRoute)

app.listen(4500, async (req, res) => {
    try {
        await connection;
        console.log("DB is connected")
    }
    catch (error) {
        console.log("DB is not connected", error)
    }
    console.log("Listening at Port 4500")
})

