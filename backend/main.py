from sqlalchemy import create_engine, Column, Integer, String, Boolean,ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base

db = create_engine('sqlite:///ConselhoTutelar.db')
Session = sessionmaker(bind=db)
session = Session()

Base = declarative_base()

# As Tabelas

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

    def __init__(self, texto, crianca_id):
        self.texto = texto
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
