# Sistema GPS de Passagens Aéreas

## Visão Geral

O **Sistema GPS de Passagens Aéreas** é uma ferramenta inovadora inspirada nas estratégias de busca de passagens mais baratas, como o "sistema GPS" de Lari Colares. O objetivo é ir além dos buscadores tradicionais, agregando múltiplas fontes de dados e aplicando inteligência para identificar as melhores oportunidades de economia.

O sistema é dividido em duas partes principais:
1. **Frontend (React):** Interface de usuário para busca e visualização de resultados.
2. **Backend (Node.js/Express):** API RESTful para processamento da busca e aplicação das estratégias.

## Estratégias de Busca Implementadas (Mockadas)

O sistema demonstra a capacidade de categorizar resultados com base nas seguintes estratégias:

- **Tarifas em Dinheiro:** Preços diretos de companhias aéreas e agregadores.
- **Estratégias com Milhas:** Sugestões de resgate utilizando programas de fidelidade e alianças (ex: Star Alliance, Oneworld).
- **Oportunidades Consolidator:** Indicação de agências e plataformas que podem oferecer tarifas especiais (emissões por lote, acordos comerciais).

## Tecnologias

| Componente | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | React, Material-UI | Interface de usuário moderna e responsiva. |
| **Backend** | Node.js, Express | Servidor API leve e escalável. |
| **Testes** | Jest, Supertest, RTL | Cobertura de testes unitários e de integração. |
| **Qualidade** | ESLint | Garantia de código limpo e padronizado. |

## Instalação e Execução

### Pré-requisitos

- Node.js (versão 18+)
- npm (ou yarn/pnpm)

### 1. Clonar o Repositório

```bash
git clone [URL_DO_REPOSITORIO]
cd passagens_aereas_sistema
```

### 2. Configurar o Backend

```bash
cd backend
npm install
cp .env.example .env # Crie o arquivo .env a partir do exemplo
# Edite o .env se necessário (ex: PORT, FRONTEND_URL)
npm start
# O servidor estará rodando em http://localhost:3001 (ou a porta configurada)
```

### 3. Configurar o Frontend

```bash
cd ../frontend
npm install
cp .env.example .env # Crie o arquivo .env a partir do exemplo
# Edite o .env se necessário (ex: REACT_APP_BACKEND_URL)
npm start
# A aplicação estará disponível em http://localhost:3000 (ou a porta configurada)
```

## Testes

Para rodar os testes em cada componente:

```bash
# Testes do Backend
cd backend
npm test

# Testes do Frontend
cd frontend
npm test
```

## Contribuição

Consulte o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes de contribuição.

## Licença

Este projeto está licenciado sob a [LICENÇA](LICENSE).
