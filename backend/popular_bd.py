"""
Script para popular o banco de dados com dados de exemplo
Gera 50 cadastros completos automaticamente
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import Endereco, Crianca, Filiacao, Relatorio, Encaminhamento, Base
import random
from datetime import datetime

# Conecta ao banco
db = create_engine('sqlite:///ConselhoTutelar.db')
Session = sessionmaker(bind=db)
session = Session()

print("Populando banco de dados")

# Listas de nomes para gerar dados variados
nomes_masculinos = ["João", "Pedro", "Lucas", "Gabriel", "Rafael", "Carlos", "Fernando", "Ricardo", "Roberto", "Antonio", 
                     "Marcos", "Paulo", "Thiago", "Felipe", "Bruno", "Diego", "Eduardo", "Gustavo", "André", "Rodrigo",
                     "Daniel", "Leonardo", "Vinicius", "Matheus", "Guilherme"]
nomes_femininos = ["Maria", "Ana", "Julia", "Beatriz", "Carolina", "Camila", "Fernanda", "Patricia", "Mariana", "Juliana",
                   "Amanda", "Larissa", "Gabriela", "Isabela", "Leticia", "Bianca", "Natalia", "Rafaela", "Aline", "Carla",
                   "Daniela", "Tatiana", "Vanessa", "Bruna", "Monica"]
sobrenomes = ["Silva", "Santos", "Oliveira", "Costa", "Ferreira", "Rodrigues", "Lima", "Souza", "Almeida", "Martins",
              "Pereira", "Ribeiro", "Carvalho", "Gomes", "Rocha", "Barbosa", "Dias", "Nascimento", "Campos", "Teixeira",
              "Moreira", "Correia", "Mendes", "Monteiro", "Araujo"]

ruas = ["Rua das Flores", "Av. Eduardo Ribeiro", "Rua José Paranaguá", "Av. Sete de Setembro", "Rua Miranda Leão",
        "Av. Getúlio Vargas", "Rua Barroso", "Av. Joaquim Nabuco", "Rua Henrique Martins", "Av. Djalma Batista",
        "Rua Ferreira Pena", "Av. Constantino Nery", "Rua Lobo D'Almada", "Av. Torquato Tapajós", "Rua 10 de Julho",
        "Av. Grande Circular", "Rua Mundurucus", "Av. Max Teixeira", "Rua Leonardo Malcher", "Av. André Araújo"]

bairros = ["Centro", "Chapada", "Adrianópolis", "Aleixo", "Flores", "Parque 10", "Nossa Senhora das Graças",
           "São Francisco", "Coroado", "Cidade Nova", "Compensa", "São Jorge", "Tarumã", "Japiim", "Petrópolis"]

filiacao_tipos = ["pai", "mãe", "avô", "avó", "tio", "tia"]

tipos_denuncia = [
    "Violência física (agressões, lesões corporais)",
    "Violência psicológica (ameaças, humilhação, bullying)",
    "Abuso sexual (estupro de vulnerável, assédio sexual)",
    "Exploração sexual (prostituição, pornografia infantil)",
    "Negligência (abandono material, falta de cuidados básicos)",
    "Trabalho infantil (exploração laboral)",
    "Tráfico de crianças e adolescentes",
    "Alienação parental",
    "Violência institucional (por agentes do Estado)",
    "Discriminação (racismo, LGBTQIA+fobia, preconceito)"
]

tipos_encaminhamento = [
    "Ministério Público (MP)",
    "Vara da Infância e da Juventude (VIJ)",
    "CRAS (Centro de Referência de Assistência Social)",
    "CREAS (Centro de Referência Especializado)",
    "UBS (Unidade Básica de Saúde)",
    "CAPS (Centro de Atenção Psicossocial)",
    "Escolas Públicas / Secretaria de Educação",
    "Defensoria Pública",
    "Polícia Civil",
    "Abrigos Institucionais"
]

# Gera 50 endereços diferentes
enderecos_data = []
for i in range(50):
    enderecos_data.append({
        "cep": f"690{i:02d}{random.randint(100, 999)}",
        "rua": random.choice(ruas),
        "numero": str(random.randint(10, 9999)),
        "bairro": random.choice(bairros),
        "cidade": "Manaus",
        "estado": "AM"
    })

# Gera 50 crianças com nomes aleatórios
criancas_data = []
for i in range(50):
    genero = random.choice(["M", "F"])
    nome = random.choice(nomes_masculinos if genero == "M" else nomes_femininos)
    sobrenome = random.choice(sobrenomes)
    ano = random.randint(2010, 2020)
    mes = random.randint(1, 12)
    dia = random.randint(1, 28)
    
    criancas_data.append({
        "nome": f"{nome} {sobrenome}",
        "data_nascimento": f"{ano}-{mes:02d}-{dia:02d}",
        "denuncia": random.choice(tipos_denuncia)
    })

# Gera 50 responsáveis
responsaveis_data = []
for i in range(50):
    genero = random.choice(["M", "F"])
    nome = random.choice(nomes_masculinos if genero == "M" else nomes_femininos)
    sobrenome1 = random.choice(sobrenomes)
    sobrenome2 = random.choice(sobrenomes)
    
    # Gera CPF e RG únicos
    cpf = f"{random.randint(10000000000, 99999999999)}"
    rg = f"{random.randint(100000000, 999999999)}"
    telefone = f"92{random.choice([991, 992, 993, 994, 995, 996, 997, 998, 999])}{random.randint(100000, 999999)}"
    
    # Define filiação baseada no gênero
    if genero == "M":
        filiacao = random.choice(["pai", "avô", "tio"])
    else:
        filiacao = random.choice(["mãe", "avó", "tia"])
    
    responsaveis_data.append({
        "nome": f"{nome} {sobrenome1} {sobrenome2}",
        "cpf": cpf,
        "rg": rg,
        "telefone": telefone,
        "filiacao": filiacao
    })

try:
    # Insere endereços
    enderecos_ids = []
    for i, end_data in enumerate(enderecos_data):
        endereco = Endereco(**end_data)
        session.add(endereco)
        session.commit()
        enderecos_ids.append(endereco.id)
        print(f"Endereço {i+1}/50 criado: {end_data['rua']}, {end_data['bairro']}")
    
    # Insere crianças
    criancas_ids = []
    for i, cri_data in enumerate(criancas_data):
        crianca = Crianca(
            nome=cri_data["nome"],
            data_nascimento=cri_data["data_nascimento"],
            endereco=enderecos_ids[i],
            denuncia=cri_data["denuncia"]
        )
        session.add(crianca)
        session.commit()
        criancas_ids.append(crianca.id)
        print(f"Criança {i+1}/50 criada: {cri_data['nome']}")
    
    # Insere responsáveis
    for i, resp_data in enumerate(responsaveis_data):
        responsavel = Filiacao(
            nome=resp_data["nome"],
            cpf=resp_data["cpf"],
            rg=resp_data["rg"],
            telefone=resp_data["telefone"],
            filiacao=resp_data["filiacao"],
            crianca_id=criancas_ids[i]
        )
        session.add(responsavel)
        session.commit()
        print(f"Responsável {i+1}/50 criado: {resp_data['nome']} ({resp_data['filiacao']})")
    
    # Insere relatórios para algumas crianças (20 primeiras)
    relatorios_count = 0
    for i in range(20):
        relatorio = Relatorio(
            texto=f"Relatório de acompanhamento da criança. {random.choice(['Situação estável.', 'Necessita acompanhamento.', 'Evolução positiva.', 'Família colaborativa.'])}",
            criado_em=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            crianca_id=criancas_ids[i]
        )
        session.add(relatorio)
        session.commit()
        relatorios_count += 1
    
    # Insere encaminhamentos para algumas crianças (30 primeiras)
    encaminhamentos_count = 0
    for i in range(30):
        # Cada criança recebe 1 ou 2 encaminhamentos
        num_encaminhamentos = random.randint(1, 2)
        for _ in range(num_encaminhamentos):
            destino = random.choice(tipos_encaminhamento)
            encaminhamento = Encaminhamento(
                destino=destino,
                descricao=f"Encaminhamento para {destino.split('(')[0].strip()}",
                crianca_id=criancas_ids[i]
            )
            session.add(encaminhamento)
            session.commit()
            encaminhamentos_count += 1
    
    print(f"\n{relatorios_count} relatórios criados")
    print(f"{encaminhamentos_count} encaminhamentos criados")
    
    print("\nBanco de dados populado")
    print(f"Total: {len(enderecos_ids)} endereços, {len(criancas_ids)} crianças, {len(responsaveis_data)} responsáveis, {relatorios_count} relatórios, {encaminhamentos_count} encaminhamentos")

except Exception as e:
    print(f"Erro ao popular banco: {e}")
    session.rollback()
finally:
    session.close()
