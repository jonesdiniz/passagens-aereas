# 🚀 Como Rodar o Sistema Localmente — Guia Passo a Passo

## ⚠️ Pré-requisitos

Antes de começar, verifique se você tem:

1. **Node.js** instalado (versão 18 ou superior)

   ```bash
   node --version
   ```

   Se não tiver, baixe em: <https://nodejs.org/>

2. **npm** instalado (vem com o Node.js)

   ```bash
   npm --version
   ```

---

## 📦 PASSO 1: Instalar Dependências

### Terminal 1 — Backend

Abra um terminal (Prompt de Comando ou PowerShell) e execute:

```bash
cd C:\Users\conta\OneDrive\Documentos\passagens-aereas\backend
npm install
```

> ⏱️ Isso pode demorar 1-3 minutos na primeira vez.

### Terminal 2 — Frontend

Abra um **NOVO** terminal (não feche o anterior) e execute:

```bash
cd C:\Users\conta\OneDrive\Documentos\passagens-aereas\frontend
npm install
```

> ⏱️ Isso também pode demorar 1-3 minutos.

---

## ▶️ PASSO 2: Iniciar o Backend

No terminal do backend, execute:

```bash
npm start
```

Você deve ver algo assim:

```
╔════════════════════════════════════════════════════════════╗
║   Sistema GPS de Passagens Aéreas - Backend v1.0.0        ║
╠════════════════════════════════════════════════════════════╣
║  🚀 Servidor rodando em: http://0.0.0.0:3001              ║
║  🌍 Ambiente: development                                 ║
║  📊 Health check: http://0.0.0.0:3001/health             ║
╚════════════════════════════════════════════════════════════╝
```

✅ **Backend está rodando!** Não feche este terminal.

---

## ▶️ PASSO 3: Iniciar o Frontend

No terminal do frontend, execute:

```bash
npm start
```

Você deve ver algo assim:

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
  ➜  press h + enter to show help
```

✅ **Frontend está rodando!**

---

## 🌐 PASSO 4: Acessar o Sistema

Abra seu navegador e acesse:

- **Site principal:** <http://localhost:5173>
- **Painel Admin:** <http://localhost:5173/admin>
- **API Backend:** <http://localhost:3001>
- **Health Check:** <http://localhost:3001/health>

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### ❌ "'node' não é reconhecido como um comando interno"

**Causa:** Node.js não está instalado ou não está no PATH.
**Solução:**

1. Baixe e instale o Node.js 18+ em <https://nodejs.org/>
2. Reinicie o terminal após a instalação
3. Teste com `node --version`

### ❌ "Cannot find module 'express'" (ou qualquer outro módulo)

**Causa:** Dependências não foram instaladas.
**Solução:** Execute `npm install` na pasta correta (backend ou frontend).

### ❌ "Port 3001 is already in use"

**Causa:** Outro programa está usando a porta 3001.
**Solução:**

- Feche outros terminais Node.js que possam estar rodando
- Ou edite o arquivo `backend/.env` e mude `PORT=3001` para `PORT=3002`
- Se mudar a porta do backend, também mude no `frontend/.env`: `VITE_BACKEND_URL=http://localhost:3002`

### ❌ "Port 5173 is already in use"

**Causa:** Outro projeto Vite está rodando.
**Solução:** O Vite perguntará se quer usar outra porta. Digite `y` e pressione Enter.

### ❌ Frontend não conecta com backend (erro de CORS ou timeout)

**Causa:** O backend não está rodando ou a URL está errada.
**Solução:**

1. Verifique se o backend está rodando no terminal (deve mostrar "Servidor rodando")
2. Verifique se o arquivo `frontend/.env` tem: `VITE_BACKEND_URL=http://localhost:3001`
3. Tente acessar <http://localhost:3001/health> no navegador — deve mostrar JSON

### ❌ Erro "vite is not recognized"

**Causa:** O Vite não foi instalado corretamente.
**Solução:**

```bash
cd frontend
npm install vite --save-dev
npm start
```

---

## ✅ COMO SABER SE ESTÁ FUNCIONANDO

1. Acesse <http://localhost:5173>
2. Você verá a página inicial com o formulário de busca
3. Preencha:
   - Origem: São Paulo
   - Destino: Nova York
   - Quando viajar: Datas exatas
   - Data de Partida: escolha uma data futura
4. Clique em "Buscar Passagens"
5. Você será redirecionado para a página de resultados com estratégias

Para testar o painel admin:

1. Acesse <http://localhost:5173/admin>
2. A tabela pode estar vazia inicialmente
3. Volte ao site, faça uma busca, e clique em "Solicitar Tarifa Secreta"
4. Volte ao admin e atualize — a cotação aparecerá

---

## 🔄 PARA REINICIAR

Se precisar parar e começar de novo:

1. Nos terminais, pressione `Ctrl + C` para parar os servidores
2. Para reiniciar, execute `npm start` novamente em cada pasta

---

## 📞 SE NADA DISSO FUNCIONAR

1. Verifique se você está na pasta correta:

   ```bash
   cd C:\Users\conta\OneDrive\Documentos\passagens-aereas
   dir
   ```

   Deve mostrar as pastas `backend` e `frontend`

2. Verifique se os arquivos existem:

   ```bash
   dir backend\index.js
   dir frontend\package.json
   ```

3. Se o erro persistir, anote a mensagem de erro completa para diagnóstico.
