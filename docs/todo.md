# Lista de Tarefas - Sistema de Busca de Passagens Aéreas

## Fase 1: Pesquisa e Definição (Concluída)

- [x] ~~001 pesquisar_sistema_gps_lari_colares()~~
- [x] ~~002 pesquisar_estrategias_passagens_baratas()~~
- [x] ~~003 definir_requisitos_sistema()~~

## Fase 2: Confirmação e Arquitetura

- [x] 004 confirmar_requisitos_com_usuario(): Apresentar requisitos detalhados e proposta ajustada para confirmação.
- [x] 005 desenvolver_arquitetura_sistema(): Definir tecnologias (backend, frontend, banco de dados), fontes de dados (APIs, scraping, BD estático) e estrutura geral.

## Fase 3: Desenvolvimento e Testes

- [x] 006 implementar_sistema():
  - [x] 006.1 Desenvolver interface do usuário (frontend).
  - [x] 006.2 Implementar busca de voos (preços em dinheiro) via APIs/scraping. (Com fallback Amadeus)
  - [x] 006.3 Implementar lógica de identificação de parcerias e alianças.
  - [x] 006.4 Implementar sistema de sugestão de estratégias de milhas (links, guias).
  - [x] 006.5 Implementar seção informativa sobre tarifas consolidator e onde procurar.
  - [x] 006.6 Integrar backend e frontend.
- [x] 007 testar_sistema():
  - [x] 007.1 Testar funcionalidades de busca.
  - [x] 007.2 Testar identificação de parcerias.
  - [x] 007.3 Testar links e guias de milhas/consolidator.
  - [x] 007.4 Testar usabilidade da interface.

## Fase 4: Entrega

- [x] 008 entregar_sistema_ao_usuario():
  - [x] 008.1 Configurar ambiente (.env, CORS, variáveis)
  - [x] 008.2 Robustecer backend (tratamento de erros, validações, health check)
  - [x] 008.3 Melhorar serviço Amadeus (retry, validações, fallback)
  - [x] 008.4 Expandir controller de cotações (listar, atualizar status, estatísticas)
  - [x] 008.5 Criar testes de integração completos
  - [x] 008.6 Dockerizar aplicação (backend + frontend + nginx)
  - [x] 008.7 Atualizar documentação e README
  - [x] 008.8 Apresentar sistema final e documentação básica

## Melhorias Futuras (Roadmap)

- [ ] Implementar banco de dados MongoDB para persistência robusta
- [ ] Implementar Redis para cache de buscas frequentes
- [ ] Adicionar autenticação JWT para área administrativa
- [ ] Integrar Skyscanner API e Kiwi API para múltiplas fontes de preços
- [ ] Sistema de notificações/alertas de preço por email
- [ ] Implementar scraping ético de sites de milhas
- [ ] Dashboard administrativo para gerenciar cotações
- [ ] CI/CD pipeline para deploy automático
- [ ] Testes E2E com Cypress ou Playwright
- [ ] Suporte a múltiplos idiomas (i18n)
