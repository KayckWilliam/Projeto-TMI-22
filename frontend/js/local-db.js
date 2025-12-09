
export let criancasDB = [
  {
    id: 111111,
    nome: "Maria da Silva",
    data_nascimento: "2015-07-12",
    criado_em: new Date().toISOString()
  }
];

export let responsaveisDB = [
  {
    id: 222222,
    nome: "Ana Souza",
    data_nascimento: "1990-03-12",
    cpf: "123.456.789-00",
    rg: "11222333",
    telefone: "92999990000",
    email: "ana@email.com",
    cep: "69000000",
    rua: "Rua das Flores",
    numero: "45",
    bairro: "Centro",
    cidade: "Manaus",
    estado: "AM",
    crianca_id: 111111,
    criado_em: new Date().toISOString()
  }
];

export let denunciantesDB = [
  {
    id: 333333,
    nome: "Carlos Lima",
    data_nascimento: "1985-10-15",
    cpf: "987.654.321-00",
    rg: "99887766",
    parentesco: "Vizinho",
    telefone: "92988887777",
    email: "carlos@email.com",
    cep: "69011111",
    rua: "Rua B",
    numero: "12",
    bairro: "São José",
    cidade: "Manaus",
    estado: "AM",
    crianca_id: 111111,
    criado_em: new Date().toISOString()
  }
];

export let enderecosDB = [
  {
    id: 1,
    cep: "69011111",
    rua: "Rua B",
    numero: "12",
    bairro: "São José",
    cidade: "Manaus",
    estado: "AM"
  }
];
