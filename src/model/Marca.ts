 import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
 import { Carro } from "./Carro"

@Entity()
export class Marca {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    nome!: string;

    @OneToMany(() => Carro, (carro: Carro) => carro.marca)
    carros!: Carro[];

    
}

