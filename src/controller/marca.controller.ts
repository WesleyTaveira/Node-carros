import { Router } from "express";
import { Marca } from "../model/Marca";
import { AppDataSource } from "../data-source";

const MarcaRouter = Router();

const MarcaRepo = AppDataSource.getRepository(Marca);

MarcaRouter.get("/marca", async (req, res) => {
  try {
      const marcas = await MarcaRepo.find({
          relations: ['carros']
      });
      return res.status(200).json(marcas);
  } catch (error) {
    console.error("Erro ao buscar marcas:", error);
    return res.status(500).json({ error: "Erro ao buscar marcas" });
  }
})


MarcaRouter.post("/marca", async (req, res) => {
  try {
      const { nome } = req.body;
      
      
      // Verifica se já existe uma marca com o mesmo nome
      const marcaExistente = await MarcaRepo.findOne({
          where: { nome }
      });
      
      if (marcaExistente) {
          return res.status(409).json({ message: "Marca já existente." });
      }

      const novaMarca = MarcaRepo.create({
          nome
      });
      
      const marcaSalva = await MarcaRepo.save(novaMarca);
      
      return res.status(201).json(marcaSalva);
  } catch (error) {
    console.error("Erro ao criar marca:", error);
    return res.status(500).json({ error: "Erro ao criar marca" });
  }
});



MarcaRouter.get("/marca/:id", async (req, res) => {
try {
  const { id } = req.params;
  const MarcaRepo = AppDataSource.getRepository(Marca);
  
  const marca = await MarcaRepo.findOne({
      where: { id },
      relations: ['carros']
  });

  if (!marca) {
      return res.status(404).json({ error: true, message: 'Marca não existente!' });
  }
  
  return res.status(200).json(marca);
} catch (error) {
  console.error("Erro ao buscar marca:", error);
  return res.status(500).json({ error: "Erro ao buscar marca" });
}
}) 


MarcaRouter.put("/marca/:id", async (req, res) => {
try {
  const { id } = req.params;
  const { nome } = req.body;
  const MarcaRepo = AppDataSource.getRepository(Marca);
  
  const marca = await MarcaRepo.findOne({
      where: { id }
  });

  if (!marca) {
      return res.status(404).json({ error: true, message: 'Marca não existente!' });
  }

  marca.nome = nome;
  const marcaAtualizada = await MarcaRepo.save(marca);

  return res.status(200).json(marcaAtualizada);
} catch (error) {
  console.error("Erro ao atualizar marca:", error);
  return res.status(500).json({ error: "Erro ao atualizar marca" });
}
}) 

MarcaRouter.delete("/marca/:id", async (req, res) => {
try {
  const { id } = req.params;
  const MarcaRepo = AppDataSource.getRepository(Marca);
  
  const marca = await MarcaRepo.findOne({
      where: { id }
  });

  if (!marca) {
      return res.status(404).json({ error: true, message: 'Marca não existente!' });
  }

  await MarcaRepo.remove(marca);
  return res.status(204).send();
} catch (error) {
  console.error("Erro ao deletar marca:", error);
  return res.status(500).json({ error: "Erro ao deletar marca" });
}
}) 

export default MarcaRouter; 