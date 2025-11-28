import {
  criancasDB,
  responsaveisDB,
  denunciantesDB,
  enderecosDB
} from "./local-db.js";

export const MockAPI = {
  
  // GET ALL
  getAll(tipo) {
    return new Promise(resolve => {
      setTimeout(() => resolve(getDB(tipo)), 200);
    });
  },

  // GET BY ID
  getById(tipo, id) {
    return new Promise(resolve => {
      const tabela = getDB(tipo);
      resolve(tabela.find(x => x.id == id));
    });
  },

  // CREATE
  create(tipo, data) {
    return new Promise(resolve => {
      const tabela = getDB(tipo);
      tabela.push(data);
      resolve(data);
    });
  },

  // DELETE
  delete(tipo, id) {
    return new Promise(resolve => {
      let tabela = getDB(tipo);
      const idx = tabela.findIndex(x => x.id == id);
      if (idx >= 0) tabela.splice(idx, 1);
      resolve({ success: true });
    });
  }
};

// função privada
function getDB(tipo) {
  switch (tipo) {
    case "criancas": return criancasDB;
    case "responsaveis": return responsaveisDB;
    case "denunciantes": return denunciantesDB;
    case "enderecos": return enderecosDB;
  }
}
