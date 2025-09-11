import express from 'express';
import carroController from "./src/controller/carro.controller.ts"

const app = express();

/* app.use((req,res, next) => {
    req.query.valor = 500;
    console.log("query", req.query)
    return res.status(200).json({status:2})
    next()
})

app.use("/carro",carroController.router) */

app.get("/carro", (req,res) => {
    const valor = req.query.valor;
    console.log("valor >>>",valor)
    return res.status(200).json({
        status: true,
        value: valor
    })
})

app.listen(3333, () => {
    console.log('server 3333')
});