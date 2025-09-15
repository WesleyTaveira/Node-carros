import { Router } from "express";
import {v4 as uuidV4} from "uuid";
import { Marca } from "../model/Marca";

const MarcaRouter = Router();


let marcas: Marca[] = []

MarcaRouter.get("/marca", (req, res) => {
    return res.status(200).json(marcas);
})


MarcaRouter.post("/marca", (req, res) =>{
    const {nome, carros } = req.body;
    const marcaComMesmoNome = marcas.find(marca => marca.nome === nome);

    if (marcaComMesmoNome) {
        return res.status(409).json({ message: "Marca já existente." });
    }

    const novaMarca: Marca = {
        id: uuidV4(),
        nome,
        carros,
        
    };
    
    marcas.push(novaMarca);
    
    return res.status(201).json(novaMarca);
});



MarcaRouter.get("/marca/:id", (req, res) => {
  const{ id } = req.params;
  const marca = marcas.find(marca => marca.id === id)

  if(!marca)
     return res.status(404).json({error: true, message: 'Marca não existente!'})
  
  return res.status(404).json(marca)
}) 


MarcaRouter.put("/marca/:id", (req, res) => {
  const{ id } = req.params;
  const {nome, carros } = req.body;
  const marca = marcas.find(marca => marca.id === id)

  if (!marca)
    return res.status(404).json({ error: true, message: 'Marca não existente!'});

  Object.assign(marca, {
        nome,
        carros,
  })

  return res.status(200).json(marca);
}) 
MarcaRouter.delete("/marca/:id", (req, res) => {
  const{ id } = req.params;
  const marca = marcas.find(marca => marca.id === id)

  if (!marca)
    return res.status(404).json({ error: true, message: 'Marca não existente!'})

  const novoCarro = marcas.filter(marca => marca.id !== id)
  marcas = novoCarro;

  return res.status(204).send();
}) 

export default MarcaRouter; 