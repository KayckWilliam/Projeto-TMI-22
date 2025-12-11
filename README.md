# Projeto TMI-22: Sistema de Cadastro Conselho Tutelar

## Visão Geral

Sistema full-stack de cadastro e gerenciamento para o Conselho Tutelar, desenvolvido com FastAPI (Python) no backend e JavaScript puro no frontend. O sistema oferece controle completo sobre crianças, responsáveis, endereços, relatórios e encaminhamentos, com dashboard de estatísticas e funcionalidades CRUD completas.

### Arquitetura
- **Backend:** FastAPI 0.104.1 + SQLAlchemy 2.0.23 + SQLite (pasta `backend/`)
- **Frontend:** JavaScript ES6 + Tailwind CSS + Chart.js + Express dev server (pasta `frontend/`)
- **Database:** SQLite (`ConselhoTutelar.db`) com 6 tabelas relacionadas
- **Comunicação:** API REST com proxy de desenvolvimento (CORS configurado)
- **Validações:** Pydantic (backend) + máscaras em tempo real (frontend)

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

### 📝 Cadastro Completo (CRUD)
- **Endereços:** CEP, rua, número, bairro, cidade, estado (validação de CEP)
- **Crianças:** Nome, data de nascimento (DD/MM/AAAA), tipo de denúncia (10 opções), vínculo com endereço
- **Responsáveis:** Nome, CPF, RG, telefone, tipo de filiação (Mãe, Pai, Avó, etc.)
- **Relatórios:** Texto descritivo vinculado a crianças
- **Encaminhamentos:** 33 tipos de organizações (Saúde, Educação, Assistência Social, Justiça, Segurança, Outros)

### 🔍 Busca e Consulta
- Busca multifuncional: por nome do responsável, CPF ou nome da criança
- Visualização completa em modal: dados pessoais, endereço, crianças, relatórios e encaminhamentos
- Lista responsiva com cards estilizados

### ✏️ Edição de Dados
- Modal de edição completo com todos os campos editáveis
- Atualização de responsáveis e endereços
- Máscaras automáticas nos campos (CPF, RG, telefone, CEP)
- Validações em tempo real

### 📊 Dashboard e Estatísticas
- **Totais:** Crianças cadastradas, responsáveis, relatórios
- **Gráficos:**
  - Denúncias por tipo (gráfico de barras)
  - Top 10 bairros (gráfico de rosca)
  - Distribuição por faixa etária (0-3, 4-6, 7-10, 11-14, 15-17 anos)
  - Encaminhamentos mais realizados (gráfico horizontal)
- Últimos 5 relatórios registrados
- Estatísticas processadas no backend

### ✅ Validações Implementadas
- **Nome:** Sem números
- **Data:** DD/MM/AAAA (validação de mês, dia, ano bissexto, não pode ser futura)
- **CPF:** 11 dígitos com formatação XXX.XXX.XXX-XX
- **RG:** 8-9 dígitos com formatação
- **Telefone:** (XX) 9XXXX-XXXX (validação de DDD brasileiro)
- **CEP:** XXXXX-XXX

---

## Endpoints da API

### CRUD Completo

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/criancas` | Listar todas as crianças |
| POST | `/criancas` | Criar nova criança |
| GET | `/criancas/{id}` | Obter criança por ID |
| DELETE | `/criancas/{id}` | Deletar criança |
| GET | `/enderecos` | Listar todos os endereços |
| POST | `/enderecos` | Criar novo endereço |
| GET | `/enderecos/{id}` | Obter endereço por ID |
| **PUT** | `/enderecos/{id}` | **Atualizar endereço** |
| DELETE | `/enderecos/{id}` | Deletar endereço |
| GET | `/filiacao` | Listar todos os responsáveis |
| POST | `/filiacao` | Criar novo responsável |
| GET | `/filiacao/{id}` | Obter responsável por ID |
| **PUT** | `/filiacao/{id}` | **Atualizar responsável** |
| DELETE | `/filiacao/{id}` | Deletar responsável |
| GET | `/relatorios` | Listar todos os relatórios |
| POST | `/relatorios` | Criar novo relatório |
| GET | `/relatorios/{id}` | Obter relatório por ID |
| **PUT** | `/relatorios/{id}` | **Atualizar relatório** |
| DELETE | `/relatorios/{id}` | Deletar relatório |
| GET | `/denunciante` | Listar denunciantes |
| POST | `/denunciante` | Criar denunciante |
| GET | `/encaminhamentos` | Listar encaminhamentos |
| POST | `/encaminhamentos` | Criar encaminhamento |
| GET | `/encaminhamentos/{id}` | Obter encaminhamento por ID |
| DELETE | `/encaminhamentos/{id}` | Deletar encaminhamento |

### Estatísticas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/estatisticas/totais` | Total de crianças, responsáveis e relatórios |
| GET | `/estatisticas/denuncias` | Agregação por tipo de denúncia |
| GET | `/estatisticas/bairros` | Top 10 bairros com mais registros |
| GET | `/estatisticas/idades` | Distribuição por faixa etária |
| GET | `/estatisticas/encaminhamentos` | Top 10 encaminhamentos mais realizados |

---

## Fluxo de Uso

### Cadastro Completo
1. **Início:** Acesse http://localhost:3000
2. **Cadastrar Endereço:** Menu "Cadastro" → Preencha CEP, rua, número, bairro, cidade, estado
3. **Cadastrar Criança(s):** Adicione nome, data de nascimento (DD/MM/AAAA), tipo de denúncia
4. **Cadastrar Responsável:** Nome, CPF, RG, telefone, tipo de filiação
5. **Sucesso:** Sistema salva automaticamente e redireciona

### Visualização e Edição
1. **Lista:** Menu "Lista" → Ver todos os responsáveis cadastrados
2. **Buscar:** Digite nome, CPF ou nome da criança no campo de busca
3. **Detalhes:** Clique no nome do responsável para ver modal com informações completas
4. **Editar:** Clique em "Editar" → Modal com todos os campos editáveis → Salvar
5. **Excluir:** Botão "Excluir" remove o registro

### Relatórios e Encaminhamentos
1. **Menu "Relatórios":** Selecione a criança
2. **Escreva o relatório:** Campo de texto livre
3. **Adicione Encaminhamentos:** Busque e selecione organizações (até 33 opções)
4. **Salvar:** Relatório e encaminhamentos são salvos vinculados à criança

### Dashboard
1. **Menu "Dashboard":** Visualize estatísticas gerais
2. **Cards:** Totais de crianças, responsáveis e relatórios
3. **Gráficos:** 4 gráficos interativos (denúncias, bairros, idades, encaminhamentos)
4. **Últimos Relatórios:** 5 registros mais recentes

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


## Estrutura do Projeto

```
Projeto-TMI-22/
│
├── backend/                    # Backend FastAPI
│   ├── main.py                # API REST (634 linhas) - todos os endpoints
│   ├── requirements.txt       # FastAPI, SQLAlchemy, Pydantic, Uvicorn
│   ├── popular_bd.py          # Script para criar 50 registros de teste
│   ├── reset_db.py            # Recria estrutura do banco
│   ├── check_db.py            # Verifica integridade do banco
│   ├── ConselhoTutelar.db     # Banco SQLite (criado automaticamente)
│   └── .venv/                 # Ambiente virtual Python
│
├── frontend/                   # Frontend JavaScript
│   ├── js/                    # Lógica da aplicação
│   │   ├── api.js             # Centralizador de chamadas HTTP
│   │   ├── header.js          # Menu de navegação
│   │   ├── enderecos.js       # Cadastro de endereços
│   │   ├── criancas.js        # Cadastro de crianças + denúncias
│   │   ├── responsaveis.js    # Cadastro de responsáveis (validações)
│   │   ├── lista.js           # Listagem, busca, edição CRUD
│   │   ├── relatorios.js      # Relatórios + encaminhamentos
│   │   └── dashboard.js       # Estatísticas e gráficos Chart.js
│   ├── telas/                 # Páginas HTML
│   │   ├── index.html         # Página inicial
│   │   ├── cadastro.html      # Hub de cadastro
│   │   ├── enderecos.html
│   │   ├── criancas.html
│   │   ├── responsaveis.html
│   │   ├── lista.html         # Listagem com modal de edição
│   │   ├── relatorios.html
│   │   └── dashboard.html     # Dashboard com 4 gráficos
│   ├── package.json           # Express, http-proxy-middleware
│   └── server.js              # Servidor dev com proxy (porta 3000→8000)
│
├── pipeline/                   # Automação
│   ├── run_dev.py             # Inicia backend + frontend juntos
│   └── README.md
│
├── README.md                   # Este arquivo
└── teste.md                    # Documentação técnica completa
```

## Arquivos Principais

| Arquivo | Linhas | Descrição |
|---------|--------|-----------|
| `backend/main.py` | 634 | API REST completa, modelos SQLAlchemy, schemas Pydantic, endpoints CRUD e estatísticas |
| `frontend/js/lista.js` | 315 | Listagem, busca, modal de visualização, modal de edição, validações |
| `frontend/js/responsaveis.js` | 240 | Validações completas (CPF, RG, telefone, data), máscaras em tempo real |
| `frontend/js/criancas.js` | 214 | Cadastro de crianças, validação de data, dropdown de denúncias com busca |
| `frontend/js/dashboard.js` | 260 | 4 gráficos Chart.js, cards de totais, lista de últimos relatórios |
| `frontend/js/relatorios.js` | 200+ | Criação de relatórios, sistema de encaminhamentos (33 organizações) |
| `backend/popular_bd.py` | 150+ | Popula banco com 50 crianças, responsáveis, 20 relatórios, encaminhamentos |

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

### Modelo de Dados (SQLite)

```
┌──────────────┐
│  enderecos   │
├──────────────┤
│ id (PK)      │
│ cep          │
│ rua          │
│ numero       │
│ bairro       │
│ cidade       │
│ estado       │
└──────┬───────┘
       │ 1:N
       ▼
┌──────────────┐
│   crianca    │
├──────────────┤
│ id (PK)      │◄─────┐
│ nome         │      │
│ data_nasc    │      │ N:1
│ endereco_id  │      │
│ denuncia     │      │
└──────┬───────┘      │
       │              │
       │ 1:N          │
       ├──────────────┤
       │              │
       ▼              │
┌──────────────┐      │
│  filiacao    │──────┘
│ (responsável)│
├──────────────┤
│ id (PK)      │
│ nome         │
│ cpf          │
│ rg           │
│ telefone     │
│ filiacao     │
│ crianca_id   │
└──────────────┘
       │
       │ 1:N
       ├──────────────┬──────────────┐
       ▼              ▼              ▼
┌──────────────┐ ┌────────────┐ ┌──────────────┐
│  relatorios  │ │denunciante │ │encaminhamento│
├──────────────┤ ├────────────┤ ├──────────────┤
│ id (PK)      │ │ id (PK)    │ │ id (PK)      │
│ texto        │ │ nome       │ │ destino      │
│ criado_em    │ │ parentesco │ │ descricao    │
│ crianca_id   │ │ telefone   │ │ criado_em    │
└──────────────┘ │ crianca_id │ │ crianca_id   │
                 └────────────┘ └──────────────┘
```

### Tabelas

| Tabela | Registros | Descrição |
|--------|-----------|-----------|
| `enderecos` | - | CEP, rua, número, bairro, cidade, estado |
| `crianca` | - | Nome, data_nascimento, endereco_id (FK), denuncia |
| `filiacao` | - | Responsáveis: nome, CPF, RG, telefone, filiacao, crianca_id (FK) |
| `relatorios` | - | Texto, criado_em, crianca_id (FK) |
| `encaminhamentos` | - | Destino, descrição, criado_em, crianca_id (FK) |
| `denunciante` | - | Nome, parentesco, telefone, crianca_id (FK) |

---

## Logs e Debug

- Frontend logs: Abra DevTools (F12) → Console
- Backend logs: Veja o terminal do PowerShell rodando uvicorn
- Database file: `backend/ConselhoTutelar.db` (SQLite)

---

## Utilitários do Projeto

### Popular Banco de Dados
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python popular_bd.py
```
Cria automaticamente:
- 50 crianças com nomes e datas variadas
- 50 responsáveis com CPFs, RGs e telefones
- 50 endereços distribuídos por 10 bairros
- 20 relatórios para as primeiras 20 crianças
- 30-60 encaminhamentos variados
- 10 tipos diferentes de denúncias

### Resetar Banco de Dados
```powershell
python reset_db.py
```
Deleta e recria todas as tabelas (perde todos os dados).

### Verificar Banco
```powershell
python check_db.py
```
Exibe estrutura das tabelas e contagem de registros.

---

## Tecnologias e Bibliotecas

### Backend
- **Python 3.11**
- **FastAPI 0.104.1** - Framework web moderno e rápido
- **SQLAlchemy 2.0.23** - ORM para Python
- **Pydantic** - Validação de dados
- **Uvicorn** - Servidor ASGI
- **SQLite 3** - Banco de dados embutido

### Frontend
- **JavaScript ES6** - Módulos nativos
- **Tailwind CSS** - Framework CSS via CDN
- **Chart.js** - Biblioteca de gráficos
- **Express 5.1.0** - Servidor de desenvolvimento
- **http-proxy-middleware** - Proxy para evitar CORS

---

## Funcionalidades Implementadas

✅ CRUD completo para todas as entidades (Create, Read, Update, Delete)  
✅ Validações completas de CPF, RG, telefone, CEP, datas  
✅ Máscaras automáticas em tempo real  
✅ Sistema de busca multifuncional  
✅ Modal de visualização detalhada  
✅ Modal de edição com todos os campos  
✅ Dashboard com 4 gráficos interativos  
✅ Estatísticas processadas no backend  
✅ Sistema de encaminhamentos (33 organizações)  
✅ Tipos de denúncia (10 opções)  
✅ Persistência em banco SQLite  
✅ API REST documentada (Swagger)  
✅ Script de população automática  
✅ Proxy de desenvolvimento configurado  

---

## Melhorias Futuras

- [ ] Sistema de autenticação com JWT
- [ ] Controle de acesso por níveis (admin/usuário)
- [ ] Exportação de relatórios em PDF (ReportLab)
- [ ] Paginação nas listagens
- [ ] Filtros de data no dashboard
- [ ] Validação de CPF com dígitos verificadores
- [ ] Sistema de anexos (upload de arquivos)
- [ ] Notificações por email/SMS
- [ ] Histórico de alterações (audit log)
- [ ] Testes automatizados (pytest, Jest)
- [ ] Migração para PostgreSQL (produção)
- [ ] Deploy com Docker

---

**Última atualização:** 11 de dezembro de 2025  
**Status:** ✅ Funcional - CRUD Completo + Dashboard + Validações + Estatísticas  
**Desenvolvedores:** Helmer Araújo, Kayck William, Victor de Souza e Weslley Santos
**Repositório:** https://github.com/KayckWilliam/Projeto-TMI-22 
