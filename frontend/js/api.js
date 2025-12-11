import { MockAPI } from "./mock-api.js";

// Configurar aqui!
export const USE_MOCK = false;

// Caso queira usar backend real futuramente
const REAL_API = {
  criancas: "http://localhost:8000/criancas",
  responsaveis: "http://localhost:8000/responsaveis",
  denunciantes: "http://localhost:8000/denunciante",
  enderecos: "http://localhost:8000/enderecos",
  filiacao: "http://localhost:8000/filiacao",
  relatorios: "http://localhost:8000/relatorios",
  encaminhamentos: "http://localhost:8000/encaminhamentos"
};

export const API = {

  async getAll(tipo) {
    if (USE_MOCK) return MockAPI.getAll(tipo);
    return fetch(REAL_API[tipo]).then(r => r.json());
  },

  async getById(tipo, id) {
    if (USE_MOCK) return MockAPI.getById(tipo, id);
    return fetch(`${REAL_API[tipo]}/${id}`).then(r => r.json());
  },

  async create(tipo, data) {
    if (USE_MOCK) return MockAPI.create(tipo, data);

    return fetch(REAL_API[tipo], {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(data)
    }).then(r => r.json());
  },

  async delete(tipo, id) {
    if (USE_MOCK) return MockAPI.delete(tipo, id);
    return fetch(`${REAL_API[tipo]}/${id}`, {method:"DELETE"});
  },

  async getEstatisticasTotais() {
    return fetch("http://localhost:8000/estatisticas/totais").then(r => r.json());
  },

  async getEstatisticasDenuncias() {
    return fetch("http://localhost:8000/estatisticas/denuncias").then(r => r.json());
  },

  async getEstatisticasBairros() {
    return fetch("http://localhost:8000/estatisticas/bairros").then(r => r.json());
  },

  async getEstatisticasIdades() {
    return fetch("http://localhost:8000/estatisticas/idades").then(r => r.json());
  }
};
