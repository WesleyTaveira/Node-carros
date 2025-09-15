import express from 'express';
import router from './controller';

const app = express();

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
});  