import { Router, Request, Response } from "express";
import { Marca } from "../model/Marca";
import { AppDataSource } from "../data-source";

const MarcaRouter = Router();

MarcaRouter.get("/marca", async (req: Request, res: Response) => {
  try {
      const MarcaRepo = AppDataSource.getRepository(Marca);
      const marcas = await MarcaRepo.find({
          relations: ['carros']
      });
      return res.status(200).json(marcas);
  } catch (error) {
    console.error("Erro ao buscar marcas:", error);
    return res.status(500).json({ error: "Erro ao buscar marcas" });
  }
})


MarcaRouter.post("/marca", async (req: Request, res: Response) => {
  try {
      const { nome } = req.body;
      
      console.log("Dados recebidos para nova marca:", { nome });
      
      const MarcaRepo = AppDataSource.getRepository(Marca);
      
      
      const marcaExistente = await MarcaRepo.findOne({
          where: { nome }
      });
      
      if (marcaExistente) {
          console.log("Marca com nome duplicado encontrada:", marcaExistente);
          return res.status(409).json({ message: "Marca já existente." });
      }

      
      const novaMarca = new Marca();
      novaMarca.nome = nome;
      
      console.log("Nova marca criada (antes de salvar):", { nome: novaMarca.nome });
      
      
      const marcaSalva = await MarcaRepo.save(novaMarca);
      
      console.log("Marca salva no banco:", { id: marcaSalva.id, nome: marcaSalva.nome });
      
      return res.status(201).json(marcaSalva);
  } catch (error) {
    console.error("Erro ao criar marca:", error);
    return res.status(500).json({ error: "Erro ao criar marca" });
  }
});



MarcaRouter.get("/marca/:id", async (req: Request, res: Response) => {
try {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ error: true, message: 'ID é obrigatório!' });
  }
  
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


MarcaRouter.put("/marca/:id", async (req: Request, res: Response) => {
try {
  const { id } = req.params;
  const { nome } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: true, message: 'ID é obrigatório!' });
  }
  
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

MarcaRouter.delete("/marca/:id", async (req: Request, res: Response) => {
try {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ error: true, message: 'ID é obrigatório!' });
  }
  
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