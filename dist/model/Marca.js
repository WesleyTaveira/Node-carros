"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marca = void 0;
const typeorm_1 = require("typeorm");
const Carro_1 = require("./Carro");
@(0, typeorm_1.Entity)()
class Marca {
    @(0, typeorm_1.PrimaryGeneratedColumn)()
    id;
    @(0, typeorm_1.Column)()
    nome;
    @(0, typeorm_1.OneToMany)(() => Carro_1.Carro, (carro) => carro.marca)
    carro;
}
exports.Marca = Marca;
//# sourceMappingURL=Marca.js.map