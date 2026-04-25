# Sistema GPS de Passagens Aéreas

## Visão Geral

O **Sistema GPS de Passagens Aéreas** é uma ferramenta inovadora inspirada nas estratégias de busca de passagens mais baratas. O objetivo é ir além dos buscadores tradicionais, agregando múltiplas fontes de dados e aplicando inteligência para identificar as melhores oportunidades de economia.

O sistema é dividido em duas partes principais:

1. **Frontend (React + Vite):** Interface de usuário moderna e responsiva para busca e visualização de resultados.
2. **Backend (Node.js/Express):** API RESTful para processamento da busca, integração com APIs externas e aplicação das estratégias.

## Estratégias de Busca Implementadas

O sistema categoriza resultados com base nas seguintes estratégias:

- **Tarifas em Dinheiro:** Preços diretos de companhias aéreas e agregadores (via API Amadeus quando configurada).
- **Estratégias com Milhas:** Sugestões de resgate utilizando programas de fidelidade e alianças (Star Alliance, Oneworld, SkyTeam).
- **Oportunidades Consolidator:** Indicação de agências e plataformas que podem oferecer tarifas especiais (emissões por lote, acordos comerciais).
- **Rotas Alternativas:** Sugestões de aeroportos próximos, open-jaw e múltiplos destinos.
- **Monitoramento:** Alertas de preço e checklist final antes da compra.

## Tecnologias

| Componente | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | React 18, Material-UI, Vite | Interface moderna, responsiva e rápida. |
| **Backend** | Node.js, Express | Servidor API leve, escalável e seguro. |
| **Testes** | Jest, Supertest, RTL | Cobertura de testes unitários e de integração. |
| **Qualidade** | ESLint | Garantia de código limpo e padronizado. |
| **Container** | Docker, Docker Compose | Implantação consistente e portátil. |

## Pré-requisitos

- Node.js (versão 18+)
- npm (ou yarn/pnpm)
- Docker e Docker Compose (opcional, para deploy containerizado)

## Instalação e Execução

### Método 1: Desenvolvimento Local

#### 1. Configurar o Backend

```bash
cd backend
npm install

# Crie o arquivo .env (já incluso, mas verifique as configurações)
# Edite o .env se necessário (ex: PORT, FRONTEND_URL, credenciais Amadeus)

npm start
# O servidor estará rodando em http://localhost:3001
```

#### 2. Configurar o Frontend

```bash
cd ../frontend
npm install

# O arquivo .env já está configurado com VITE_BACKEND_URL=http://localhost:3001

npm start
# A aplicação estará disponível em http://localhost:5173
```

### Método 2: Docker Compose (Recomendado para Produção)

```bash
# Na raiz do projeto
docker-compose up --build

# O frontend estará em http://localhost
# O backend estará em http://localhost:3001
```

## Configuração de APIs Externas

O sistema possui integração opcional com a **API Amadeus** para busca de tarifas reais.

1. Acesse [https://developers.amadeus.com/](https://developers.amadeus.com/)
2. Crie uma conta gratuita
3. Gere suas credenciais (Client ID e Client Secret)
4. Adicione ao arquivo `backend/.env`:

```env
AMADEUS_CLIENT_ID=seu_client_id_aqui
AMADEUS_CLIENT_SECRET=seu_client_secret_aqui
```

> **Nota:** Sem as credenciais do Amadeus, o sistema funciona normalmente utilizando estimativas baseadas em perfis de mercado (fallback inteligente).

## Testes

### Backend

```bash
cd backend
npm test
```

Os testes cobrem:

- Status do servidor e health check
- Busca com dados válidos e inválidos
- Validações de formulário
- Criação e gerenciamento de cotações
- Rotas não encontradas

### Frontend

```bash
cd frontend
npm test
```

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Status do servidor |
| GET | `/health` | Health check detalhado (inclui status Amadeus) |
| POST | `/api/search` | Realiza busca de passagens |
| POST | `/api/quotes` | Cria nova cotação |
| GET | `/api/quotes` | Lista todas as cotações |
| GET | `/api/quotes/stats` | Estatísticas das cotações |
| GET | `/api/quotes/:id` | Obtém cotação específica |
| PATCH | `/api/quotes/:id/status` | Atualiza status da cotação |

## Estrutura do Projeto

```
passagens-aereas/
├── backend/
│   ├── controllers/      # Controladores (search, quotes)
│   ├── data/             # Base de conhecimento (aeroportos, perfis)
│   ├── middleware/       # Middlewares (erros, 404)
│   ├── routes/           # Rotas da API
│   ├── services/         # Serviços (Amadeus, busca)
│   ├── tests/            # Testes de integração
│   ├── .env              # Variáveis de ambiente
│   ├── Dockerfile        # Container do backend
│   └── index.js          # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── context/      # Context API (estado global)
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Páginas (Home, Resultados, Estratégias)
│   │   ├── services/     # Chamadas à API
│   │   ├── utils/        # Utilitários (validação)
│   │   └── theme.js      # Tema Material-UI
│   ├── .env              # Variáveis do frontend
│   ├── Dockerfile        # Container do frontend
│   └── nginx.conf        # Configuração nginx
├── docker-compose.yml    # Orquestração dos containers
└── docs/                 # Documentação adicional
```

## Funcionalidades Principais

### 1. Busca Inteligente

- Suporte a datas exatas ou flexíveis (mês, próximos 3/6/12 meses)
- Filtros por cabine, passageiros, duração da viagem
- Inclusão de aeroportos próximos automaticamente

### 2. Estratégias Personalizadas

- **Acordos Comerciais:** Tarifas privadas, GDS, consolidators
- **Milhas:** Programas de fidelidade, alianças, transferências
- **Dinheiro:** Metabuscas, sites oficiais de companhias
- **Rotas Alternativas:** Aeroportos próximos, open-jaw, multi-cidade

### 3. Cotação com Consolidador

- Solicitação de tarifas secretas/privadas
- Formulário de contato integrado
- Painel de administração de cotações (listar, status, estatísticas)

### 4. Persistência

- Dados salvos no localStorage do navegador
- Cotações armazenadas em arquivo JSON no backend
- Pronto para migração para MongoDB/Redis

## Segurança

- Helmet.js para headers de segurança HTTP
- Rate limiting (100 req/15min por IP)
- CORS configurado para origens específicas
- Validação de inputs no frontend e backend
- Sanitização de dados de cotação

## Health Check

Acesse `http://localhost:3001/health` para verificar:

- Status geral do sistema
- Conexão com API Amadeus
- Uso de memória
- Uptime do servidor

## Contribuição

Consulte o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes de contribuição.

## Licença

Este projeto está licenciado sob a [LICENÇA](LICENSE).

---

**Status do Projeto:** ✅ **Totalmente Funcional e Entregue**

Desenvolvido com foco em usabilidade, performance e escalabilidade. Pronto para uso imediato e expansão futura.
