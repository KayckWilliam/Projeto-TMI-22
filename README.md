# Projeto TMI-22: Sistema de Cadastro Conselho Tutelar

## Visão Geral

Sistema de cadastro e gerenciamento de dados para o Conselho Tutelar, com backend em FastAPI e frontend em HTML/CSS/JavaScript. O sistema armazena dados em banco de dados SQLite, garantindo persistência permanente dos registros.

### Arquitetura
- **Backend:** FastAPI + SQLAlchemy + SQLite (pasta `backend/`)
- **Frontend:** HTML/CSS/JavaScript + Express dev server (pasta `frontend/`)
- **Database:** SQLite (`ConselhoTutelar.db`)
- **Comunicação:** API REST com proxy de desenvolvimento

---

## Início Rápido (Desenvolvimento)

### Opção 1: Script Automático (Recomendado)
```powershell
cd pipeline
python run_dev.py
```
Esse script inicia ambos os servidores (backend e frontend) automaticamente.

### Opção 2: Dois Terminais (Manual)

**Terminal 1 - Backend:**
```powershell
cd backend
py -3.11 -m venv .venv  # (primeira vez apenas)
. .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
API disponível em: http://localhost:8000
Documentação interativa: http://localhost:8000/docs

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm install
npm run start
```
Acesse em: http://localhost:3000

---

## Funcionalidades

### Cadastro de Dados
- **Endereços:** CEP, rua, número, bairro, cidade, estado
- **Crianças:** Nome, data de nascimento, vínculo com endereço
- **Responsáveis/Guardiões:** Nome, telefone, email, tipo de filiação
- **Relatórios:** Documentação de casos por criança
- **Denunciantes:** Registro de quem fez a denúncia
- **Encaminhamentos:** Registro de ações/encaminhamentos

### Busca e Consulta
- Pesquisar crianças por nome
- Pesquisar responsáveis por nome
- Pesquisar endereços por logradouro, bairro ou CEP
- Visualizar detalhes completos de cada registro

### Relatórios
- Criar relatórios vinculados a crianças
- Visualizar histórico de relatórios
- Deletar relatórios (admin)

### Usuários e Autenticação
- Login simples com usuário/senha
- Dois níveis: admin e usuário
- Sessão armazenada em localStorage

---

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/criancas` | Listar todas as crianças |
| POST | `/criancas` | Criar nova criança |
| GET | `/criancas/{id}` | Obter criança por ID |
| DELETE | `/criancas/{id}` | Deletar criança |
| GET | `/enderecos` | Listar todos os endereços |
| POST | `/enderecos` | Criar novo endereço |
| DELETE | `/enderecos/{id}` | Deletar endereço |
| GET | `/filiacao` | Listar todos os responsáveis |
| POST | `/filiacao` | Criar novo responsável |
| DELETE | `/filiacao/{id}` | Deletar responsável |
| GET | `/relatorios` | Listar todos os relatórios |
| POST | `/relatorios` | Criar novo relatório |
| DELETE | `/relatorios/{id}` | Deletar relatório |
| GET | `/denunciante` | Listar denunciantes |
| POST | `/denunciante` | Criar denunciante |
| GET | `/encaminhamentos` | Listar encaminhamentos |
| POST | `/encaminhamentos` | Criar encaminhamento |

---

## Fluxo de Uso

1. **Inicio:** http://localhost:3000 → Login (admin/123456)
2. **Cadastro:** Clique em "Cadastrar"
3. **Passo 1:** Preencha endereço e salve
4. **Passo 2:** Adicione crianças ao endereço
5. **Passo 3:** Adicione responsáveis/guardiões
6. **Visualização:** Vá a "Lista" para ver todos os responsáveis cadastrados
7. **Busca:** Use "Cadastro" para pesquisar qualquer registro
8. **Relatórios:** Crie e visualize relatórios por criança

---

## Persistência de Dados

Todos os dados são salvos automaticamente no banco de dados SQLite:
- Dados persistem após fechar o navegador
- Dados persistem após reiniciar os servidores
- Dados são acessíveis de qualquer computador na rede (se backend exposto)
- Backup disponível em `backend/ConselhoTutelar.db`

---

## Configuração do Ambiente

### Requisitos
- Python 3.11+ 
- Node.js 14+
- npm 6+
- PowerShell 5.1+

### Instalação Inicial
```powershell
# Backend
cd backend
py -3.11 -m venv .venv
. .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```


## Arquivos Principais

| Arquivo | Descrição |
|---------|-----------|
| `backend/main.py` | API FastAPI com todos os endpoints |
| `backend/database/config.py` | Configuração do banco de dados SQLAlchemy |
| `backend/requirements.txt` | Dependências Python |
| `frontend/js/api.js` | Camada de abstração para chamadas HTTP |
| `frontend/js/server.js` | Servidor Express com proxy middleware |
| `frontend/telas/*.html` | Páginas HTML do sistema |
| `frontend/js/*.js` | Lógica das páginas |
| `pipeline/run_dev.py` | Script para iniciar ambos os servidores |

---




## Resolução de Problemas

### Erro: "renderHeader is not defined"
**Solução:** Certifique-se de que `header.js` carrega **sem** `type="module"` e os outros scripts carregam **com** `type="module"`.

### Erro de importação SQLAlchemy em Python 3.13
**Solução:** Use Python 3.11. A compatibilidade foi testada e confirmada em Python 3.11.

### Dados não aparecem no frontend
**Solução:** 
1. Verifique no console (F12) se há erros
2. Confirme que o backend está rodando em http://localhost:8000
3. Verifique o Network tab para ver as requisições HTTP
4. Acesse http://localhost:8000/docs para testar endpoints manualmente

### CORS errors
**Solução:** Backend já está configurado para aceitar todas as origens em desenvolvimento. Em produção, configurar as origens permitidas em `backend/main.py`.

---

## Estrutura do Banco de Dados

Tabelas:
- **endereco** — Endereços
- **crianca** — Crianças cadastradas
- **filiacao** — Responsáveis/Guardiões
- **denunciante** — Denunciantes
- **relatorio** — Relatórios de casos
- **encaminhamento** — Encaminhamentos

---

## Logs e Debug

- Frontend logs: Abra DevTools (F12) → Console
- Backend logs: Veja o terminal do PowerShell rodando uvicorn
- Database file: `backend/ConselhoTutelar.db` (SQLite)

---

## Próximas Melhorias

- [ ] Autenticação com token JWT
- [ ] Dashboard com gráficos de estatísticas
- [ ] Export de dados para Excel/PDF
- [ ] Notificações por email
- [ ] Sistema de permissões granulares
- [ ] Histórico de alterações (auditoria)

---

**Última atualização:** 10 de dezembro de 2025  
**Status:** Funcional - Backend + Frontend + Persistência de Dados 
