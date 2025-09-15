"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const Carro_1 = require("../model/Carro");
const carRouter = (0, express_1.Router)();
let carros = [];
carRouter.get("/carro", (req, res) => {
    return res.status(200).send("Olá mundo!");
});
carRouter.post("/carro", (req, res) => {
    const carro = req.body;
    carro.id = (0, uuid_1.v4)();
    carros.push(carro);
    res.status(201).json(carro);
});
carRouter.get("/carro/:id", (req, res) => {
    const { id } = req.params;
    const carro = carros.find(carro => carro.id === id);
    if (!carro)
        res.status(404).json({ error: true, message: 'Carro não existente!' });
    res.status(404).json(carro);
});
carRouter.put("/carro/:id", (req, res) => {
    const { id } = req.params;
    const { placa, ano, marca } = req.body;
    const carro = carros.find(carro => carro.id === id);
    if (!carro)
        res.status(404).json({ error: true, message: 'Carro não existente!' });
    Object.assign(carro, {
        placa,
        ano,
        marca,
    });
    res.status(200).json(carro);
});
carRouter.delete("/carro/:id", (req, res) => {
    const { id } = req.params;
    const carro = carros.find(carro => carro.id === id);
    if (!carro)
        res.status(404).json({ error: true, message: 'Carro não existente!' });
    const novoCarro = carros.filter(carro => carro.id !== id);
    carros = novoCarro;
    res.status(204).send();
});
exports.default = carRouter;
//# sourceMappingURL=carro.controller.js.map