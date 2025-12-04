# Manual do Usuário - Sistema de Busca de Passagens Aéreas

## Introdução

Este sistema foi desenvolvido para ajudar você a encontrar passagens aéreas mais baratas, aproveitando acordos comerciais, emissões por lote, milhas e tarifas consolidator, inspirado no "sistema GPS" de Lari Colares e outras estratégias similares.

## Funcionalidades Implementadas

1. **Interface de Busca Intuitiva**: Formulário para inserir origem, destino e datas de viagem.
2. **Visualização de Resultados**: Exibição organizada de resultados em diferentes categorias:
   - Preços em dinheiro
   - Estratégias com milhas
   - Oportunidades com tarifas consolidator
3. **Sugestões Estratégicas**: Recomendações personalizadas baseadas na rota pesquisada.
4. **Navegação Simples**: Interface limpa e responsiva para facilitar o uso.

## Como Usar o Sistema

### Iniciando o Sistema

Para iniciar o sistema em seu ambiente local:

1. **Iniciar o Backend**:
   ```
   cd /home/ubuntu/passagens_aereas_sistema/backend
   node index.js
   ```

2. **Iniciar o Frontend**:
   ```
   cd /home/ubuntu/passagens_aereas_sistema/frontend
   npx serve -s build -l 3000
   ```

3. **Acessar o Sistema**:
   Abra seu navegador e acesse `http://localhost:3000`

### Realizando uma Busca

1. Na página inicial, preencha os campos:
   - **Origem**: Cidade ou aeroporto de partida
   - **Destino**: Cidade ou aeroporto de chegada
   - **Data de Partida**: Data desejada para a viagem de ida
   - **Data de Retorno** (opcional): Data desejada para a viagem de volta

2. Clique no botão "Buscar Passagens"

3. Analise os resultados organizados em três categorias:
   - **Resultados em Dinheiro**: Preços convencionais em diferentes fontes
   - **Estratégias com Milhas**: Oportunidades usando programas de fidelidade
   - **Oportunidades Consolidator**: Sugestões de verificação em agências com tarifas especiais

## Limitações da Versão Atual

1. **Dados Mockados**: Esta versão inicial utiliza dados simulados para demonstrar o funcionamento do sistema. Em uma versão futura, serão implementadas integrações reais com APIs de busca de passagens.

2. **Tarifas Consolidator**: O acesso direto a tarifas consolidator em tempo real é tecnicamente limitado. O sistema atualmente sugere onde procurar por essas tarifas, mas não as exibe em tempo real.

3. **Acordos Comerciais**: O sistema identifica parcerias relevantes entre companhias aéreas, mas a verificação final precisa ser feita manualmente nos programas de fidelidade correspondentes.

4. **Conexão Frontend-Backend**: Pode haver problemas ocasionais na comunicação entre o frontend e o backend, resultando em resultados não exibidos corretamente.

## Próximos Passos e Melhorias Futuras

1. **Integração com APIs Reais**: Implementar conexões com Skyscanner, Kiwi/Tequila e outras fontes de dados reais.

2. **Banco de Dados de Acordos**: Expandir o banco de dados estático de acordos comerciais e alianças entre companhias aéreas.

3. **Sistema de Notificações**: Implementar alertas para quedas de preço ou oportunidades especiais.

4. **Perfil de Usuário**: Permitir salvar buscas favoritas e preferências de viagem.

5. **Correção de Bugs**: Resolver problemas de comunicação entre frontend e backend para exibição correta de resultados.

## Suporte e Contato

Para dúvidas, sugestões ou problemas, entre em contato com o desenvolvedor.

---

Obrigado por utilizar nosso Sistema de Busca de Passagens Aéreas!
