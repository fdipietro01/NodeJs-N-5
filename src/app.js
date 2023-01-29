const express = require('express')
const productRouter = require("./routes/productRouter")
const cartRouter = require("./routes/cartRouter")

const app = express()
const PORT = 8080

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)

app.listen(PORT, () => {
    console.log("Escuchando en el 8080")
})
