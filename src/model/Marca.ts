 import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
 import { Carro } from "./Carro"

@Entity()
export class Marca {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    marcacarros!: string;

    @OneToMany(() => Carro, (carro) => carro.marca)
    carros!: Carro[];

    
}

