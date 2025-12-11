from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base
from pydantic import BaseModel, field_validator
from typing import Optional
import re
from datetime import datetime, date

# Configuração do banco de dados
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

# ====== Modelos do banco de dados ======

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
    denuncia = Column('denuncia', String)

    def __init__(self, nome, data_nascimento, endereco, denuncia=None):
        self.nome = nome
        self.data_nascimento = data_nascimento
        self.endereco_id = endereco
        self.denuncia = denuncia

class Filiacao(Base):
    __tablename__ = 'filiacao'

    id = Column('id', Integer, primary_key=True, autoincrement=True)
    nome = Column('nome', String)
    cpf = Column('cpf', String)
    rg = Column('rg', String)
    telefone = Column('telefone', String)
    filiacao = Column('filiacao', String)
    crianca_id = Column('crianca_id', ForeignKey('crianca.id'))

    def __init__(self, nome, cpf, rg, telefone, filiacao, crianca_id):
        self.nome = nome
        self.cpf = cpf
        self.rg = rg
        self.telefone = telefone
        self.filiacao = filiacao
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
        self.criado_em = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

Base.metadata.create_all(bind=db)

# ====== Esquemas Pydantic ======

class EnderecoSchema(BaseModel):
    id: Optional[int] = None
    cep: str
    rua: str
    numero: str
    bairro: str
    cidade: str
    estado: str

    @field_validator('cep')
    @classmethod
    def validar_cep(cls, v):
        # Remove caracteres não numéricos
        cep_limpo = re.sub(r'\D', '', v)
        
        # Verifica se tem exatamente 8 dígitos
        if len(cep_limpo) != 8:
            raise ValueError('CEP deve conter exatamente 8 dígitos')
        
        # Verifica se não é sequência inválida como 00000000
        if re.match(r'^0+$', cep_limpo):
            raise ValueError('CEP inválido')
        
        # Verifica se o prefixo está na faixa válida (01000 a 99999)
        prefixo = int(cep_limpo[:5])
        if prefixo < 1000:
            raise ValueError('CEP fora da faixa válida')
        
        return v
    
    @field_validator('estado')
    @classmethod
    def validar_estado(cls, v):
        estados_validos = [
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
            'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
            'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
        ]
        
        if v.upper() not in estados_validos:
            raise ValueError(f'Estado inválido. Use uma das siglas: {", ".join(estados_validos)}')
        
        return v.upper()

class CriancaSchema(BaseModel):
    id: Optional[int] = None
    nome: str
    data_nascimento: str
    endereco_id: int
    denuncia: Optional[str] = None

    @field_validator('nome')
    @classmethod
    def validar_nome(cls, v):
        # Verifica se contém números
        if re.search(r'\d', v):
            raise ValueError('Nome não pode conter números')
        
        # Verifica se não está vazio após trim
        if not v.strip():
            raise ValueError('Nome não pode estar vazio')
        
        return v.strip()
    
    @field_validator('data_nascimento')
    @classmethod
    def validar_data_nascimento(cls, v):
        # Verifica formato YYYY-MM-DD
        if not re.match(r'^\d{4}-\d{2}-\d{2}$', v):
            raise ValueError('Data deve estar no formato YYYY-MM-DD')
        
        try:
            data = datetime.strptime(v, '%Y-%m-%d').date()
        except ValueError:
            raise ValueError('Data inválida')
        
        # Verifica se não é data futura
        if data > date.today():
            raise ValueError('Data de nascimento não pode ser futura')
        
        # Verifica se o ano está entre 1900 e ano atual
        if data.year < 1900:
            raise ValueError('Data de nascimento deve ser após 1900')
        
        # Verifica idade máxima razoável (ex: 150 anos)
        idade = (date.today() - data).days // 365
        if idade > 150:
            raise ValueError('Data de nascimento inválida')
        
        return v

class FiliacaoSchema(BaseModel):
    id: Optional[int] = None
    nome: str
    cpf: str
    rg: str
    telefone: str
    filiacao: str
    crianca_id: int
    
    @field_validator('nome')
    def validar_nome(cls, v):
        if re.search(r'\d', v):
            raise ValueError('Nome não pode conter números')
        return v
    
    @field_validator('cpf')
    def validar_cpf(cls, v):
        # Remove caracteres não numéricos
        cpf = re.sub(r'\D', '', v)
        
        # Verifica se tem 11 dígitos
        if len(cpf) != 11:
            raise ValueError('CPF deve ter 11 dígitos')
        
        # Verifica se contém apenas números
        if not cpf.isdigit():
            raise ValueError('CPF deve conter apenas números')
        
        return cpf
    
    @field_validator('rg')
    def validar_rg(cls, v):
        # Remove caracteres não numéricos
        rg = re.sub(r'\D', '', v)
        
        # Verifica se tem entre 8 e 9 dígitos
        if not re.match(r'^\d{8,9}$', rg):
            raise ValueError('RG deve conter apenas números (8 ou 9 dígitos)')
        
        return rg
    
    @field_validator('telefone')
    def validar_telefone(cls, v):
        # Remove caracteres não numéricos
        telefone = re.sub(r'\D', '', v)
        
        # Aceita 11 dígitos (com DDD) ou 9 dígitos (sem DDD)
        if len(telefone) == 11:
            # Com DDD: verifica se DDD é válido e terceiro dígito é 9
            ddd = int(telefone[:2])
            if ddd < 11 or ddd > 99:
                raise ValueError('DDD inválido')
            
            if telefone[2] != '9':
                raise ValueError('Telefone celular deve começar com 9 após o DDD')
            
        elif len(telefone) == 9:
            # Sem DDD: primeiro dígito deve ser 9
            if telefone[0] != '9':
                raise ValueError('Telefone celular deve começar com 9')
        else:
            raise ValueError('Telefone deve ter 11 dígitos (com DDD) ou 9 dígitos (sem DDD)')
        
        return telefone

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
    criado_em: Optional[str] = None
    crianca_id: int

# ====== Endpoints da API ======

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

@app.put("/enderecos/{id}")
def update_endereco(id: int, endereco: EnderecoSchema):
    existing_endereco = session.query(Endereco).filter_by(id=id).first()
    if not existing_endereco:
        raise HTTPException(status_code=404, detail="Endereco not found")
    
    existing_endereco.cep = endereco.cep
    existing_endereco.rua = endereco.rua
    existing_endereco.numero = endereco.numero
    existing_endereco.bairro = endereco.bairro
    existing_endereco.cidade = endereco.cidade
    existing_endereco.estado = endereco.estado
    
    session.commit()
    return {"id": existing_endereco.id, "message": "Endereco updated"}

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
    return [{"id": c.id, "nome": c.nome, "data_nascimento": c.data_nascimento, "endereco_id": c.endereco_id, "denuncia": c.denuncia} for c in criancas]

@app.get("/criancas/{id}")
def get_crianca(id: int):
    crianca = session.query(Crianca).filter_by(id=id).first()
    if not crianca:
        return {"error": "Crianca not found"}, 404
    return {"id": crianca.id, "nome": crianca.nome, "data_nascimento": crianca.data_nascimento, "endereco_id": crianca.endereco_id, "denuncia": crianca.denuncia}

@app.post("/criancas")
def create_crianca(crianca: CriancaSchema):
    new_crianca = Crianca(crianca.nome, crianca.data_nascimento, crianca.endereco_id, crianca.denuncia)
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
    return [{"id": f.id, "nome": f.nome, "cpf": f.cpf, "rg": f.rg, "telefone": f.telefone, "filiacao": f.filiacao, "crianca_id": f.crianca_id} for f in filiacao]

@app.get("/filiacao/{id}")
def get_filiacao_by_id(id: int):
    filiacao = session.query(Filiacao).filter_by(id=id).first()
    if not filiacao:
        return {"error": "Filiacao not found"}, 404
    return {"id": filiacao.id, "nome": filiacao.nome, "cpf": filiacao.cpf, "rg": filiacao.rg, "telefone": filiacao.telefone, "filiacao": filiacao.filiacao, "crianca_id": filiacao.crianca_id}

@app.post("/filiacao")
def create_filiacao(filiacao: FiliacaoSchema):
    new_filiacao = Filiacao(filiacao.nome, filiacao.cpf, filiacao.rg, filiacao.telefone, filiacao.filiacao, filiacao.crianca_id)
    session.add(new_filiacao)
    session.commit()
    return {"id": new_filiacao.id, "message": "Filiacao created"}

@app.put("/filiacao/{id}")
def update_filiacao(id: int, filiacao: FiliacaoSchema):
    existing_filiacao = session.query(Filiacao).filter_by(id=id).first()
    if not existing_filiacao:
        raise HTTPException(status_code=404, detail="Filiacao not found")
    
    existing_filiacao.nome = filiacao.nome
    existing_filiacao.cpf = filiacao.cpf
    existing_filiacao.rg = filiacao.rg
    existing_filiacao.telefone = filiacao.telefone
    existing_filiacao.filiacao = filiacao.filiacao
    existing_filiacao.crianca_id = filiacao.crianca_id
    
    session.commit()
    return {"id": existing_filiacao.id, "message": "Filiacao updated"}

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

@app.put("/relatorios/{id}")
def update_relatorio(id: int, relatorio: RelatorioSchema):
    existing_relatorio = session.query(Relatorio).filter_by(id=id).first()
    if not existing_relatorio:
        raise HTTPException(status_code=404, detail="Relatorio not found")
    
    existing_relatorio.texto = relatorio.texto
    existing_relatorio.crianca_id = relatorio.crianca_id
    # Mantém a data de criação original, não atualiza criado_em
    
    session.commit()
    return {"id": existing_relatorio.id, "message": "Relatorio updated"}

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

# Estatisticas
@app.get("/estatisticas/totais")
def get_estatisticas_totais():
    total_criancas = session.query(Crianca).count()
    total_responsaveis = session.query(Filiacao).count()
    total_relatorios = session.query(Relatorio).count()
    
    return {
        "total_criancas": total_criancas,
        "total_responsaveis": total_responsaveis,
        "total_relatorios": total_relatorios
    }

@app.get("/estatisticas/denuncias")
def get_estatisticas_denuncias():
    from sqlalchemy import func
    
    # Agrupa e conta por tipo de denúncia
    resultado = session.query(
        Crianca.denuncia,
        func.count(Crianca.id).label('quantidade')
    ).filter(
        Crianca.denuncia.isnot(None)
    ).group_by(
        Crianca.denuncia
    ).order_by(
        func.count(Crianca.id).desc()
    ).all()
    
    # Simplifica o tipo de denúncia (remove o que está entre parênteses)
    denuncias_agrupadas = {}
    for denuncia, quantidade in resultado:
        tipo_simples = denuncia.split('(')[0].strip()
        denuncias_agrupadas[tipo_simples] = denuncias_agrupadas.get(tipo_simples, 0) + quantidade
    
    # Converte para lista ordenada
    denuncias_lista = [
        {"tipo": tipo, "quantidade": qtd}
        for tipo, qtd in sorted(denuncias_agrupadas.items(), key=lambda x: x[1], reverse=True)
    ]
    
    return denuncias_lista

@app.get("/estatisticas/bairros")
def get_estatisticas_bairros():
    from sqlalchemy import func
    
    # Agrupa crianças por bairro através do endereço
    resultado = session.query(
        Endereco.bairro,
        func.count(Crianca.id).label('quantidade')
    ).join(
        Crianca, Crianca.endereco_id == Endereco.id
    ).group_by(
        Endereco.bairro
    ).order_by(
        func.count(Crianca.id).desc()
    ).limit(10).all()
    
    bairros_lista = [
        {"bairro": bairro, "quantidade": quantidade}
        for bairro, quantidade in resultado
    ]
    
    return bairros_lista

@app.get("/estatisticas/idades")
def get_estatisticas_idades():
    from datetime import datetime
    
    criancas = session.query(Crianca).all()
    
    # Calcula idade de cada criança e agrupa por faixa etária
    faixas = {
        "0-3 anos": 0,
        "4-6 anos": 0,
        "7-10 anos": 0,
        "11-14 anos": 0,
        "15-17 anos": 0
    }
    
    hoje = datetime.now()
    
    for crianca in criancas:
        try:
            # Converte string YYYY-MM-DD para datetime
            data_nasc = datetime.strptime(crianca.data_nascimento, '%Y-%m-%d')
            idade = hoje.year - data_nasc.year - ((hoje.month, hoje.day) < (data_nasc.month, data_nasc.day))
            
            if idade <= 3:
                faixas["0-3 anos"] += 1
            elif idade <= 6:
                faixas["4-6 anos"] += 1
            elif idade <= 10:
                faixas["7-10 anos"] += 1
            elif idade <= 14:
                faixas["11-14 anos"] += 1
            elif idade <= 17:
                faixas["15-17 anos"] += 1
        except:
            continue
    
    idades_lista = [
        {"faixa": faixa, "quantidade": quantidade}
        for faixa, quantidade in faixas.items()
    ]
    
    return idades_lista

@app.get("/estatisticas/encaminhamentos")
def get_estatisticas_encaminhamentos():
    from sqlalchemy import func
    
    # Agrupa e conta por destino de encaminhamento
    resultado = session.query(
        Encaminhamento.destino,
        func.count(Encaminhamento.id).label('quantidade')
    ).group_by(
        Encaminhamento.destino
    ).order_by(
        func.count(Encaminhamento.id).desc()
    ).limit(10).all()
    
    encaminhamentos_lista = [
        {"destino": destino, "quantidade": quantidade}
        for destino, quantidade in resultado
    ]
    
    return encaminhamentos_lista

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
