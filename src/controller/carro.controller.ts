import { Router } from "express"
import {v4 as uuidV4} from 'uuid'
import { Carro } from "src/model/Carro"

const router = Router();


let carros: Carro[] = [];

router.get("/carro", (req, res) => {
    return res.status(200).send("Olá mundo!")
})

 router.get("/:id", (req, res) => {
    const{id} = req.params;
    const carro = carros.find(carro => carro.id === id)
}) 
                                                         
router.post("/carro", (req, res) =>{
    const carro = req.body                      
    carro.id = uuidV4();
    carros.push(carro)
   
  res.status(201).json(carro)
});


                                         
export default { router } 