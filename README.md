<div align="center">

# Node Carros API

**API REST para gerenciamento de carros e marcas automotivas**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3.x-FE0803?logo=typeorm&logoColor=white)](https://typeorm.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![License](https://img.shields.io/badge/License-MIT-green)](#licença)

</div>

---

## Visão Geral

A **Node Carros API** é uma aplicação backend RESTful construída com [Express 5](https://expressjs.com) e [TypeORM](https://typeorm.io) sobre **PostgreSQL**, escrita em **TypeScript**. Ela permite operações completas de CRUD (criar, listar, buscar, atualizar e remover) para as entidades **Carro** e **Marca**, incluindo o relacionamento entre elas (uma marca possui vários carros).

O projeto é totalmente containerizado com **Docker** e **Docker Compose**, usando um **build multi-stage** que gera uma imagem final enxuta, contendo apenas o JavaScript compilado e as dependências de produção.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Rodando o Projeto](#rodando-o-projeto)
  - [Modo Local (recomendado para desenvolvimento)](#modo-local-recomendado-para-desenvolvimento)
  - [Modo Docker Completo](#modo-docker-completo)
  - [Build de Produção sem Docker](#build-de-produção-sem-docker)
- [Documentação da API](#documentação-da-api)
  - [Health Check](#health-check)
  - [Marcas](#marcas)
  - [Carros](#carros)
  - [Formato de Erros](#formato-de-erros)
- [Exemplos com cURL](#exemplos-com-curl)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Modelos de Dados](#modelos-de-dados)
- [Docker em Detalhes](#docker-em-detalhes)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Limitações Conhecidas e Roadmap](#limitações-conhecidas-e-roadmap)
- [Solução de Problemas](#solução-de-problemas)

---

## Funcionalidades

- **CRUD completo** de Carros e Marcas
- **Relacionamento 1:N** entre Marca e Carro, com carregamento das relações nas consultas
- **Identificadores UUID** gerados automaticamente pelo banco
- **Validações de negócio** no cadastro de carros:
  - campos obrigatórios (`placa`, `ano`, `modelo`, `marca`)
  - `ano` numérico entre `1900` e o ano seguinte ao atual
  - **placa única** (retorna `409 Conflict` em caso de duplicidade)
  - marca precisa existir (retorna `404 Not Found` caso contrário)
- **Nome de marca único** (retorna `409 Conflict` em caso de duplicidade)
- **Tratamento de JSON malformado** com resposta `400` amigável
- **Tratamento de erros** com `try/catch` em todas as rotas e log no console
- **Validação de variáveis de ambiente** na inicialização (falha rápida com mensagem clara)
- **Sincronização automática do schema** (`synchronize: true`) — as tabelas são criadas na primeira execução
- **Hot reload** em desenvolvimento com `ts-node-dev`, com inspector do Node habilitado para debug
- **Docker multi-stage** com imagem final apenas com dependências de produção

---

## Arquitetura

O projeto segue uma arquitetura em camadas simples, no estilo **MVC sem views**, adequada a APIs pequenas e médias:

```
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER                                  │
│   server.ts — inicializa o banco, middlewares e sobe o Express  │
├─────────────────────────────────────────────────────────────────┤
│                       CONTROLLERS                               │
│   Routers Express · validações · regras de negócio · respostas  │
├─────────────────────────────────────────────────────────────────┤
│                         MODELS                                  │
│   Entidades TypeORM (Carro, Marca) e seus relacionamentos       │
├─────────────────────────────────────────────────────────────────┤
│                       DATA SOURCE                               │
│   data-source.ts — conexão TypeORM com PostgreSQL via .env      │
└─────────────────────────────────────────────────────────────────┘
```

**Fluxo de uma requisição:**

```
Cliente HTTP
   │
   ▼
express.json()  ──(JSON inválido)──►  400 "JSON malformado"
   │
   ▼
Router (controller/index.ts)
   │
   ├──► carro.controller.ts ──┐
   └──► marca.controller.ts ──┤
                              ▼
               AppDataSource.getRepository(Entidade)
                              │
                              ▼
                         PostgreSQL
```

**Decisões de design:**

- **Repositório por requisição** — cada handler obtém o repositório via `AppDataSource.getRepository()` no momento da chamada, evitando estado compartilhado entre requisições
- **Inicialização ordenada** — o servidor HTTP só começa a escutar **depois** que a conexão com o banco é estabelecida
- **Fail Fast** — se alguma variável de banco estiver ausente, a aplicação lança um erro descritivo antes de tentar conectar
- **Roteamento modular** — cada recurso tem seu próprio `Router`, agregados em `controller/index.ts`

---

## Tecnologias

| Categoria | Tecnologia | Versão |
|-----------|-----------|--------|
| Runtime | Node.js | 18+ (imagem Docker: `node:18-alpine`) |
| Framework HTTP | Express | 5.x |
| Linguagem | TypeScript | 5.9 |
| ORM | TypeORM | 0.3.x |
| Driver do banco | pg | 8.x |
| Banco de dados | PostgreSQL | `latest` (imagem oficial) |
| Variáveis de ambiente | dotenv | 17.x |
| Metadados de decorators | reflect-metadata | 0.2.x |
| Dev server | ts-node-dev | 2.x |
| Containerização | Docker + Docker Compose | — |

---

## Pré-requisitos

Antes de começar, garanta que você tem instalado:

- **Node.js** >= 18 — [download](https://nodejs.org)
- **npm** >= 9
- **Docker** e **Docker Compose** — [download](https://www.docker.com/get-started) *(recomendado para o banco de dados)*
- **Git** — [download](https://git-scm.com)

> Alternativamente, você pode usar um PostgreSQL instalado localmente em vez do container.

Verifique suas versões:

```bash
node -v            # v18.x.x ou superior
npm -v             # 9.x.x ou superior
docker -v          # Docker version 2x.x.x
docker compose version
```

---

## Configuração do Ambiente

### 1. Clone o repositório

```bash
git clone https://github.com/WesleyTaveira/Node-carros.git
cd Node-carros
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
# Configurações do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5433          # 5433 se usar o Postgres do docker-compose; 5432 para Postgres local
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=node_carros

# Opcional — porta HTTP da API (padrão: 3333)
PORT=3333
```

> **Atenção à porta:** o `docker-compose.yml` expõe o PostgreSQL na porta **`5433`** do host (para não conflitar com um Postgres local em `5432`). Se você roda a API localmente usando o banco do Compose, use `DB_PORT=5433`.

> **Importante:** nunca comite o arquivo `.env` real. O `.gitignore` já o exclui.

---

## Rodando o Projeto

### Modo Local (recomendado para desenvolvimento)

Sobe apenas o banco via Docker e roda a API direto na sua máquina, com hot reload e debugger.

**Passo 1** — Suba o container do PostgreSQL:

```bash
docker compose up -d db
```

**Passo 2** — Garanta que o `.env` aponta para ele (`DB_HOST=localhost`, `DB_PORT=5433`).

**Passo 3** — Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Saída esperada:

```
 Conexão com o banco de dados estabelecida com sucesso!
Servidor rodando na porta 3333
```

A API estará disponível em: `http://localhost:3333`

> O script `dev` usa `--inspect`, então o inspector do Node fica disponível em `127.0.0.1:9229`. Você pode anexar o debugger do VS Code ou abrir `chrome://inspect`.

---

### Modo Docker Completo

Roda o banco **e** a API em containers. Ideal para simular o ambiente de produção.

**Passo 1** — Garanta que o `.env` contém `DB_USER`, `DB_PASSWORD` e `DB_DATABASE` (o Compose usa esses valores tanto no Postgres quanto na API).

**Passo 2** — Suba todos os serviços:

```bash
docker compose up --build
```

Para rodar em background:

```bash
docker compose up --build -d
```

Para acompanhar os logs da API:

```bash
docker compose logs -f app
```

Para parar e remover os containers:

```bash
docker compose down
```

Para parar e remover os containers **e os volumes** (apaga os dados do banco):

```bash
docker compose down -v
```

**Portas expostas:**

| Serviço | Container | Porta interna | Porta no host |
|---------|-----------|:---:|:---:|
| API (`app`) | `meu_app` | 3333 | 3333 |
| PostgreSQL (`db`) | `my-postgres` | 5432 | 5433 |

> Dentro da rede do Compose, a API se conecta ao banco via `DB_HOST=db` e `DB_PORT=5432` — esses valores são injetados pelo próprio `docker-compose.yml` e sobrescrevem o `.env`.

---

### Build de Produção sem Docker

```bash
npm run build          # compila src/ → dist/
node dist/server.js    # inicia a versão compilada
```

---

## Documentação da API

**Base URL:** `http://localhost:3333`

Todas as requisições e respostas usam `Content-Type: application/json`. Os IDs são **UUIDs v4** gerados pelo banco.

### Resumo dos Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/` | Health check |
| `GET` | `/marca` | Lista todas as marcas (com seus carros) |
| `POST` | `/marca` | Cadastra uma marca |
| `GET` | `/marca/:id` | Busca uma marca por ID (com seus carros) |
| `PUT` | `/marca/:id` | Atualiza uma marca |
| `DELETE` | `/marca/:id` | Remove uma marca |
| `GET` | `/carro` | Lista todos os carros (com sua marca) |
| `POST` | `/carro` | Cadastra um carro |
| `GET` | `/carro/:id` | Busca um carro por ID (com sua marca) |
| `PUT` | `/carro/:id` | Atualiza um carro |
| `DELETE` | `/carro/:id` | Remove um carro |

---

### Health Check

#### `GET /` — Verificar se a API está no ar

Aceita um query param opcional `valor`, que é devolvido na resposta (útil para testes rápidos).

**Exemplo:** `GET /?valor=teste`

**Resposta `200`:**
```json
{
  "status": true,
  "value": "teste"
}
```

---

### Marcas

#### `POST /marca` — Cadastrar marca

**Body:**
```json
{ "nome": "Toyota" }
```

**Resposta `201`:**
```json
{
  "id": "3f1c2a9e-7b4d-4e8a-9c21-5a6b7c8d9e0f",
  "nome": "Toyota"
}
```

| Status | Descrição |
|--------|-----------|
| `409` | Já existe uma marca com esse nome — `{ "message": "Marca já existente." }` |
| `500` | Erro ao criar marca |

---

#### `GET /marca` — Listar todas as marcas

Retorna as marcas com o array `carros` carregado.

**Resposta `200`:**
```json
[
  {
    "id": "3f1c2a9e-7b4d-4e8a-9c21-5a6b7c8d9e0f",
    "nome": "Toyota",
    "carros": [
      {
        "id": "a8b7c6d5-1e2f-4a3b-8c9d-0e1f2a3b4c5d",
        "placa": "ABC1D23",
        "ano": 2020,
        "modelo": "Corolla"
      }
    ]
  }
]
```

---

#### `GET /marca/:id` — Buscar marca por ID

**Resposta `200`:** mesmo formato de um item da listagem acima (incluindo `carros`).

| Status | Descrição |
|--------|-----------|
| `404` | `{ "error": true, "message": "Marca não existente!" }` |
| `500` | Erro ao buscar marca (inclui ID que não é um UUID válido) |

---

#### `PUT /marca/:id` — Atualizar marca

**Body:**
```json
{ "nome": "Toyota Motors" }
```

**Resposta `200`:**
```json
{
  "id": "3f1c2a9e-7b4d-4e8a-9c21-5a6b7c8d9e0f",
  "nome": "Toyota Motors"
}
```

| Status | Descrição |
|--------|-----------|
| `404` | `{ "error": true, "message": "Marca não existente!" }` |
| `500` | Erro ao atualizar marca |

---

#### `DELETE /marca/:id` — Remover marca

**Resposta `204`:** sem corpo.

| Status | Descrição |
|--------|-----------|
| `404` | `{ "error": true, "message": "Marca não existente!" }` |
| `500` | Erro ao deletar marca — ocorre, por exemplo, se a marca ainda possui carros vinculados (restrição de chave estrangeira) |

> **Dica:** remova (ou reatribua) os carros de uma marca antes de excluí-la.

---

### Carros

#### `POST /carro` — Cadastrar carro

O campo `marca` recebe o **ID (UUID) da marca**.

**Body:**
```json
{
  "placa": "ABC1D23",
  "ano": 2020,
  "modelo": "Corolla",
  "marca": "3f1c2a9e-7b4d-4e8a-9c21-5a6b7c8d9e0f"
}
```

**Resposta `201`:**
```json
{
  "id": "a8b7c6d5-1e2f-4a3b-8c9d-0e1f2a3b4c5d",
  "placa": "ABC1D23",
  "ano": 2020,
  "modelo": "Corolla",
  "marca": {
    "id": "3f1c2a9e-7b4d-4e8a-9c21-5a6b7c8d9e0f",
    "nome": "Toyota"
  }
}
```

**Validações:**
- `placa`, `ano`, `modelo` e `marca` são obrigatórios
- `ano` deve ser do tipo **number** (não string) e estar entre `1900` e o ano atual + 1
- `placa` não pode estar cadastrada em outro carro
- `marca` deve referenciar uma marca existente

| Status | Descrição |
|--------|-----------|
| `400` | Campos obrigatórios ausentes — `{ "error": "Dados obrigatórios não fornecidos", "message": "..." }` |
| `400` | Ano inválido — `{ "error": "Ano inválido", "message": "O ano deve ser um número válido entre 1900 e ..." }` |
| `404` | `{ "message": "Marca não encontrada." }` |
| `409` | `{ "message": "Já existe um carro cadastrado com esta placa." }` |
| `500` | `{ "error": "Erro ao criar carro", "details": "<mensagem do erro>" }` |

---

#### `GET /carro` — Listar todos os carros

Retorna todos os carros com a `marca` associada.

**Resposta `200`:**
```json
[
  {
    "id": "a8b7c6d5-1e2f-4a3b-8c9d-0e1f2a3b4c5d",
    "placa": "ABC1D23",
    "ano": 2020,
    "modelo": "Corolla",
    "marca": {
      "id": "3f1c2a9e-7b4d-4e8a-9c21-5a6b7c8d9e0f",
      "nome": "Toyota"
    }
  }
]
```

---

#### `GET /carro/:id` — Buscar carro por ID

**Resposta `200`:** mesmo formato de um item da listagem acima.

| Status | Descrição |
|--------|-----------|
| `404` | `{ "error": true, "message": "Carro não existente!" }` |
| `500` | Erro ao consultar carro (inclui ID que não é um UUID válido) |

---

#### `PUT /carro/:id` — Atualizar carro

Diferente do cadastro, aqui a marca é informada no campo **`marcaId`** (opcional).

**Body:**
```json
{
  "placa": "XYZ9W87",
  "ano": 2021,
  "modelo": "Corolla Cross",
  "marcaId": "3f1c2a9e-7b4d-4e8a-9c21-5a6b7c8d9e0f"
}
```

**Resposta `200`:** o carro atualizado, com a `marca`.

| Status | Descrição |
|--------|-----------|
| `404` | Carro não encontrado — `{ "error": true, "message": "Carro não existente!" }` |
| `404` | `marcaId` informado não existe |
| `500` | Erro ao atualizar carro |

> **Recomendação:** envie sempre `placa`, `ano` e `modelo` no `PUT`. Este endpoint ainda não aplica as validações de ano e de placa duplicada feitas no `POST` (veja [Limitações Conhecidas](#limitações-conhecidas-e-roadmap)).

---

#### `DELETE /carro/:id` — Remover carro

**Resposta `204`:** sem corpo.

| Status | Descrição |
|--------|-----------|
| `404` | `{ "error": true, "message": "Carro não existente!" }` |
| `500` | Erro ao deletar carro |

---

### Formato de Erros

Os erros seguem, de forma geral, um destes formatos:

```json
{ "error": true, "message": "Carro não existente!" }
```

```json
{ "error": "Erro ao buscar carros" }
```

```json
{ "message": "Já existe um carro cadastrado com esta placa." }
```

Para requisições com corpo JSON inválido:

```json
{
  "error": "JSON malformado",
  "message": "Verifique se o JSON está correto"
}
```

---

## Exemplos com cURL

```bash
# Health check
curl "http://localhost:3333/?valor=ok"

# Criar uma marca
curl -X POST http://localhost:3333/marca \
  -H "Content-Type: application/json" \
  -d '{"nome": "Toyota"}'

# Listar marcas (copie o "id" retornado)
curl http://localhost:3333/marca

# Criar um carro vinculado à marca
curl -X POST http://localhost:3333/carro \
  -H "Content-Type: application/json" \
  -d '{"placa": "ABC1D23", "ano": 2020, "modelo": "Corolla", "marca": "<ID_DA_MARCA>"}'

# Atualizar um carro
curl -X PUT http://localhost:3333/carro/<ID_DO_CARRO> \
  -H "Content-Type: application/json" \
  -d '{"placa": "ABC1D23", "ano": 2021, "modelo": "Corolla Cross"}'

# Remover um carro
curl -X DELETE http://localhost:3333/carro/<ID_DO_CARRO>
```

> **No Windows (PowerShell)**, prefira `Invoke-RestMethod`:
>
> ```powershell
> Invoke-RestMethod -Method Post -Uri http://localhost:3333/marca `
>   -ContentType "application/json" -Body '{"nome": "Toyota"}'
> ```

---

## Estrutura do Projeto

```
Node-carros/
├── src/
│   ├── server.ts                    # Bootstrap: conecta ao banco, registra middlewares e rotas, sobe o Express
│   ├── data-source.ts               # DataSource TypeORM (PostgreSQL) + validação das variáveis de ambiente
│   │
│   ├── controller/                  # Camada HTTP (rotas + regras de negócio)
│   │   ├── index.ts                 # Agrega os routers de carro e marca
│   │   ├── carro.controller.ts      # CRUD /carro
│   │   └── marca.controller.ts      # CRUD /marca
│   │
│   └── model/                       # Entidades TypeORM
│       ├── Carro.ts                 # id, placa, ano, modelo, marca (ManyToOne)
│       └── Marca.ts                 # id, nome, carros (OneToMany)
│
├── dist/                            # Saída do build (gerada por `npm run build`, ignorada no git)
├── .env.example                     # Modelo das variáveis de ambiente
├── Dockerfile                       # Build multi-stage (builder + runner)
├── docker-compose.yml               # Serviços: db (PostgreSQL) e app (API)
├── tsconfig.json                    # Configuração do TypeScript (strict, decorators, NodeNext)
└── package.json
```

---

## Modelos de Dados

### Diagrama de Entidades

```
┌────────────────────┐
│       Marca        │
├────────────────────┤
│ id (PK, uuid)      │
│ nome               │
└─────────┬──────────┘
          │ 1
          │
          │ N
┌─────────┴──────────┐
│       Carro        │
├────────────────────┤
│ id (PK, uuid)      │
│ placa              │
│ ano (integer)      │
│ modelo             │
│ marcaId (FK)       │
└────────────────────┘
```

**Relacionamentos:**
- `Marca` → `Carro`: **Um para Muitos** (`@OneToMany` em `Marca.carros` / `@ManyToOne` em `Carro.marca`)
- A coluna de chave estrangeira `marcaId` é criada automaticamente pelo TypeORM na tabela `carro`

**Unicidade:** a unicidade de `Carro.placa` e `Marca.nome` é garantida **pela aplicação** (consulta prévia antes de inserir), não por constraint `UNIQUE` no banco.

**Schema:** como `synchronize: true` está ativo, o TypeORM cria/ajusta as tabelas `marca` e `carro` automaticamente ao iniciar a aplicação.

---

## Docker em Detalhes

### Dockerfile (multi-stage)

| Estágio | Imagem base | O que faz |
|---------|-------------|-----------|
| `builder` | `node:18-alpine` | Instala todas as dependências (incluindo dev) e compila o TypeScript para `dist/` |
| runner | `node:18-alpine` | Instala **somente** dependências de produção e copia `dist/` do builder |

Resultado: a imagem final não contém o código-fonte TypeScript nem as ferramentas de build. O container inicia com `node dist/server.js`.

### docker-compose.yml

| Serviço | Detalhes |
|---------|----------|
| `db` | `postgres:latest`, credenciais lidas do `.env`, dados persistidos no volume `pgdata`, `restart: always` |
| `app` | Build a partir do `Dockerfile`, conecta ao `db` pela rede interna do Compose, `depends_on: db`, `restart: always` |

> `depends_on` apenas garante a **ordem de inicialização**, não que o Postgres esteja pronto para conexões. Se a API subir antes do banco aceitar conexões, ela registra o erro de conexão e não inicia o servidor HTTP — basta reiniciar o serviço (`docker compose restart app`).

---

## Scripts Disponíveis

```bash
# Desenvolvimento com hot reload e inspector (porta 9229)
npm run dev

# Compila o TypeScript para dist/
npm run build
```

Comandos úteis complementares:

```bash
# Inicia a build compilada
node dist/server.js

# Sobe apenas o banco
docker compose up -d db

# Sobe tudo (banco + API)
docker compose up --build

# Derruba tudo
docker compose down
```

---

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição | Exemplo |
|----------|:---:|-----------|---------|
| `DB_HOST` | ✅ | Host do PostgreSQL | `localhost` (local) / `db` (Compose) |
| `DB_PORT` | ✅ | Porta do PostgreSQL | `5433` (banco do Compose a partir do host) / `5432` |
| `DB_USER` | ✅ | Usuário do banco | `postgres` |
| `DB_PASSWORD` | ✅ | Senha do banco | `postgres` |
| `DB_DATABASE` | ✅ | Nome do banco de dados | `node_carros` |
| `PORT` | ❌ | Porta HTTP da API | `3333` (padrão) |

Se qualquer variável obrigatória estiver ausente, a aplicação encerra com:

```
Error: Uma ou mais variáveis de ambiente do banco de dados não foram definidas. Verifique seu arquivo .env
```

---

## Limitações Conhecidas e Roadmap

Pontos identificados na análise do código atual, úteis como próximos passos de evolução:

**Segurança e operação**
- [ ] Autenticação/autorização (ex.: JWT) — hoje todas as rotas são públicas
- [ ] Headers de segurança (Helmet), CORS e rate limiting
- [ ] Substituir `synchronize: true` por **migrations** antes de ir para produção
- [ ] Healthcheck do Postgres no Compose (`depends_on: condition: service_healthy`)
- [ ] Adicionar `.dockerignore` (evita copiar `node_modules` e `.env` para o contexto de build)
- [ ] Script `start` no `package.json` para a build de produção

**Validação e regras de negócio**
- [ ] Validação de entrada padronizada (ex.: `zod` ou `class-validator`) em todas as rotas
- [ ] `POST /marca` e `PUT /marca/:id`: validar que `nome` foi enviado
- [ ] `PUT /carro/:id`: aplicar as mesmas validações do `POST` (ano, placa duplicada) e permitir atualização parcial
- [ ] `PUT /carro/:id`: corrigir a mensagem de erro quando `marcaId` não existe (atualmente diz "Carro não encontrado.")
- [ ] Padronizar o nome do campo de marca entre `POST` (`marca`) e `PUT` (`marcaId`)
- [ ] Retornar `400` para IDs que não são UUID válidos (hoje resultam em `500`)
- [ ] Constraints `UNIQUE` no banco para `placa` e `nome`
- [ ] Tratar exclusão de marca com carros vinculados (`409` ou `onDelete: CASCADE`)

**Qualidade**
- [ ] Testes automatizados (unitários e de integração)
- [ ] Documentação interativa com Swagger/OpenAPI
- [ ] Formato de erro único em toda a API (middleware global de erros)
- [ ] Remover dependências não utilizadas (`node-fetch`, `uuid`, `nodemon`)
- [ ] ESLint + Prettier

---

## Solução de Problemas

### `Erro ao conectar com o banco de dados`

Verifique se o container do banco está rodando:

```bash
docker ps
```

Se o container `my-postgres` não aparecer, suba-o:

```bash
docker compose up -d db
```

Confira também se `DB_HOST` e `DB_PORT` no `.env` estão corretos para o seu cenário — rodando a API fora do Docker com o banco do Compose, use `DB_HOST=localhost` e `DB_PORT=5433`.

---

### `Uma ou mais variáveis de ambiente do banco de dados não foram definidas`

O arquivo `.env` está ausente ou incompleto. Execute:

```bash
cp .env.example .env
```

e preencha `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_DATABASE`.

---

### `password authentication failed for user`

As credenciais do `.env` não batem com as do banco. Se você alterou `DB_USER`/`DB_PASSWORD` depois que o volume foi criado, o Postgres mantém as credenciais antigas. Recrie o volume (**apaga os dados**):

```bash
docker compose down -v
docker compose up -d db
```

---

### `Ano inválido` ao cadastrar um carro com ano correto

O campo `ano` precisa ser enviado como **número**, não como string:

```json
{ "ano": 2020 }     // ✅
{ "ano": "2020" }   // ❌ retorna 400
```

---

### Erro `500` ao excluir uma marca

A marca ainda possui carros vinculados, e a chave estrangeira impede a exclusão. Remova ou reatribua os carros dessa marca antes.

---

### Porta já está em uso (`3333`, `5433` ou `9229`)

Identifique o processo que está usando a porta:

```bash
# Linux/macOS
lsof -i :3333

# Windows (PowerShell)
netstat -ano | findstr :3333
```

Para a API, você também pode trocar a porta definindo `PORT` no `.env`.

---

## Licença

Este projeto está licenciado sob a licença **MIT**, conforme declarado no `package.json`.

---

<div align="center">
  Desenvolvido com Node.js + Express + TypeScript + PostgreSQL
</div>

## Autor

**Wesley Taveira** — [@WesleyTaveira](https://github.com/WesleyTaveira)
