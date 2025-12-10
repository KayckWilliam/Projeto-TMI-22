"""
Script para resetar o banco de dados SQLite
Execute isso se tiver problemas com a estrutura das tabelas
"""
import os
import time
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base

# Remover banco de dados antigo
db_path = 'ConselhoTutelar.db'
if os.path.exists(db_path):
    try:
        os.remove(db_path)
        print(f"❌ Banco de dados antigo removido: {db_path}")
    except PermissionError:
        print(f"⚠️  Banco de dados está em uso. Aguardando...")
        # Tenta novamente após aguardar
        for i in range(5):
            try:
                os.remove(db_path)
                print(f"❌ Banco de dados antigo removido após {i+1} tentativa(s): {db_path}")
                break
            except PermissionError:
                time.sleep(1)
        else:
            print(f"❌ Não foi possível remover o banco. Feche o backend e tente novamente.")
            exit(1)

# Recriar banco de dados com nova estrutura
db = create_engine(f'sqlite:///{db_path}')
Base = declarative_base()

# Definir modelos
class Endereco(Base):
    __tablename__ = 'enderecos'
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    cep = Column('cep', String)
    rua = Column('rua', String)
    numero = Column('numero', String)
    bairro = Column('bairro', String)
    cidade = Column('cidade', String)
    estado = Column('estado', String)

class Crianca(Base):
    __tablename__ = 'crianca'
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    nome = Column('nome', String)
    data_nascimento = Column('data_nascimento', String)
    endereco_id = Column('endereco_id', ForeignKey('enderecos.id'))

class Relatorio(Base):
    __tablename__ = 'relatorios'
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    texto = Column('texto', String)
    criado_em = Column('criado_em', String)
    crianca_id = Column('crianca_id', ForeignKey('crianca.id'))

class Filiacao(Base):
    __tablename__ = 'filiacao'
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    nome = Column('nome', String)
    cpf = Column('cpf', String)
    rg = Column('rg', String)
    telefone = Column('telefone', String)
    crianca_id = Column('crianca_id', ForeignKey('crianca.id'))

class Denunciante(Base):
    __tablename__ = 'denunciante'
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    nome = Column('nome', String)
    parentesco = Column('parentesco', String)
    telefone = Column('telefone', String)
    crianca_id = Column('crianca_id', ForeignKey('crianca.id'))

class Encaminhamento(Base):
    __tablename__ = 'encaminhamentos'
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    destino = Column('destino', String)
    descricao = Column('descricao', String)
    criado_em = Column('criado_em', String)
    crianca_id = Column('crianca_id', ForeignKey('crianca.id'))

# Criar todas as tabelas
Base.metadata.create_all(bind=db)
print(f"✅ Banco de dados criado com sucesso: {db_path}")
print("📋 Tabelas criadas: enderecos, crianca, relatorios, filiacao, denunciante, encaminhamentos")
