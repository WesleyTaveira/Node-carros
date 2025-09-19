import express from 'express';
import router from './controller';
import { AppDataSource } from "./data-source";


AppDataSource.initialize()
    .then(() => {
        console.log(" Conexão com o banco de dados estabelecida com sucesso!");

        const app = express();
        
        // Configurar middlewares antes das rotas
        app.use(express.json());
        
        // Middleware para tratar erros de JSON malformado
        app.use((error: any, req: any, res: any, next: any) => {
            if (error instanceof SyntaxError && 'body' in error) {
                return res.status(400).json({ 
                    error: 'JSON malformado',
                    message: 'Verifique se o JSON está correto'
                });
            }
            next();
        });
        
        app.get("/", (req,res) => {
            const valor = req.query.valor;
            console.log("valor >>>",valor)
            return res.status(200).json({
                status: true,
                value: valor
            })
        })
        
        // Usa as rotas
        app.use(router);

        const PORT = process.env.PORT || 3333;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => console.log("Erro ao conectar com o banco de dados:", error));