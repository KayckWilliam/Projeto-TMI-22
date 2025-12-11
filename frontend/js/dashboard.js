import { API } from './api.js';

let graficosDenuncias = null;
let graficosBairros = null;
let graficosIdades = null;
let graficosEncaminhamentos = null;

async function carregarDashboard() {
  try {
    // Busca estatísticas do backend
    const totais = await API.getEstatisticasTotais();
    const denuncias = await API.getEstatisticasDenuncias();
    const bairros = await API.getEstatisticasBairros();
    const idades = await API.getEstatisticasIdades();
    const encaminhamentos = await API.getEstatisticasEncaminhamentos();
    
    // Busca dados para relatórios
    const relatorios = await API.getAll('relatorios');
    const criancas = await API.getAll('criancas');

    // Atualiza cards de totais
    document.getElementById('totalCriancas').textContent = totais.total_criancas;
    document.getElementById('totalResponsaveis').textContent = totais.total_responsaveis;
    document.getElementById('totalRelatorios').textContent = totais.total_relatorios;

    // Gera gráfico de denúncias
    gerarGraficoDenuncias(denuncias);

    // Gera gráfico de bairros
    gerarGraficoBairros(bairros);

    // Gera gráfico de idades
    gerarGraficoIdades(idades);

    // Gera gráfico de encaminhamentos
    gerarGraficoEncaminhamentos(encaminhamentos);

    // Lista últimos relatórios
    listarUltimosRelatorios(relatorios, criancas);

  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    alert('Erro ao carregar dados do dashboard');
  }
}

function gerarGraficoDenuncias(denuncias) {
  // Dados já vêm processados do backend
  const labels = denuncias.map(item => item.tipo);
  const valores = denuncias.map(item => item.quantidade);

  // Cores para o gráfico
  const cores = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#6366F1'
  ];

  const ctx = document.getElementById('graficoDenuncias');
  
  if (graficosDenuncias) {
    graficosDenuncias.destroy();
  }

  graficosDenuncias = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Quantidade',
        data: valores,
        backgroundColor: cores.slice(0, labels.length),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
}

function gerarGraficoBairros(bairros) {
  // Dados já vêm processados do backend (top 10)
  const labels = bairros.map(item => item.bairro);
  const valores = bairros.map(item => item.quantidade);

  const ctx = document.getElementById('graficoBairros');
  
  if (graficosBairros) {
    graficosBairros.destroy();
  }

  graficosBairros = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: valores,
        backgroundColor: [
          '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
          '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#6366F1'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
}

function gerarGraficoIdades(idades) {
  // Dados já vêm processados do backend
  const labels = idades.map(item => item.faixa);
  const valores = idades.map(item => item.quantidade);

  const ctx = document.getElementById('graficoIdades');
  
  if (graficosIdades) {
    graficosIdades.destroy();
  }

  graficosIdades = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Quantidade',
        data: valores,
        backgroundColor: '#3B82F6',
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function listarUltimosRelatorios(relatorios, criancas) {
  const container = document.getElementById('listaRelatorios');

  if (relatorios.length === 0) {
    container.innerHTML = '<p class="text-gray-500">Nenhum relatório cadastrado.</p>';
    return;
  }

  // Ordena por data (mais recente primeiro) e pega os 5 últimos
  const ultimosRelatorios = relatorios
    .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))
    .slice(0, 5);

  container.innerHTML = ultimosRelatorios.map(rel => {
    const crianca = criancas.find(c => c.id === rel.crianca_id);
    const nomeCrianca = crianca ? crianca.nome : 'Criança não encontrada';
    
    return `
      <div class="bg-gray-50 p-4 rounded">
        <div class="flex justify-between items-start mb-2">
          <h4 class="font-semibold text-blue-700">${nomeCrianca}</h4>
          <span class="text-sm text-gray-500">${rel.criado_em}</span>
        </div>
        <p class="text-gray-700 text-sm">${rel.texto.substring(0, 150)}${rel.texto.length > 150 ? '...' : ''}</p>
      </div>
    `;
  }).join('');
}

function gerarGraficoEncaminhamentos(dados) {
  const ctx = document.getElementById('graficoEncaminhamentos').getContext('2d');
  
  // Se já existe gráfico, destrói antes de criar novo
  if (graficosEncaminhamentos) {
    graficosEncaminhamentos.destroy();
  }

  const cores = [
    '#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5',
    '#059669', '#047857', '#065F46', '#064E3B', '#022C22'
  ];

  graficosEncaminhamentos = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dados.map(d => d.destino),
      datasets: [{
        label: 'Quantidade',
        data: dados.map(d => d.quantidade),
        backgroundColor: cores,
        borderColor: cores.map(c => c.replace(')', ', 0.8)').replace('rgb', 'rgba')),
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Encaminhamentos mais realizados',
          font: {
            size: 16
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        },
        y: {
          ticks: {
            font: {
              size: 11
            }
          }
        }
      }
    }
  });
}

// Carrega o dashboard ao abrir a página
carregarDashboard();
