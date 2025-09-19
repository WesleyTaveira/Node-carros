import { Router, Request, Response } from "express";
import { Carro } from "../model/Carro";
import { Marca } from "../model/Marca";
import { AppDataSource } from "../data-source";

const carRouter = Router();



carRouter.get("/carro", async (req: Request, res: Response) => {
  try {
    const CarroRepo = AppDataSource.getRepository(Carro);
    const carros = await CarroRepo.find({
         relations: ['marca']
      });
      return res.status(200).json(carros);
    } catch (error) {
      console.error("Erro ao buscar carros:", error);
      return res.status(500).json({error: "Erro ao buscar carros"})
    }
})


carRouter.post("/carro", async (req: Request, res: Response) => {
  try {
    const { placa, ano, modelo, marca } = req.body;
    
    console.log("Dados recebidos:", { placa, ano, modelo, marca });
    
    // Validações básicas
    if (!placa || !ano || !modelo || !marca) {
      return res.status(400).json({ 
        error: "Dados obrigatórios não fornecidos",
        message: "placa, ano, modelo e marca são obrigatórios"
      });
    }
    
    if (typeof ano !== 'number' || ano < 1900 || ano > new Date().getFullYear() + 1) {
      return res.status(400).json({ 
        error: "Ano inválido",
        message: "O ano deve ser um número válido entre 1900 e " + (new Date().getFullYear() + 1)
      });
    }
    
    // Criar instâncias frescas dos repositórios para cada requisição
    const CarroRepo = AppDataSource.getRepository(Carro);
    const MarcaRepo = AppDataSource.getRepository(Marca);
    
    const carroComMesmaPlaca = await CarroRepo.findOne({
      where: {placa}
    });

    if (carroComMesmaPlaca) {
        console.log("Carro com placa duplicada encontrado:", carroComMesmaPlaca);
        return res.status(409).json({ message: "Já existe um carro cadastrado com esta placa." });
    }

    const marcaEncontrada = await MarcaRepo.findOne({
      where: {id: marca}
    })

    if (!marcaEncontrada) {
      return res.status(404).json({ message: "Marca não encontrada." });
    }

    // Criar uma nova instância do carro
    const novoCarro = new Carro();
    novoCarro.placa = placa;
    novoCarro.ano = ano;
    novoCarro.modelo = modelo;
    novoCarro.marca = marcaEncontrada;
    
    console.log("Novo carro criado (antes de salvar):", {
        placa: novoCarro.placa,
        ano: novoCarro.ano,
        modelo: novoCarro.modelo,
        marcaId: novoCarro.marca.id,
        marcaNome: novoCarro.marca.nome
    });
    
    // Usar save() para gerenciar relacionamentos corretamente
    const carroSalvo = await CarroRepo.save(novoCarro);
    
    console.log("Carro salvo no banco:", {
        id: carroSalvo.id,
        placa: carroSalvo.placa,
        ano: carroSalvo.ano,
        modelo: carroSalvo.modelo,
        marcaId: carroSalvo.marca.id,
        marcaNome: carroSalvo.marca.nome
    });
    
    return res.status(201).json(carroSalvo);
  } catch (error) {
    console.error("Erro ao criar carro:", error);
    return res.status(500).json({
      error: "Erro ao criar carro",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    })
  }
    
});



carRouter.get("/carro/:id", async (req: Request, res: Response) => {
  try {
  const{ id } = req.params;
  
  if (!id) {
    return res.status(400).json({ error: true, message: 'ID é obrigatório!' });
  }
  
  const CarroRepo = AppDataSource.getRepository(Carro);
  const carro = await CarroRepo.findOne({
    where: { id },
    relations: [ 'marca' ]
  });

  if(!carro) {
     return res.status(404).json({error: true, message: 'Carro não existente!'})
  }

  return res.status(200).json(carro)

  } catch (error) {
    console.error("Erro ao consultar carro:", error);
    return res.status(500).json({error: "Erro ao consultar carro"})
  } 
}); 


carRouter.put("/carro/:id", async (req: Request, res: Response) => {
  try {
    const{ id } = req.params;
    const {placa, ano, modelo, marcaId } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: true, message: 'ID é obrigatório!' });
    }
    
    const CarroRepo = AppDataSource.getRepository(Carro);
    const MarcaRepo = AppDataSource.getRepository(Marca);
    
    const carro = await CarroRepo.findOne({  
      where: { id },
      relations: [ 'marca' ]
    });
  
    if (!carro) {
      return res.status(404).json({ error: true, message: 'Carro não existente!'});
    }

    if (marcaId) {
      const marca = await MarcaRepo.findOne({
        where: {id: marcaId}
      });
    
      if (!marca) {
        return res.status(404).json({ message: "Carro não encontrado." });
    }

      carro.marca = marca;
    }

    carro.placa = placa;
    carro.ano = ano;
    carro.modelo = modelo;
    
    const carroAtualizado = await CarroRepo.save(carro);

    return res.status(200).json(carroAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar carro:", error);
    return res.status(500).json({error: "Erro ao atualizar carro"})

  }

});
  
carRouter.delete("/carro/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: true, message: 'ID é obrigatório!' });
    }
    
    const CarroRepo = AppDataSource.getRepository(Carro);
    
    const carro = await CarroRepo.findOne({
        where: { id }
    });

    if (!carro) {
        return res.status(404).json({ error: true, message: 'Carro não existente!' });
    }

    await CarroRepo.remove(carro);
    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar carro:", error);
    return res.status(500).json({ error: "Erro ao deletar carro" });
  }
}) 

export default carRouter; 