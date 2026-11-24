const formularioCliente = document.getElementById("formulario-clientes");
const campoClienteId = document.getElementById("cliente-id");
const campoClienteNome = document.getElementById("cliente-nome");
const campoClienteTelefone = document.getElementById("cliente-telefone");
const campoClienteEmail = document.getElementById("cliente-email");
const campoClienteObservacoes = document.getElementById("cliente-observacoes");
const corpoTabelaClientes = document.getElementById("corpo-tabela-clientes");
const botaoCancelarCliente = document.getElementById("botao-cancelar-cliente");
const botaoSalvarCliente = document.getElementById("botao-salvar-cliente");
const campoPesquisaClientes = document.getElementById("pesquisa-clientes");

// Busca a lista de clientes salva no localStorage
function obterClientes() {
    return lerDados(CHAVES_STORAGE.CLIENTES);
}

// Salva a lista de clientes no localStorage
function salvarListaClientes(listaClientes) {
    return salvarDados(CHAVES_STORAGE.CLIENTES, listaClientes);
}

function obterAgendamentosDoCliente(clienteId) {
    const agendamentos = lerDados(CHAVES_STORAGE.AGENDAMENTOS);
    return agendamentos.filter(function (agendamento) {
        return agendamento.clienteId === clienteId;
    });
}

function validarFormularioCliente() {
    let formularioValido = true;

    limparErroCampo("cliente-nome", "erro-cliente-nome");
    limparErroCampo("cliente-telefone", "erro-cliente-telefone");
    limparErroCampo("cliente-email", "erro-cliente-email");

    if (campoClienteNome.value.trim() === "") {
        exibirErroCampo("cliente-nome", "erro-cliente-nome", "Informe o nome completo.");
        formularioValido = false;
    }

    if (campoClienteTelefone.value.trim() === "") {
        exibirErroCampo("cliente-telefone", "erro-cliente-telefone", "Informe o telefone.");
        formularioValido = false;
    } else if (!validarTelefone(campoClienteTelefone.value)) {
        exibirErroCampo("cliente-telefone", "erro-cliente-telefone", "Telefone inválido.");
        formularioValido = false;
    }

    if (campoClienteEmail.value.trim() === "") {
        exibirErroCampo("cliente-email", "erro-cliente-email", "Informe o e-mail.");
        formularioValido = false;
    } else if (!validarEmail(campoClienteEmail.value)) {
        exibirErroCampo("cliente-email", "erro-cliente-email", "E-mail inválido.");
        formularioValido = false;
    }

    return formularioValido;
}

// Limpa o formulário e tira o modo de edição
function limparFormularioCliente() {
    formularioCliente.reset();
    campoClienteId.value = "";
    botaoSalvarCliente.textContent = "Salvar cliente";
}

// Preenche o formulário com os dados de um cliente existente, entrando em modo de edição
function iniciarEdicaoCliente(clienteId) {
    const clientes = obterClientes();
    const cliente = clientes.find(function (c) {
        return c.id === clienteId;
    });

    if (!cliente) {
        return;
    }

    campoClienteId.value = cliente.id;
    campoClienteNome.value = cliente.nome;
    campoClienteTelefone.value = cliente.telefone;
    campoClienteEmail.value = cliente.email;
    campoClienteObservacoes.value = cliente.observacoes || "";

    botaoSalvarCliente.textContent = "Atualizar cliente";
    campoClienteNome.focus();
}

// Exclui um cliente, verificando antes se há agendamentos vinculados
function excluirCliente(clienteId) {
    const agendamentosVinculados = obterAgendamentosDoCliente(clienteId);

    if (agendamentosVinculados.length > 0) {
        const confirmarComAgendamentos = confirm(
            "Este cliente possui " + agendamentosVinculados.length +
            " agendamento(s) vinculado(s). Ao excluir, esses agendamentos também serão removidos. Deseja continuar?"
        );

        if (!confirmarComAgendamentos) {
            return;
        }

        const agendamentosRestantes = lerDados(CHAVES_STORAGE.AGENDAMENTOS).filter(function (agendamento) {
            return agendamento.clienteId !== clienteId;
        });
        salvarDados(CHAVES_STORAGE.AGENDAMENTOS, agendamentosRestantes);
    } else {
        const confirmarSimples = confirm("Deseja realmente excluir este cliente?");

        if (!confirmarSimples) {
            return;
        }
    }

    const clientesRestantes = obterClientes().filter(function (cliente) {
        return cliente.id !== clienteId;
    });

    salvarListaClientes(clientesRestantes);

    if (campoClienteId.value === clienteId) {
        limparFormularioCliente();
    }

    renderizarTabelaClientes(campoPesquisaClientes.value);
    exibirMensagemFeedback("mensagem-cliente", "Cliente excluído com sucesso.", "sucesso");
}

// Tabela de clientes a partir dos dados do localStorage.
function renderizarTabelaClientes(termoPesquisa) {
    const clientes = obterClientes();
    const filtro = (termoPesquisa || "").trim().toLowerCase();

    const clientesFiltrados = filtro === ""
        ? clientes
        : clientes.filter(function (cliente) {
              return cliente.nome.toLowerCase().includes(filtro);
          });

    corpoTabelaClientes.textContent = "";

    clientesFiltrados.forEach(function (cliente) {
        const linha = document.createElement("tr");

        const celulaNome = document.createElement("td");
        celulaNome.textContent = cliente.nome;

        const celulaTelefone = document.createElement("td");
        celulaTelefone.textContent = cliente.telefone;

        const celulaEmail = document.createElement("td");
        celulaEmail.textContent = cliente.email;

        const celulaAcoes = document.createElement("td");
        celulaAcoes.classList.add("celula-acoes");

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Editar";
        botaoEditar.classList.add("botao", "botao--secundario", "botao--pequeno");
        botaoEditar.dataset.acao = "editar";
        botaoEditar.dataset.id = cliente.id;

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.classList.add("botao", "botao--secundario", "botao--pequeno");
        botaoExcluir.dataset.acao = "excluir";
        botaoExcluir.dataset.id = cliente.id;

        celulaAcoes.appendChild(botaoEditar);
        celulaAcoes.appendChild(botaoExcluir);

        linha.appendChild(celulaNome);
        linha.appendChild(celulaTelefone);
        linha.appendChild(celulaEmail);
        linha.appendChild(celulaAcoes);

        corpoTabelaClientes.appendChild(linha);
    });
}

// Evento de envio do formulário
formularioCliente.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!validarFormularioCliente()) {
        return;
    }

    const clientes = obterClientes();
    const idEmEdicao = campoClienteId.value;

    if (idEmEdicao) {
        // Modo edição: atualiza o cliente existente
        const indice = clientes.findIndex(function (c) {
            return c.id === idEmEdicao;
        });

        if (indice !== -1) {
            clientes[indice].nome = campoClienteNome.value.trim();
            clientes[indice].telefone = campoClienteTelefone.value.trim();
            clientes[indice].email = campoClienteEmail.value.trim();
            clientes[indice].observacoes = campoClienteObservacoes.value.trim();
        }

        salvarListaClientes(clientes);
        exibirMensagemFeedback("mensagem-cliente", "Cliente atualizado com sucesso!", "sucesso");
    } else {
        // Modo criação: adiciona um novo cliente
        const novoCliente = {
            id: gerarId(),
            nome: campoClienteNome.value.trim(),
            telefone: campoClienteTelefone.value.trim(),
            email: campoClienteEmail.value.trim(),
            observacoes: campoClienteObservacoes.value.trim()
        };

        clientes.push(novoCliente);
        salvarListaClientes(clientes);
        exibirMensagemFeedback("mensagem-cliente", "Cliente cadastrado com sucesso!", "sucesso");
    }

    renderizarTabelaClientes(campoPesquisaClientes.value);
    limparFormularioCliente();
});

// Evento do botão "Cancelar"
botaoCancelarCliente.addEventListener("click", function () {
    limparFormularioCliente();
});

corpoTabelaClientes.addEventListener("click", function (evento) {
    const botaoClicado = evento.target.closest("button");

    if (!botaoClicado) {
        return;
    }

    const id = botaoClicado.dataset.id;
    const acao = botaoClicado.dataset.acao;

    if (acao === "editar") {
        iniciarEdicaoCliente(id);
    } else if (acao === "excluir") {
        excluirCliente(id);
    }
});

// Evento de pesquisa: filtra a tabela a cada letra digitada
campoPesquisaClientes.addEventListener("input", function () {
    renderizarTabelaClientes(campoPesquisaClientes.value);
});

// Ao carregar a página, já exibe os clientes salvos
renderizarTabelaClientes();