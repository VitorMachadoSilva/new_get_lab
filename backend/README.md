# Backend - Sistema de Reserva de Laboratórios

## Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo `env.example` para `.env` e configure:
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
- `DATABASE_URL`: URL de conexão com PostgreSQL
- `JWT_SECRET`: Chave secreta para JWT
- `PORT`: Porta do servidor (padrão: 8000)

### 3. Configurar banco de dados
```bash
npm run migrate
```

### 4. Executar o servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## Estrutura do Projeto

- `src/models/`: Modelos de dados (User, Labs, Reservation)
- `src/controllers/`: Controladores da API
- `src/routes/`: Rotas da API
- `src/middleware/`: Middlewares (autenticação, validação)
- `src/config/`: Configurações (banco de dados)
- `scripts/`: Scripts de migração

## Endpoints

- `POST /api/v1/auth/register` - Registro de usuário
- `POST /api/v1/auth/login` - Login de usuário
- `GET /api/v1/labs` - Listar laboratórios
- `GET /api/v1/reservations` - Listar reservas
- `POST /api/v1/reservations` - Criar reserva
- `GET /health` - Status do servidor
