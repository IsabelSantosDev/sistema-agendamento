const formularioAgendamento = document.getElementById("formulario-agendamento");
const campoAgendamentoId = document.getElementById("agendamento-id");
const campoAgendamentoCliente = document.getElementById("agendamento-cliente");
const campoAgendamentoServico = document.getElementById("agendamento-servico");
const campoAgendamentoData = document.getElementById("agendamento-data");
const campoAgendamentoHorario = document.getElementById("agendamento-horario");
const campoAgendamentoStatus = document.getElementById("agendamento-status");
const campoAgendamentoObservacoes = document.getElementById("agendamento-observacoes");
const corpoTabelaAgendamentos = document.getElementById("corpo-tabela-agendamentos");
const botaoCancelarFormularioAgendamento = document.getElementById("botao-cancelar-agendamento");
const botaoSalvarAgendamento = document.getElementById("botao-salvar-agendamento");
const campoPesquisaAgendamentos = document.getElementById("pesquisa-agendamentos");
const campoFiltroDataAgendamentos = document.getElementById("filtro-data-agendamentos");
const campoFiltroStatusAgendamentos = document.getElementById("filtro-status-agendamentos");
const campoFiltroServicoAgendamentos = document.getElementById("filtro-servico-agendamentos");
const botaoMenuAgendamentos = document.querySelector('[data-secao="agendamentos"]');

// Busca lista de agendamentos no localStorage
function obterAgendamentos() {
    return lerDados(CHAVES_STORAGE.AGENDAMENTOS);
}

// Salva lista de agendamentos no localStorage
function salvarListaAgendamentos(listaAgendamentos) {
    return salvarDados(CHAVES_STORAGE.AGENDAMENTOS, listaAgendamentos);
}

function obterDataHojeISO() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return ano + "-" + mes + "-" + dia;
}

function horarioParaMinutos(horario) {
    const partes = horario.split(":");
    return Number(partes[0]) * 60 + Number(partes[1]);
}

function formatarDataBR(dataISO) {
    const partes = dataISO.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// Verifica se já existe algum agendamento
function haConflitoDeHorario(data, horario, duracao, idIgnorar) {
    const inicioNovo = horarioParaMinutos(horario);
    const fimNovo = inicioNovo + duracao;

    return obterAgendamentos().some(function (agendamento){
        if (agendamento.id === idIgnorar) {
            return false;
        }

        if (agendamento.data !== data) {
            return false
        }

        if (agendamento.status === "cancelado") {
            return false;
        }

        const inicioExistente = horarioParaMinutos(agendamento.horario);
        const fimExistente = inicioExistente + agendamento.duracao;

        return inicioNovo < fimExistente && inicioExistente < fimNovo;
    });
}

function popularSelectClientes() {
    while (campoAgendamentoCliente.options.length > 1) {
        campoAgendamentoCliente.remove(1);
    }

    obterClientes().forEach(function (cliente){
        const opcao = document.createElement("option");
        opcao.value = cliente.id;
        opcao.textContent = cliente.nome;
        campoAgendamentoCliente.appendChild(opcao);
    });
}

function popularSelectServicos() {
    while (campoAgendamentoServico.options.length > 1) {
        campoAgendamentoServico.remove(1);
    }

    obterServicos().forEach(function (servico){
        const opcao = document.createElement("option");
        opcao.value = servico.id;
        opcao.textContent = servico.nome + " (" + servico.duracao + " min)";
        campoAgendamentoServico.appendChild(opcao);
    });
}

function validarFormularioAgendamento() {
    let formularioValido = true;

    limparErroCampo("agendamento-cliente", "erro-agendamento-cliente");
    limparErroCampo("agendamento-servico", "erro-agendamento-servico");
    limparErroCampo("agendamento-data", "erro-agendamento-data");
    limparErroCampo("agendamento-horario", "erro-agendamento-horario");

    if (campoAgendamentoCliente.value === "") {
        exibirErroCampo("agendamento-cliente", "erro-agendamento-cliente", "Selecione um cliente.");
        formularioValido = false;
    }

    if (campoAgendamentoServico.value === "") {
        exibirErroCampo("agendamento-servico", "erro-agendamento-servico", "Selecione um serviço.");
        formularioValido = false;
    }

    if (campoAgendamentoData.value === "") {
        exibirErroCampo("agendamento-data", "erro-agendamento-data", "Informe a data.");
        formularioValido = false;
    } else if (campoAgendamentoData.value < obterDataHojeISO()) {
        exibirErroCampo("agendamento-data", "erro-agendamento-data", "Não é possível agendar em data passada.");
        formularioValido = false;
    }

    if (campoAgendamentoHorario.value === "") {
        exibirErroCampo("agendamento-horario", "erro-agendamento-horario", "Informe o horário.");
        formularioValido = false;
    }

    if (formularioValido) {
        const servico = obterServicos().find(function (s) {
            return s.id === campoAgendamentoServico.value;
        });

        const idEmEdicao = campoAgendamentoId.value || null;

        if (servico && haConflitoDeHorario(campoAgendamentoData.value, campoAgendamentoHorario.value, servico.duracao, idEmEdicao)) {
            exibirErroCampo("agendamento-horario", "erro-agendamento-horario", "Já existe um agendamento nesse horário.");
            formularioValido = false;
        }
    }

    return formularioValido;
}

function limparFormularioAgendamento() {
    formularioAgendamento.reset();
    campoAgendamentoId.value = "";
    campoAgendamentoStatus.value = "agendado";
    botaoSalvarAgendamento.textContent = "Salvar agendamento";
}

function iniciarEdicaoAgendamento(agendamentoId) {
    const agendamento = obterAgendamentos().find(function (a) {
        return a.id === agendamentoId;
    });

    if (!agendamento) {
        return;
    }

    campoAgendamentoId.value = agendamento.id;
    campoAgendamentoCliente.value = agendamento.clienteId;
    campoAgendamentoServico.value = agendamento.servicoId;
    campoAgendamentoData.value = agendamento.data;
    campoAgendamentoHorario.value = agendamento.horario;
    campoAgendamentoStatus.value = agendamento.status;
    campoAgendamentoObservacoes.value = agendamento.observacoes || "";

    botaoSalvarAgendamento.textContent = "Atualizar agendamento";
    campoAgendamentoCliente.focus();
}

function cancelarAgendamento(agendamentoId) {
    const confirmar = confirm("Deseja realmente cancelar este agendamento?");

    if (!confirmar) {
        return;
    }

    const agendamentos = obterAgendamentos();
    const indice = agendamentos.findIndex(function (a) {
        return a.id === agendamentoId;
    });

    if (indice !== -1) {
        agendamentos[indice].status = "cancelado";
        salvarListaAgendamentos(agendamentos);
    }

    renderizarTabelaAgendamentos();
    exibirMensagemFeedback("mensagem-agendamento", "Agendamento cancelado.", "sucesso");
}

// Remove registro por completo
function excluirAgendamento(agendamentoId) {
    const confirmar = confirm("Deseja realmente excluir este agendamento? Essa ação não pode ser desfeita.");

    if (!confirmar) {
        return;
    }

    const agendamentosRestantes = obterAgendamentos().filter(function (agendamento) {
        return agendamento.id !== agendamentoId;
    });

    salvarListaAgendamentos(agendamentosRestantes);

    if (campoAgendamentoId.value === agendamentoId) {
        limparFormularioAgendamento();
    }

    renderizarTabelaAgendamentos();
    exibirMensagemFeedback("mensagem-agendamento", "Agendamento excluído.", "sucesso");
}

function renderizarTabelaAgendamentos() {
    const todosAgendamentos = obterAgendamentos();
    const clientes = obterClientes();
    const servicos = obterServicos();

    const agendamentos = filtrarEOrdenarAgendamentos(todosAgendamentos, clientes);

    corpoTabelaAgendamentos.textContent = "";

    agendamentos.forEach(function (agendamento) {
        const cliente = clientes.find(function (c) { return c.id === agendamento.clienteId; });
        const servico = servicos.find(function (s) { return s.id === agendamento.servicoId; });

        const linha = document.createElement("tr");

        const celulaCliente = document.createElement("td");
        celulaCliente.textContent = cliente ? cliente.nome : "Cliente removido";

        const celulaServico = document.createElement("td");
        celulaServico.textContent = servico ? servico.nome : "Serviço removido";

        const celulaData = document.createElement("td");
        celulaData.textContent = formatarDataBR(agendamento.data);

        const celulaHorario = document.createElement("td");
        celulaHorario.textContent = agendamento.horario;

        const celulaDuracao = document.createElement("td");
        celulaDuracao.textContent = agendamento.duracao + " min";

        const celulaValor = document.createElement("td");
        celulaValor.textContent = servico ? formatarPreco(servico.preco) : "—";

        const celulaStatus = document.createElement("td");
        const badge = document.createElement("span");
        badge.classList.add("badge-status", "badge-status--" + agendamento.status);
        badge.textContent = agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1);
        celulaStatus.appendChild(badge);

        const celulaAcoes = document.createElement("td");
        celulaAcoes.classList.add("celula-acoes");

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Editar";
        botaoEditar.classList.add("botao", "botao--secundario", "botao--pequeno");
        botaoEditar.dataset.acao = "editar";
        botaoEditar.dataset.id = agendamento.id;
        celulaAcoes.appendChild(botaoEditar);

        if (agendamento.status === "agendado") {
            const botaoCancelar = document.createElement("button");
            botaoCancelar.type = "button";
            botaoCancelar.textContent = "Cancelar";
            botaoCancelar.classList.add("botao", "botao--secundario", "botao--pequeno");
            botaoCancelar.dataset.acao = "cancelar";
            botaoCancelar.dataset.id = agendamento.id;
            celulaAcoes.appendChild(botaoCancelar);
        }

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.classList.add("botao", "botao--secundario", "botao--pequeno");
        botaoExcluir.dataset.acao = "excluir";
        botaoExcluir.dataset.id = agendamento.id;
        celulaAcoes.appendChild(botaoExcluir);

        linha.appendChild(celulaCliente);
        linha.appendChild(celulaServico);
        linha.appendChild(celulaData);
        linha.appendChild(celulaHorario);
        linha.appendChild(celulaDuracao);
        linha.appendChild(celulaValor);
        linha.appendChild(celulaStatus);
        linha.appendChild(celulaAcoes);

        corpoTabelaAgendamentos.appendChild(linha);
    });
}

formularioAgendamento.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!validarFormularioAgendamento()) {
        return;
    }

    const servico = obterServicos().find(function (s) {
        return s.id === campoAgendamentoServico.value;
    });

    const agendamentos = obterAgendamentos();
    const idEmEdicao = campoAgendamentoId.value;

    if (idEmEdicao) {
        const indice = agendamentos.findIndex(function (a) {
            return a.id === idEmEdicao;
        });

        if (indice !== -1) {
            agendamentos[indice].clienteId = campoAgendamentoCliente.value;
            agendamentos[indice].servicoId = campoAgendamentoServico.value;
            agendamentos[indice].data = campoAgendamentoData.value;
            agendamentos[indice].horario = campoAgendamentoHorario.value;
            agendamentos[indice].duracao = servico.duracao;
            agendamentos[indice].status = campoAgendamentoStatus.value;
            agendamentos[indice].observacoes = campoAgendamentoObservacoes.value.trim();
        }

        salvarListaAgendamentos(agendamentos);
        exibirMensagemFeedback("mensagem-agendamento", "Agendamento atualizado com sucesso!", "sucesso");
    } else {
        const novoAgendamento = {
            id: gerarId(),
            clienteId: campoAgendamentoCliente.value,
            servicoId: campoAgendamentoServico.value,
            data: campoAgendamentoData.value,
            horario: campoAgendamentoHorario.value,
            duracao: servico.duracao,
            status: campoAgendamentoStatus.value,
            observacoes: campoAgendamentoObservacoes.value.trim()
        };

        agendamentos.push(novoAgendamento);
        salvarListaAgendamentos(agendamentos);
        exibirMensagemFeedback("mensagem-agendamento", "Agendamento cadastrado com sucesso!", "sucesso");
    }

    renderizarTabelaAgendamentos();
    limparFormularioAgendamento();
});

botaoCancelarFormularioAgendamento.addEventListener("click", function () {
    limparFormularioAgendamento();
});

corpoTabelaAgendamentos.addEventListener("click", function (evento) {
    const botaoClicado = evento.target.closest("button");

    if (!botaoClicado) {
        return;
    }

    const id = botaoClicado.dataset.id;
    const acao = botaoClicado.dataset.acao;

    if (acao === "editar") {
        iniciarEdicaoAgendamento(id);
    } else if (acao === "cancelar") {
        cancelarAgendamento(id);
    } else if (acao === "excluir") {
        excluirAgendamento(id);
    }
});

botaoMenuAgendamentos.addEventListener("click", function () {
    popularSelectClientes();
    popularSelectServicos();
});

// Impede selecionar uma data anterior a hoje no input nativo
campoAgendamentoData.min = obterDataHojeISO();

function popularFiltroServicoAgendamentos() {
    while (campoFiltroServicoAgendamentos.options.length > 1) {
        campoFiltroServicoAgendamentos.remove(1);
    }

    obterServicos().forEach(function (servico) {
        const opcao = document.createElement("option");
        opcao.value = servico.id;
        opcao.textContent = servico.nome;
        campoFiltroServicoAgendamentos.appendChild(opcao);
    });
}

// Aplica pesquisa por nome do cliente, filtros de data/status/serviço, e ordena o resultado por data e horário (mais próximos primeiro).
function filtrarEOrdenarAgendamentos(agendamentos, clientes) {
    const termoPesquisa = campoPesquisaAgendamentos.value.trim().toLowerCase();
    const filtroData = campoFiltroDataAgendamentos.value;
    const filtroStatus = campoFiltroStatusAgendamentos.value;
    const filtroServico = campoFiltroServicoAgendamentos.value;

    const filtrados = agendamentos.filter(function (agendamento) {
        if (filtroData !== "" && agendamento.data !== filtroData) {
            return false;
        }

        if (filtroStatus !== "" && agendamento.status !== filtroStatus) {
            return false;
        }

        if (filtroServico !== "" && agendamento.servicoId !== filtroServico) {
            return false;
        }

        if (termoPesquisa !== "") {
            const cliente = clientes.find(function (c) {
                return c.id === agendamento.clienteId;
            });
            const nomeCliente = cliente ? cliente.nome.toLowerCase() : "";

            if (!nomeCliente.includes(termoPesquisa)) {
                return false;
            }
        }

        return true;
    });

    // Ordena por data e, dentro do mesmo dia, por horário
    filtrados.sort(function (a, b) {
        if (a.data !== b.data) {
            return a.data < b.data ? -1 : 1;
        }
        return horarioParaMinutos(a.horario) - horarioParaMinutos(b.horario);
    });

    return filtrados;
}

// Qualquer mudança nos filtros/pesquisa redesenha a tabela
campoPesquisaAgendamentos.addEventListener("input", renderizarTabelaAgendamentos);
campoFiltroDataAgendamentos.addEventListener("input", renderizarTabelaAgendamentos);
campoFiltroStatusAgendamentos.addEventListener("change", renderizarTabelaAgendamentos);
campoFiltroServicoAgendamentos.addEventListener("change", renderizarTabelaAgendamentos);

// Ao carregar a página
popularSelectClientes();
popularSelectServicos();
popularFiltroServicoAgendamentos();
renderizarTabelaAgendamentos();