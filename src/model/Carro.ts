import { Entity, PrimaryGeneratedColumn, Column,  ManyToOne } from "typeorm";
import { Marca } from "./Marca";

@Entity()
export class Carro{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    placa: string;

    @Column()
    ano: number;

    @ManyToOne(() => Marca, (marca) => marca.carro)
    marca: Marca;



}