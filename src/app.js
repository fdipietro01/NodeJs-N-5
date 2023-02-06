const express = require('express')
const productRouter = require("./routes/productRouter")
const cartRouter = require("./routes/cartRouter")
const viewsRouter = require("./routes/viewsRouter")
const handlebars = require("express-handlebars")
const ProductManager = require("./classes/ProductManager")
const { Server } = require('socket.io')



const app = express()
const PORT = 8080

app.engine('handlebars', handlebars.engine())
app.set("views", __dirname + '/views')
app.set('view engine', 'handlebars')
app.use('/aleas', express.static(__dirname + "/public"))

const productManager = new ProductManager("./productos")

const attachProdInstance = (req, res, next) => {
    req.productsManager = productManager
    next()
}

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/", attachProdInstance, viewsRouter)

const httpServer = app.listen(PORT, () => {
    console.log("Escuchando en el 8080")
})

const socketServer = new Server(httpServer)

socketServer.on('connection', async (socket) => {
    console.log("Conexión establecida");

    socket.on('nuevoProducto', async (data) => {
        try {
            const { title, description, price, thumbnail, code, stock, category } = data
            await productManager.agregarProducto(title, description, code, price, true, stock, category, thumbnail)
            const prods = await productManager.getProducts()
            socket.emit("actualizarProductos", prods)
        }
        catch (err) {
            socket.emit("error", err.message)
        }
    })

    socket.on('eliminarProducto', async (data) => {
        try {
            await productManager.deleteProduct(data)
            const prods = await productManager.getProducts()
            socket.emit("actualizarProductos", prods)
        }
        catch (err) {
            socket.emit("error", err.message)
        }
    })
})