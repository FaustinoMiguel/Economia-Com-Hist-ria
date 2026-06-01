# Backend

Backend inicial do projecto, focado em CRUD e ligado ao schema MySQL que já existe na pasta `database`.

## O que já está pronto

- conexão com MySQL
- healthcheck
- CRUD de `conteudo`
- CRUD de `topico_forum`

## Estrutura

```text
backend/
├─ src/
│  ├─ app.ts
│  ├─ server.ts
│  ├─ config/
│  ├─ controllers/
│  ├─ routes/
│  ├─ middlewares/
│  └─ types/
├─ .env.example
├─ package.json
└─ tsconfig.json
```

## Base de dados

Usa o schema já existente em [`/database/schema.sql`](/C:/Users/loure/Documents/Educação%20interativa%20Angola/database/schema.sql) e os dados de teste em [`/database/seeds.sql`](/C:/Users/loure/Documents/Educação%20interativa%20Angola/database/seeds.sql).

## Variáveis de ambiente

Cria um `.env` dentro de `backend` com base em `.env.example`:

```env
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=economia_historia
CORS_ORIGIN=http://localhost:5173
```

## Rotas

- `GET /health`
- `GET /api`
- `GET /api/conteudos`
- `GET /api/conteudos/:id`
- `POST /api/conteudos`
- `PUT /api/conteudos/:id`
- `DELETE /api/conteudos/:id`
- `GET /api/topicos`
- `GET /api/topicos/:id`
- `POST /api/topicos`
- `PUT /api/topicos/:id`
- `DELETE /api/topicos/:id`

## Como correr

1. Instala dependências no `backend`.
2. Garante que a base `economia_historia` existe no MySQL.
3. Importa `schema.sql` e `seeds.sql` se ainda não estiverem aplicados.
4. Executa `npm run dev`.

## Nota

Este backend foi criado para servir de base prática de testes. Depois podes expandir para autenticação, notificações, fórum e uploads.
