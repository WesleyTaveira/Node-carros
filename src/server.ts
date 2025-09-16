import express from 'express';
import router from './controller';
import { AppDataSource } from "./data-source";

/* const app = express();

app.use(express.json());
app.get("/", (req,res) => {
    const valor = req.query.valor;
    console.log("valor >>>",valor)
    return res.status(200).json({
        status: true,
        value: valor
    })
})

app.use(router);
app.listen(3333, () => {
    console.log('server 3333')
});  */

AppDataSource.initialize()
    .then(() => {
        console.log(" Conexão com o banco de dados estabelecida com sucesso!");

        const app = express();
        
        app.get("/", (req,res) => {
            const valor = req.query.valor;
            console.log("valor >>>",valor)
            return res.status(200).json({
                status: true,
                value: valor
            })
        })
        
        app.use(express.json());
        
        // Usa as rotas
        app.use(router);

        const PORT = process.env.PORT || 3333;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => console.log("Erro ao conectar com o banco de dados:", error));