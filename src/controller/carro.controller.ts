import { Router } from "express"

const router = Router();

router.get("/carro", (req, res) => {
    return res.status(200).send("Olá mundo!")
})

/* router.get("/:id/visualizar", (req, res) => {
    return res.status(200).send(req.params.id)
}) */

router.post("/carro", (req, res) =>{
    const {id, placa, ano, marca} = req.body

    return res.status(201).send()
})

export default { router } 