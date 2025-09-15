"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carro = void 0;
const typeorm_1 = require("typeorm");
const Marca_1 = require("./Marca");
@(0, typeorm_1.Entity)()
class Carro {
    @(0, typeorm_1.PrimaryGeneratedColumn)()
    id;
    @(0, typeorm_1.Column)()
    placa;
    @(0, typeorm_1.Column)()
    ano;
    @(0, typeorm_1.ManyToOne)(() => Marca_1.Marca, (marca) => marca.carro)
    marca;
}
exports.Carro = Carro;
//# sourceMappingURL=Carro.js.map