# ✅ Funcionalidades Atuais vs ❌ Limitações Reais

> **Leia com atenção.** É crucial que você entenda EXATAMENTE o que o sistema faz e o que ele NÃO faz no estado atual.

---

## ✅ O QUE O SISTEMA CONSEGUE FAZER AGORA

### 1. Busca Inteligente com Múltiplas Estratégias

O usuário preenche origem, destino, datas, passageiros, cabine e flexibilidade. O sistema retorna uma **lista organizada de estratégias**:

- **Tarifas em Dinheiro:** Links diretos para Google Flights, Skyscanner, Kayak
- **Acordos Comerciais:** Sugestão de solicitar tarifas privadas, GDS, consolidators
- **Milhas e Pontos:** Programas recomendados (Smiles, LATAM Pass, Azul, TAP Miles&Go, LifeMiles)
- **Rotas Alternativas:** Aeroportos próximos, open-jaw, multi-cidade
- **Janelas de Datas Sugeridas:** O sistema calcula as melhores combinações de ida/volta dentro do período flexível escolhido
- **Monitoramento:** Checklist final antes da compra + sugestão de alertas de preço

### 2. Cotação de Tarifa Secreta (Consolidator)

- Usuário vê o preço público de referência
- Clica em "Solicitar Tarifa Secreta"
- Preenche nome, email e telefone
- A cotação é salva no backend

### 3. Painel Administrativo

- Visualização de todas as cotações recebidas
- Estatísticas (total, pendentes, cotadas, com tarifa secreta)
- Busca por nome, email ou rota
- Cadastro manual de tarifa secreta recebida do consolidator
- Cópia automática de briefing para enviar ao consolidator
- Mudança de status (pendente → contactado → cotado → aceito/rejeitado)

### 4. Integração com Amadeus API (Opcional)

- Se você configurar credenciais no `.env`, o sistema busca **tarifas reais** da API Amadeus
- Funciona apenas para datas exatas e rotas com códigos IATA conhecidos
- Sem credenciais, o sistema usa **estimativas baseadas em perfis de mercado** (fallback)

### 5. Persistência de Dados

- Resultados de busca salvos no localStorage do navegador
- Cotações salvas em arquivo JSON no servidor
- Dados mantidos entre sessões

### 6. Dockerização Completa

- Container para backend + frontend com nginx
- Health checks, proxy reverso, headers de segurança

---

## ❌ O QUE O SISTEMA NÃO CONSEGUE FAZER (ainda)

### ❌ Buscar tarifas reais em tempo real de múltiplas fontes

Sem credenciais do Amadeus, os preços mostrados são **ESTIMATIVAS**, não preços reais. Mesmo com Amadeus, a API de teste tem limitações:

- Apenas tarifas públicas
- Rotas limitadas
- Datas futuras apenas
- Não inclui low-cost carriers (como Ryanair, EasyJet no Brasil)

### ❌ Acesso direto a tarifas privadas/consolidator

O sistema **sugere** estratégias e **captura leads**, mas não tem acesso automatizado a:

- Tarifas de consolidator
- Tarifas corporativas
- Tarifas negociadas
- Milhas em tempo real

Isso requer **parcerias manuais** que você precisa firmar.

### ❌ Emissão de bilhetes

O sistema não emite passagens. Ele é uma ferramenta de **busca, comparação e captação de leads**.

### ❌ Comparação em tempo real com Skyscanner/Google Flights

O sistema NÃO busca nos mesmos bancos de dados que Skyscanner ou Google Flights. Ele oferece:

- Links para que o usuário busque manualmente nessas plataformas
- Estimativas baseadas em perfis de mercado
- Estratégias para encontrar preços melhores

---

## 🔍 COMPARATIVO HONESTO: Seu Sistema vs Skyscanner/Google Flights

| Capacidade | Seu Sistema | Skyscanner/Google Flights |
|------------|-------------|---------------------------|
| **Preços em tempo real** | ⚠️ Estimativas (ou Amadeus limitado) | ✅ Sim, milhões de rotas |
| **Metabuscas** | ❌ Apenas links | ✅ Busca em 1000+ sites |
| **Tarifas privadas** | ❌ Captura leads apenas | ❌ Não |
| **Estratégias de economia** | ✅ Detalhadas e educativas | ❌ Básico |
| **Milhas e alianças** | ✅ Guia completo | ⚠️ Limitado |
| **Consolidators** | ✅ Captura + painel admin | ❌ Não |
| **Open-jaw, aeroportos próximos** | ✅ Sugestões | ⚠️ Básico |
| **Velocidade de busca** | ⚠️ 1-2 segundos | ✅ Milissegundos |
| **Cobertura global** | ⚠️ 16 cidades conhecidas | ✅ Todas as cidades |

### 🎯 VEREDICTO REALISTA

**NO ESTADO ATUAL, seu sistema NÃO encontra passagens mais baratas que Skyscanner ou Google Flights automaticamente.**

O que ele faz de diferente (e valioso):

1. **Educa o usuário** sobre estratégias que os buscadores tradicionais não mostram
2. **Captura leads** interessados em tarifas privadas
3. **Organiza múltiplas abordagens** (dinheiro, milhas, consolidator, rotas alternativas)
4. **Facilita cotação assistida** com consolidators (fluxo manual, mas estruturado)

---

## 🛤️ CAMINHO PARA SUPERAR SKSCANNER/GOOGLE FLIGHTS

### Fase 1 (Agora — já implementado)

- Sistema educativo + captação de leads
- Painel admin para gerenciar cotações

### Fase 2 (Semanas)

- Firmar parcerias com 1-2 consolidators
- Começar a oferecer tarifas reais obtidas manualmente
- Ter cases de economia real para mostrar

### Fase 3 (Meses)

- Contratar API Enterprise de GDS (Amadeus Pro, Travelport)
- Acesso a tarifas corporativas e negociadas
- Integrar múltiplas fontes (Amadeus + consolidators + milhas)

### Fase 4 (6-12 meses)

- Algoritmo próprio de recomendação baseado em dados reais
- Cache inteligente de rotas populares
- Notificações de queda de preço

---

## 💡 COMO USAR O SISTEMA AGORA (estratégia realista)

### Para você (administrador)

1. Use o sistema para **captar leads** de pessoas buscando passagens
2. Receba as cotações no painel admin
3. Envie os briefings para seus consolidators parceiros
4. Receba tarifas privadas e cadastre no sistema
5. **Manualmente**, entre em contato com o cliente oferecendo a tarifa secreta
6. Feche a venda e emita pela plataforma do consolidator

### Para o usuário final

1. Ele usa seu sistema para entender **estratégias de economia**
2. Vê uma **estimativa** de preço e múltiplas abordagens
3. Pode solicitar cotação com consolidator
4. Recebe contato com tarifa real (via você)

---

## 🎯 RESPOSTA DIRETA ÀS SUAS PERGUNTAS

> **"Consegue obter dados reais de passagens aéreas?"**

**Parcialmente.** Com credenciais Amadeus configuradas, busca tarifas públicas reais para rotas específicas. Sem credenciais, usa estimativas. Em NENHUM dos casos acessa tarifas privadas automaticamente.

> **"Já consegue encontrar passagens mais baratas que Skyscanner/Google Flights?"**

**Não automaticamente.** O sistema é uma **ferramenta de estratégia + captação**, não um metabuscador. Para encontrar tarifas mais baratas, você precisa:

1. Receber a cotação do usuário
2. Buscar manualmente (ou via consolidator parceiro)
3. Encontrar tarifa privada
4. Oferecer ao usuário

A vantagem competitiva NÃO é tecnológica (ainda), mas sim:

- **Acesso a consolidators** que o público não tem
- **Conhecimento de estratégias** que buscadores não ensinam
- **Atendimento personalizado** vs busca automática

---

*Documento criado para alinhar expectativas e definir roadmap realista.*
