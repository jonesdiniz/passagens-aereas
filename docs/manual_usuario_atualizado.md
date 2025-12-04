# Manual do Usuário Atualizado - Sistema de Busca de Passagens Aéreas

## Introdução

Bem-vindo ao Sistema de Busca de Passagens Aéreas, uma ferramenta desenvolvida para simplificar a busca por passagens aéreas mais baratas, aproveitando estratégias como acordos comerciais, emissões por lote, milhas e tarifas consolidator.

Este manual fornece instruções detalhadas sobre como instalar, configurar e utilizar o sistema, além de explicar suas funcionalidades e limitações atuais.

## Índice

1. [Requisitos do Sistema](#requisitos-do-sistema)
2. [Instalação](#instalação)
   - [Windows](#windows)
   - [macOS](#macos)
   - [Linux](#linux)
3. [Funcionalidades](#funcionalidades)
   - [Busca de Passagens](#busca-de-passagens)
   - [Visualização de Resultados](#visualização-de-resultados)
   - [Estratégias e Dicas](#estratégias-e-dicas)
4. [Guia de Uso](#guia-de-uso)
5. [Solução de Problemas](#solução-de-problemas)
6. [Limitações Atuais](#limitações-atuais)
7. [Próximas Atualizações](#próximas-atualizações)

## Requisitos do Sistema

- **Node.js**: Versão 14.0.0 ou superior
- **NPM**: Versão 6.0.0 ou superior
- **Navegador Web**: Chrome, Firefox, Safari ou Edge (versões atualizadas)
- **Conexão com a Internet**: Necessária para buscar dados em tempo real (quando implementado)

## Instalação

### Windows

1. Baixe e descompacte o arquivo do projeto em uma pasta de sua escolha
2. Abra o Prompt de Comando (CMD) ou PowerShell
3. Navegue até a pasta do projeto:
   ```
   cd caminho\para\passagens_aereas_sistema
   ```
4. Instale as dependências do backend:
   ```
   cd backend
   npm install
   ```
5. Instale as dependências do frontend:
   ```
   cd ..\frontend
   npm install
   ```
6. Inicie o servidor backend:
   ```
   cd ..\backend
   node index.js
   ```
7. Em outra janela do CMD ou PowerShell, inicie o frontend:
   ```
   cd caminho\para\passagens_aereas_sistema\frontend
   npx serve -s build -l 3000
   ```
8. Acesse o sistema no navegador: http://localhost:3000

### macOS

1. Baixe e descompacte o arquivo do projeto em uma pasta de sua escolha
2. Abra o Terminal
3. Navegue até a pasta do projeto:
   ```
   cd caminho/para/passagens_aereas_sistema
   ```
4. Instale as dependências do backend:
   ```
   cd backend
   npm install
   ```
5. Instale as dependências do frontend:
   ```
   cd ../frontend
   npm install
   ```
6. Inicie o servidor backend:
   ```
   cd ../backend
   node index.js
   ```
7. Em outra janela do Terminal, inicie o frontend:
   ```
   cd caminho/para/passagens_aereas_sistema/frontend
   npx serve -s build -l 3000
   ```
8. Acesse o sistema no navegador: http://localhost:3000

### Linux

1. Baixe e descompacte o arquivo do projeto em uma pasta de sua escolha
2. Abra o Terminal
3. Navegue até a pasta do projeto:
   ```
   cd caminho/para/passagens_aereas_sistema
   ```
4. Instale as dependências do backend:
   ```
   cd backend
   npm install
   ```
5. Instale as dependências do frontend:
   ```
   cd ../frontend
   npm install
   ```
6. Inicie o servidor backend:
   ```
   cd ../backend
   node index.js
   ```
7. Em outra janela do Terminal, inicie o frontend:
   ```
   cd caminho/para/passagens_aereas_sistema/frontend
   npx serve -s build -l 3000
   ```
8. Acesse o sistema no navegador: http://localhost:3000

## Funcionalidades

### Busca de Passagens

O sistema permite buscar passagens aéreas fornecendo:
- **Origem**: Cidade ou aeroporto de partida
- **Destino**: Cidade ou aeroporto de chegada
- **Data de Partida**: Data desejada para a viagem de ida
- **Data de Retorno** (opcional): Data desejada para a viagem de volta

### Visualização de Resultados

Os resultados da busca são organizados em três categorias principais:

1. **Resultados em Dinheiro**: Preços em moeda corrente de companhias aéreas e agregadores
2. **Estratégias com Milhas**: Sugestões de uso de programas de fidelidade e suas parcerias
3. **Oportunidades Consolidator**: Informações sobre possíveis tarifas especiais disponíveis via agências

Cada resultado inclui:
- Fonte da informação (companhia, agregador, programa de milhas)
- Preço ou valor em milhas
- Detalhes adicionais (escalas, sugestões específicas)
- Botão "Mais Detalhes" para informações complementares

### Estratégias e Dicas

A seção de Estratégias fornece informações educativas sobre:
- **Utilização de Milhas**: Tabelas fixas vs. dinâmicas, parceiros e alianças, acúmulo estratégico
- **Tarifas Consolidator**: Como acessar tarifas especiais via agências e plataformas de emissão
- **Acordos Comerciais**: Vantagens de codeshare e alianças globais
- **Técnicas Avançadas**: Múltiplos trechos, aeroportos alternativos, flexibilidade de datas

## Guia de Uso

1. **Realizar uma Busca**:
   - Acesse a página inicial do sistema
   - Preencha os campos de origem, destino e data de partida (e retorno, se aplicável)
   - Clique em "Buscar Passagens"
   - O sistema irá processar a busca e redirecionar automaticamente para a página de resultados

2. **Visualizar Resultados**:
   - Os parâmetros da sua busca serão exibidos no topo da página
   - Explore as diferentes categorias de resultados (Dinheiro, Milhas, Consolidator)
   - Clique em "Mais Detalhes" para ver informações adicionais sobre cada opção
   - Use o botão "Nova Busca" para retornar à página inicial

3. **Explorar Estratégias**:
   - Acesse a seção "Estratégias" através do menu superior
   - Navegue pelas diferentes categorias de estratégias e dicas
   - Utilize essas informações para otimizar suas buscas futuras

## Solução de Problemas

### Problemas de Instalação

**Erro de dependências no NPM**:
- Verifique se você tem a versão correta do Node.js e NPM
- Tente executar `npm cache clean --force` antes de reinstalar

**Porta 3000 já em uso**:
- Altere a porta do frontend: `npx serve -s build -l 3001`
- Ou encerre o processo que está usando a porta 3000

### Problemas de Execução

**Página em branco ao acessar o sistema**:
- Verifique se tanto o backend quanto o frontend estão em execução
- Confirme se está acessando a URL correta (http://localhost:3000)
- Limpe o cache do navegador e tente novamente

**Resultados não aparecem após a busca**:
- Clique no botão "Carregar Resultados de Teste" na página de resultados
- Verifique se o backend está em execução
- Reinicie o backend e tente novamente

## Limitações Atuais

Esta versão do sistema (MVP) possui algumas limitações conhecidas:

1. **Dados Simulados**: O sistema utiliza dados mockados para demonstração, não realizando buscas reais em APIs externas nesta versão.

2. **Persistência de Dados**: Os parâmetros de busca e resultados são persistidos apenas durante a sessão do navegador.

3. **Conteúdo Educativo**: A página de estratégias contém informações gerais; futuras versões incluirão conteúdo mais específico e personalizado.

4. **Integração com Fontes Reais**: Ainda não há integração com APIs de companhias aéreas, agregadores ou programas de milhas.

## Próximas Atualizações

Estamos trabalhando nas seguintes melhorias para as próximas versões:

1. **Integração com APIs Reais**: Busca em tempo real em companhias aéreas, agregadores e programas de milhas.

2. **Alertas de Preços**: Notificações quando houver quedas significativas nos preços das rotas monitoradas.

3. **Perfil de Usuário**: Salvar preferências, rotas favoritas e programas de milhas utilizados.

4. **Calculadora de Milhas**: Ferramenta para comparar o valor em dinheiro vs. milhas para determinar o melhor custo-benefício.

5. **Versão Mobile**: Aplicativo para dispositivos Android e iOS.

---

Para suporte adicional ou dúvidas, entre em contato através do email: suporte@sistemagpspassagens.com.br
