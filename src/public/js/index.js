console.log("js");
const server = io()

const handleAlert = (data) => {
    if (data.length === 0) {
        const newAlert = document.createElement("div")
        newAlert.innerHTML = `<div id="alert" class="alert alert-danger mx-auto" style="width: 400px" role="alert">
        <span class="mx-auto"> No existen productos agregados por el momento.</span>
        </div>`
        const container = document.getElementById("alertContainer")
        container.appendChild(newAlert)
    }
    else {
        const alert = document.getElementById("boxAlert")
        alert && alert.remove()
    }
}

document.addEventListener("submit", (e) => {
    e.preventDefault()
    if (e.target.id === "form1") {
        const form = document.getElementById("form1")
        const { elements } = form
        const prod = {
            title: elements['titulo'].value,
            description: elements['descripción'].value,
            price: elements['precio'].value,
            thumbnail: elements['thumbnail'].value,
            code: elements['código'].value,
            stock: elements['stock'].value,
            category: elements['categoría'].value,
        }
        const uncompleteForm = Object.values(prod).some(val => val === undefined || val === "")
        if (uncompleteForm) window.alert("Ingrese todos los campos del formulario")
        else {
            server.emit("nuevoProducto", prod)
            form.reset()
        }
    }
    if (e.target.id === "form2") {
        const form = document.getElementById("form2")
        const id = form.elements["eliminarId"].value
        const tbody = document.getElementById("body")
        const tableIds = Array.from(tbody.children).map(tableRow => tableRow.lastElementChild.innerText)
        if (tableIds.some(tableId => tableId === id)) {
            server.emit("eliminarProducto", id)
        }
        else {
            form.reset()
            window.alert(`No existe producto con el id ${id}`)
        }
    }
})

server.on("error", (err) => {
    if (err === "Producto con código duplicado")
        window.alert(err)
})

server.on("actualizarProductos", (data) => {
    handleAlert(data)
    const table = document.getElementById("tableProd")
    const tableBody = document.getElementById("body")
    tableBody.remove()
    const newBody = document.createElement("tbody")

    const newBodyContent = `<tbody>
    ${data.map(prod => {
        return `<tr>
    <td>${prod.title}</td>
    <td>${prod.description}</td>
    <td>${prod.price}</td>
    <td>${prod.code}</td>
    <td>${prod.thumbnail}</td>
    <td>${prod.stock}</td>
    <td>${prod.category}</td>
    <td>${prod.status}</td>
    <td>${prod.id}</td>
    </tr>`}).join(" ")} 
    </tbody>`
    newBody.innerHTML = newBodyContent
    table.appendChild(newBody)
    table.lastElementChild.id = "body"
})