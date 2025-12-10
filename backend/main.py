from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base
from pydantic import BaseModel
from typing import Optional

# Database configuration
db = create_engine('sqlite:///ConselhoTutelar.db')
Session = sessionmaker(bind=db)
session = Session()
Base = declarative_base()

# FastAPI app
app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ====== DATABASE MODELS ======

class Endereco(Base):
    __tablename__ = 'enderecos'

    id = Column('id', Integer, primary_key=True, autoincrement=True)
    cep = Column('cep', String,)
    rua = Column('rua', String)
    numero = Column('numero', String)
    bairro = Column('bairro', String)
    cidade = Column('cidade', String)
    estado = Column('estado', String)

    def __init__(self, cep, rua, numero, bairro, cidade, estado):
        self.cep = cep
        self.rua = rua
        self.numero = numero
        self.bairro = bairro
        self.cidade = cidade
        self.estado = estado

class Crianca(Base):
    __tablename__ = 'crianca'

    id = Column('id', Integer, primary_key=True, autoincrement=True)
    nome = Column('nome', String)
    data_nascimento = Column('data_nascimento', String)
    endereco_id = Column('endereco_id', ForeignKey('enderecos.id'))

    def __init__(self, nome, data_nascimento, endereco):
        self.nome = nome
        self.data_nascimento = data_nascimento
        self.endereco_id = endereco

class Filiacao(Base):
    __tablename__ = 'filiacao'

    id = Column('id', Integer, primary_key=True, autoincrement=True)
    nome = Column('nome', String)
    cpf = Column('cpf', String)
    rg = Column('rg', String)
    telefone = Column('telefone', String)
    crianca_id = Column('crianca_id', ForeignKey('crianca.id'))

    def __init__(self, nome, cpf, rg, telefone, crianca_id):
        self.nome = nome
        self.cpf = cpf
        self.rg = rg
        self.telefone = telefone
        self.crianca_id = crianca_id

class Denunciante(Base):
    __tablename__ = 'denunciante'

    id = Column('id', Integer, primary_key=True, autoincrement=True)
    nome = Column('nome', String)
    parentesco = Column('parentesco', String)
    telefone = Column('telefone', String)
    crianca_id = Column('crianca_id', ForeignKey('crianca.id'))

    def __init__(self, nome, parentesco, telefone, crianca_id):
        self.nome = nome
        self.parentesco = parentesco
        self.telefone = telefone
        self.crianca_id = crianca_id

class Relatorio(Base):
    __tablename__ = 'relatorios'

    id = Column('id', Integer, primary_key=True, autoincrement=True)
    texto = Column('texto', String)
    criado_em = Column('criado_em', String)
    crianca_id = Column('crianca_id', ForeignKey('crianca.id'))

    def __init__(self, texto, criado_em, crianca_id):
        self.texto = texto
        self.criado_em = criado_em
        self.crianca_id = crianca_id

class Encaminhamento(Base):
    __tablename__ = 'encaminhamentos'

    id = Column('id', Integer, primary_key=True, autoincrement=True)
    destino = Column('destino', String)
    descricao = Column('descricao', String)
    criado_em = Column('criado_em', String)
    crianca_id = Column('crianca_id', ForeignKey('crianca.id'))

    def __init__(self, destino, descricao, crianca_id):
        self.destino = destino
        self.descricao = descricao
        self.crianca_id = crianca_id

Base.metadata.create_all(bind=db)

# ====== PYDANTIC SCHEMAS ======

class EnderecoSchema(BaseModel):
    id: Optional[int] = None
    cep: str
    rua: str
    numero: str
    bairro: str
    cidade: str
    estado: str

class CriancaSchema(BaseModel):
    id: Optional[int] = None
    nome: str
    data_nascimento: str
    endereco_id: int

class FiliacaoSchema(BaseModel):
    id: Optional[int] = None
    nome: str
    cpf: str
    rg: str
    telefone: str
    crianca_id: int

class DenuncianteSchema(BaseModel):
    id: Optional[int] = None
    nome: str
    parentesco: str
    telefone: str
    crianca_id: int

class RelatorioSchema(BaseModel):
    id: Optional[int] = None
    texto: str
    criado_em: str
    crianca_id: int

class EncaminhamentoSchema(BaseModel):
    id: Optional[int] = None
    destino: str
    descricao: str
    criado_em: str
    crianca_id: int

# ====== API ENDPOINTS ======

@app.get("/")
def read_root():
    return {"message": "Conselho Tutelar API"}



# Enderecos
@app.get("/enderecos")
def get_enderecos():
    enderecos = session.query(Endereco).all()
    return [{"id": e.id, "cep": e.cep, "rua": e.rua, "numero": e.numero, "bairro": e.bairro, "cidade": e.cidade, "estado": e.estado} for e in enderecos]

@app.get("/enderecos/{id}")
def get_endereco(id: int):
    endereco = session.query(Endereco).filter_by(id=id).first()
    if not endereco:
        return {"error": "Endereco not found"}, 404
    return {"id": endereco.id, "cep": endereco.cep, "rua": endereco.rua, "numero": endereco.numero, "bairro": endereco.bairro, "cidade": endereco.cidade, "estado": endereco.estado}

@app.post("/enderecos")
def create_endereco(endereco: EnderecoSchema):
    new_endereco = Endereco(endereco.cep, endereco.rua, endereco.numero, endereco.bairro, endereco.cidade, endereco.estado)
    session.add(new_endereco)
    session.commit()
    return {"id": new_endereco.id, "message": "Endereco created"}

@app.delete("/enderecos/{id}")
def delete_endereco(id: int):
    endereco = session.query(Endereco).filter_by(id=id).first()
    if not endereco:
        return {"error": "Endereco not found"}, 404
    session.delete(endereco)
    session.commit()
    return {"message": "Endereco deleted"}

# Criancas
@app.get("/criancas")
def get_criancas():
    criancas = session.query(Crianca).all()
    return [{"id": c.id, "nome": c.nome, "data_nascimento": c.data_nascimento, "endereco_id": c.endereco_id} for c in criancas]

@app.get("/criancas/{id}")
def get_crianca(id: int):
    crianca = session.query(Crianca).filter_by(id=id).first()
    if not crianca:
        return {"error": "Crianca not found"}, 404
    return {"id": crianca.id, "nome": crianca.nome, "data_nascimento": crianca.data_nascimento, "endereco_id": crianca.endereco_id}

@app.post("/criancas")
def create_crianca(crianca: CriancaSchema):
    new_crianca = Crianca(crianca.nome, crianca.data_nascimento, crianca.endereco_id)
    session.add(new_crianca)
    session.commit()
    return {"id": new_crianca.id, "message": "Crianca created"}

@app.delete("/criancas/{id}")
def delete_crianca(id: int):
    crianca = session.query(Crianca).filter_by(id=id).first()
    if not crianca:
        return {"error": "Crianca not found"}, 404
    session.delete(crianca)
    session.commit()
    return {"message": "Crianca deleted"}

# Filiacao
@app.get("/filiacao")
def get_filiacao():
    filiacao = session.query(Filiacao).all()
    return [{"id": f.id, "nome": f.nome, "cpf": f.cpf, "rg": f.rg, "telefone": f.telefone, "crianca_id": f.crianca_id} for f in filiacao]

@app.get("/filiacao/{id}")
def get_filiacao_by_id(id: int):
    filiacao = session.query(Filiacao).filter_by(id=id).first()
    if not filiacao:
        return {"error": "Filiacao not found"}, 404
    return {"id": filiacao.id, "nome": filiacao.nome, "cpf": filiacao.cpf, "rg": filiacao.rg, "telefone": filiacao.telefone, "crianca_id": filiacao.crianca_id}

@app.post("/filiacao")
def create_filiacao(filiacao: FiliacaoSchema):
    new_filiacao = Filiacao(filiacao.nome, filiacao.cpf, filiacao.rg, filiacao.telefone, filiacao.crianca_id)
    session.add(new_filiacao)
    session.commit()
    return {"id": new_filiacao.id, "message": "Filiacao created"}

@app.delete("/filiacao/{id}")
def delete_filiacao(id: int):
    filiacao = session.query(Filiacao).filter_by(id=id).first()
    if not filiacao:
        return {"error": "Filiacao not found"}, 404
    session.delete(filiacao)
    session.commit()
    return {"message": "Filiacao deleted"}

# Denunciante
@app.get("/denunciante")
def get_denunciante():
    denunciante = session.query(Denunciante).all()
    return [{"id": d.id, "nome": d.nome, "parentesco": d.parentesco, "telefone": d.telefone, "crianca_id": d.crianca_id} for d in denunciante]

@app.get("/denunciante/{id}")
def get_denunciante_by_id(id: int):
    denunciante = session.query(Denunciante).filter_by(id=id).first()
    if not denunciante:
        return {"error": "Denunciante not found"}, 404
    return {"id": denunciante.id, "nome": denunciante.nome, "parentesco": denunciante.parentesco, "telefone": denunciante.telefone, "crianca_id": denunciante.crianca_id}

@app.post("/denunciante")
def create_denunciante(denunciante: DenuncianteSchema):
    new_denunciante = Denunciante(denunciante.nome, denunciante.parentesco, denunciante.telefone, denunciante.crianca_id)
    session.add(new_denunciante)
    session.commit()
    return {"id": new_denunciante.id, "message": "Denunciante created"}

@app.delete("/denunciante/{id}")
def delete_denunciante(id: int):
    denunciante = session.query(Denunciante).filter_by(id=id).first()
    if not denunciante:
        return {"error": "Denunciante not found"}, 404
    session.delete(denunciante)
    session.commit()
    return {"message": "Denunciante deleted"}

# Relatorio
@app.get("/relatorios")
def get_relatorios():
    relatorios = session.query(Relatorio).all()
    return [{"id": r.id, "texto": r.texto, "criado_em": r.criado_em, "crianca_id": r.crianca_id} for r in relatorios]

@app.get("/relatorios/{id}")
def get_relatorio(id: int):
    relatorio = session.query(Relatorio).filter_by(id=id).first()
    if not relatorio:
        return {"error": "Relatorio not found"}, 404
    return {"id": relatorio.id, "texto": relatorio.texto, "criado_em": relatorio.criado_em, "crianca_id": relatorio.crianca_id}

@app.post("/relatorios")
def create_relatorio(relatorio: RelatorioSchema):
    new_relatorio = Relatorio(relatorio.texto, relatorio.criado_em, relatorio.crianca_id)
    session.add(new_relatorio)
    session.commit()
    return {"id": new_relatorio.id, "message": "Relatorio created"}

@app.delete("/relatorios/{id}")
def delete_relatorio(id: int):
    relatorio = session.query(Relatorio).filter_by(id=id).first()
    if not relatorio:
        return {"error": "Relatorio not found"}, 404
    session.delete(relatorio)
    session.commit()
    return {"message": "Relatorio deleted"}

# Encaminhamento
@app.get("/encaminhamentos")
def get_encaminhamentos():
    encaminhamentos = session.query(Encaminhamento).all()
    return [{"id": e.id, "destino": e.destino, "descricao": e.descricao, "criado_em": e.criado_em, "crianca_id": e.crianca_id} for e in encaminhamentos]

@app.get("/encaminhamentos/{id}")
def get_encaminhamento(id: int):
    encaminhamento = session.query(Encaminhamento).filter_by(id=id).first()
    if not encaminhamento:
        return {"error": "Encaminhamento not found"}, 404
    return {"id": encaminhamento.id, "destino": encaminhamento.destino, "descricao": encaminhamento.descricao, "criado_em": encaminhamento.criado_em, "crianca_id": encaminhamento.crianca_id}

@app.post("/encaminhamentos")
def create_encaminhamento(encaminhamento: EncaminhamentoSchema):
    new_encaminhamento = Encaminhamento(encaminhamento.destino, encaminhamento.descricao, encaminhamento.crianca_id)
    session.add(new_encaminhamento)
    session.commit()
    return {"id": new_encaminhamento.id, "message": "Encaminhamento created"}

@app.delete("/encaminhamentos/{id}")
def delete_encaminhamento(id: int):
    encaminhamento = session.query(Encaminhamento).filter_by(id=id).first()
    if not encaminhamento:
        return {"error": "Encaminhamento not found"}, 404
    session.delete(encaminhamento)
    session.commit()
    return {"message": "Encaminhamento deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
