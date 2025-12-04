# Guia de Contribuição

Agradecemos o seu interesse em contribuir para o **Sistema GPS de Passagens Aéreas**!

## Como Contribuir

1. **Fork** o repositório.
2. **Clone** o seu fork: `git clone [URL_DO_SEU_FORK]`
3. Crie um **branch** para sua feature ou correção: `git checkout -b feature/minha-nova-funcionalidade`
4. Faça suas alterações e **commite** com mensagens claras e descritivas.
5. **Push** para o seu branch: `git push origin feature/minha-nova-funcionalidade`
6. Abra um **Pull Request (PR)** para o branch `main` do repositório original.

## Padrões de Código

- **Linguagem:** Todo o código deve ser escrito em JavaScript/React (Frontend) e JavaScript/Node.js (Backend).
- **Estilo:** Siga as regras de linting definidas nos arquivos `.eslintrc.json` de cada projeto.
- **Testes:** Toda nova funcionalidade ou correção de bug deve ser acompanhada de testes unitários e/ou de integração relevantes.
- **Documentação:** Atualize o `README.md` e outros arquivos de documentação conforme necessário.

## Estrutura do Projeto

O projeto segue uma estrutura de monorepo simples com duas pastas principais:

- `backend/`: Contém o servidor Node.js/Express.
  - `controllers/`: Lógica de manipulação de requisições.
  - `routes/`: Definição das rotas da API.
  - `services/`: Lógica de negócio e simulação de busca.
  - `middleware/`: Middlewares de tratamento de erros e outros.
- `frontend/`: Contém a aplicação React.
  - `src/components/`: Componentes reutilizáveis.
  - `src/pages/`: Componentes de página.
  - `src/context/`: Contextos globais (ex: SearchContext).
  - `src/hooks/`: Custom hooks.
  - `src/utils/`: Funções utilitárias (ex: validação).

## Sugestões de Melhoria

As próximas fases do projeto incluem:

- **Integração Real com APIs:** Substituir a lógica mockada em `backend/services/searchService.js` por chamadas a APIs de busca de voos (ex: Skyscanner, Kiwi).
- **Banco de Dados:** Implementar o MongoDB para persistência de dados (ex: histórico de buscas, perfis de usuário).
- **Cache:** Implementar o Redis para cache de resultados de busca frequentes.
- **Testes de Componentes:** Adicionar testes de componentes React usando React Testing Library.
