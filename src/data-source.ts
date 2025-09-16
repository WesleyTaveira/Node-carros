import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbDatabase = process.env.DB_DATABASE;

// 2. Verifique se todas as variáveis essenciais foram definidas
if (!dbHost || !dbPort || !dbUser || !dbPassword || !dbDatabase) {
    throw new Error("Uma ou mais variáveis de ambiente do banco de dados não foram definidas. Verifique seu arquivo .env");
}


export const AppDataSource = new DataSource({
    type: "postgres",
    host: dbHost, // Lê do ambiente
    port: Number(dbPort), // Lê do ambiente
    username: dbUser,   // Lê do ambiente
    password: dbPassword, // Lê do ambiente
    database: dbDatabase, // Lê do ambiente
    synchronize: true,
    logging: false,
    
    entities: [
        path.join(__dirname, 'model', '**', '*.{ts,js}')
    ],
    migrations: [],
    subscribers: [],
    
});