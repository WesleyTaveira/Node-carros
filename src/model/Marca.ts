 import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
 import { Carro } from "./Carro"; 

@Entity()
export class Marca {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @OneToMany(() => Carro, (carro) => carro.marca)
    carro: Carro[];

    
}

