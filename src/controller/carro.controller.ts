import { Router } from "express"
import {v4 as uuidV4} from 'uuid'
import { Carro } from "src/model/Carro"

const router = Router();


let carros: Carro[] = []

router.get("/carro", (req, res) => {
    return res.status(200).send("Olá mundo!")
})


router.post("/carro", (req, res) =>{
    const {id, placa, ano, marca} = req.body
    const carro = req.body                      
    carro.id = uuidV4();
    carros.push(carro)
   
  res.status(201).json(carro)
});



router.get("/carro/:id", (req, res) => {
  const{ id } = req.params;
  const carro = carros.find(carro => carro.id === id)
}) 


router.put("/carro/:id", (req, res) => {
  const{ id } = req.params;
  const {placa, ano, marca }= req.body;
  const carro = carros.find(carro => carro.id === id)
}) 

router.delete("/carro/:id", (req, res) => {
  const{ id } = req.params;
  const {placa, ano, marca }= req.body;
  const novoCarro = carros.filter(carro => carro.id !== id)
}) 

export default { router } 