const { Router } = require("express")

const viewsRouter = Router()

viewsRouter.get("/", async (req, res) => {
    try {
        const data = await req.productsManager.getProducts()
        const dataExist = data.length === 0 ? false : true
        res.render("home", {data, dataExist})
    }
    catch (err) {
        res.send({ error: err })
    }
})

viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const data = await req.productsManager.getProducts()
        const dataExist = data.length === 0 ? false : true
        res.render("realtime", {data, dataExist})
    }
    catch (err) {
        res.send({ error: err.message })
    }
})

module.exports = viewsRouter