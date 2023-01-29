const { Router } = require("express")
const CartManager = require("../classes/CartManager")

const cartRouter = Router()
const cartManager = new CartManager("./carritos")

cartRouter.post("/", async (req, res) => {
    try {
        const carritoAgregado = await cartManager.addCart()
        res.status(200).json({ agregado: carritoAgregado })
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

cartRouter.get("/:cid", async (req, res) => {
    const { cid } = req.params
    try{
        const productos = await cartManager.getCartProducts(Number(cid))
        res.status(200).send({productos})
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})

cartRouter.post("/:cid/product/:pid", async (req, res)=>{
    const {cid, pid} = req.params
    try{
        const newCart = await cartManager.addProdToCart(Number(cid), Number(pid)) 
        return res.status(200).send(newCart)
    }
    catch(err){
        res.status(400).send(err.message)
    }
})

module.exports = cartRouter