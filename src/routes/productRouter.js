const { Router } = require("express")

const productsRouter = Router()

productsRouter.get("/", async (req, res) => {
    const { limit } = req.query
    const productos = await productManager.getProducts()
    if (!limit) return res.send({ productos })
    res.json({ status: "success", payload: productos.slice(0, limit) })
})

productsRouter.get("/:pid", async (req, res) => {
    const { pid } = req.params
    const productos = await productManager.getProducts()
    const filtrado = productos.find(prd => prd.id === Number(pid))
    return filtrado ? res.send({ status: "success", payload: filtrado }) : res.json({ Error: "No se encontró producto" })
})
productsRouter.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    if (!title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).send("Enviar campos obligatorios")
    }
    try {
        const prodAgregado = await productManager.agregarProducto(title, description, code, price, status, stock, category, thumbnails)
        res.status(200).json({ agregado: prodAgregado })
    }
    catch(err){
        res.status(400).send(err.message)
    }

})

productsRouter.put("/:pid", async (req, res)=>{
    const { pid } = req.params
    const newProd = req.body
    if(Object.keys(newProd).length === 0) return res.status(400).send("Enviar producto a actualizar")
    try{
        const updated = await productManager.updateProduct(pid, newProd)
        res.status(200).json({actualizado: updated})
    }
    catch(err){
        res.status(400).send(err.message)
    }
})

productsRouter.delete("/:pid", async(req, res)=>{
    const {pid} = req.params
    try{
        const deleted = await productManager.deleteProduct(pid)
        res.status(200).json({eliminado: deleted})
    }
    catch(err){
        res.status(400).send(err.message)
    }
}
)

module.exports = productsRouter