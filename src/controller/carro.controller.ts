import { Router } from "express";
import {v4 as uuidV4} from "uuid";
import { Carro } from "../model/Carro";

const carRouter = Router();


let carros: Carro[] = []

carRouter.get("/carro", (req, res) => {
    return res.status(200).json(carros);
})


carRouter.post("/carro", (req, res) =>{
    const { placa, ano, marca } = req.body;
    const carroComMesmaPlaca = carros.find(carro => carro.placa === placa);

    if (carroComMesmaPlaca) {
        return res.status(409).json({ message: "Já existe um carro cadastrado com esta placa." });
    }

    const novoCarro: Carro = {
        id: uuidV4(),
        placa,
        ano,
        marca
    };
    
    carros.push(novoCarro);
    
    return res.status(201).json(novoCarro);
});



carRouter.get("/carro/:id", (req, res) => {
  const{ id } = req.params;
  const carro = carros.find(carro => carro.id === id)

  if(!carro)
     return res.status(404).json({error: true, message: 'Carro não existente!'})
  
  return res.status(404).json(carro)
}) 


carRouter.put("/carro/:id", (req, res) => {
  const{ id } = req.params;
  const {placa, ano, marca } = req.body;
  const carro = carros.find(carro => carro.id === id)

  if (!carro)
    return res.status(404).json({ error: true, message: 'Carro não existente!'});

  Object.assign(carro, {
    placa,
    ano,
    marca,

  })

  return res.status(200).json(carro);
}) 
carRouter.delete("/carro/:id", (req, res) => {
  const{ id } = req.params;
  const carro = carros.find(carro => carro.id === id)

  if (!carro)
    return res.status(404).json({ error: true, message: 'Carro não existente!'})

  const novoCarro = carros.filter(carro => carro.id !== id)
  carros = novoCarro;

  return res.status(204).send();
}) 

export default carRouter; 