const elementoIndicadorTotal = document.getElementById("indicador-total");
const elementoIndicadorHoje = document.getElementById("indicador-hoje");
const elementoIndicadorFuturos = document.getElementById("indicador-futuros");
const elementoIndicadorCancelados = document.getElementById("indicador-cancelados");
const listaProximosCompromissos = document.getElementById("lista-proximos-compromissos");
const botaoMenuDashboard = document.querySelector('[data-secao="dashboard"]');

// Calcula e exibe 4 indicadores
function atualizarIndicadoresDashboard() {
    const agendamentos = obterAgendamentos();
    const hojeISO = obterDataHojeISO();

    const totalAgendamentos = agendamentos.length;

    const agendamentosHoje = agendamentos.filter(function (agendamento){
        return agendamento.data === hojeISO && agendamento.status !== "cancelado";
    }).length;

    const agendamentosFuturos = agendamentos.filter(function (agendamento){
        return agendamento.data > hojeISO && agendamento.status !== "cancelado";
    }).length;

    const agendamentosCancelados = agendamentos.filter(function (agendamento){
        return agendamento.status === "cancelado";
    }).length;

    elementoIndicadorTotal.textContent = totalAgendamentos;
    elementoIndicadorHoje.textContent = agendamentosHoje;
    elementoIndicadorFuturos.textContent = agendamentosFuturos;
    elementoIndicadorCancelados.textContent = agendamentosCancelados;
}

// Lista de próximos compromissos
function atualizarProximosCompromissos() {
    const agendamentos = obterAgendamentos();
    const clientes = obterClientes();
    const servicos = obterServicos();
    const hojeISO = obterDataHojeISO();

    const proximos = agendamentos 
    .filter(function (agendamento){
        return agendamento.data >= hojeISO && agendamento.status === "agendado";
    })
    .sort(function (a, b){
        if (a.data !== b.data) {
            return a.data < b.data ? -1 : 1;
        }
        return horarioParaMinutos(a.horario) - horarioParaMinutos(b.horario);
    })
    .slice(0, 5);

    listaProximosCompromissos.textContent = "";

    if (proximos.length === 0) {
        const itemVazio = document.createElement("li");
        itemVazio.textContent = "Nenhum compromisso futuro agendado.";
        listaProximosCompromissos.appendChild(itemVazio);
        return;
    }

    proximos.forEach(function (agendamento) {
        const cliente = clientes.find(function (c) { return c.id === agendamento.clienteId; });
        const servico = servicos.find(function (s) { return s.id === agendamento.servicoId; });

        const item = document.createElement("li");
        item.textContent = formatarDataBR(agendamento.data) + " às " + agendamento.horario +
        " - " + (cliente ? cliente.nome : "Cliente removido") +
        " (" + (servico ? servico.nome : "Serviço removido") + ")";

        listaProximosCompromissos.appendChild(item);
    });
}

// Atualiza dashboard
function atualizarDashboard() {
    atualizarIndicadoresDashboard();
    atualizarProximosCompromissos();
}

botaoMenuDashboard.addEventListener("click", atualizarDashboard);

atualizarDashboard();