"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    const valor = req.query.valor;
    console.log("valor >>>", valor);
    return res.status(200).json({
        status: true,
        value: valor
    });
});
app.listen(3333, () => {
    console.log('server 3333');
});
//# sourceMappingURL=server.js.map