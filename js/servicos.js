const formularioServico = document.getElementById("formulario-servicos");
const campoServicoId = document.getElementById("servico-id");
const campoServicoNome = document.getElementById("servico-nome");
const campoServicoDescricao = document.getElementById("servico-descricao");
const campoServicoDuracao = document.getElementById("servico-duracao");
const campoServicoPreco = document.getElementById("servico-preco");
const corpoTabelaServicos = document.getElementById("corpo-tabela-servicos");
const botaoCancelarServico = document.getElementById("botao-cancelar-servico");
const botaoSalvarServico = document.getElementById("botao-salvar-servico");


function obterServicos() {
  return lerDados(CHAVES_STORAGE.SERVICOS);
}

function salvarListaServicos(listaServicos) {
  return salvarDados(CHAVES_STORAGE.SERVICOS, listaServicos);
}

// Verifica se existem agendamentos vinculados a um serviço específico
function obterAgendamentosDoServico(servicoId) {
  const agendamentos = lerDados(CHAVES_STORAGE.AGENDAMENTOS);
  return agendamentos.filter(function (agendamento) {
    return agendamento.servicoId === servicoId;
  });
}

// Formata um número como moeda brasileira (R$ 0,00)
function formatarPreco(valor) {
  return "R$ " + Number(valor).toFixed(2).replace(".", ",");
}

function validarFormularioServico() {
  let formularioValido = true;

  limparErroCampo("servico-nome", "erro-servico-nome");
  limparErroCampo("servico-duracao", "erro-servico-duracao");
  limparErroCampo("servico-preco", "erro-servico-preco");

  if (campoServicoNome.value.trim() === "") {
    exibirErroCampo(
      "servico-nome",
      "erro-servico-nome",
      "Informe o nome do serviço.",
    );
    formularioValido = false;
  }

  const duracao = Number(campoServicoDuracao.value);
  if (campoServicoDuracao.value.trim() === "" || duracao <= 0) {
    exibirErroCampo(
      "servico-duracao",
      "erro-servico-duracao",
      "Informe uma duração válida (maior que zero).",
    );
    formularioValido = false;
  }

  const preco = Number(campoServicoPreco.value);
  if (campoServicoPreco.value.trim() === "" || preco < 0) {
    exibirErroCampo(
      "servico-preco",
      "erro-servico-preco",
      "Informe um preço válido.",
    );
    formularioValido = false;
  }

  return formularioValido;
}

function limparFormularioServico() {
  formularioServico.reset();
  campoServicoId.value = "";
  botaoSalvarServico.textContent = "Salvar serviços";
}

function iniciarEdicaoServico(servicoId) {
  const servicos = obterServicos();
  const servico = servicos.find(function (s) {
    return s.id === servicoId;
  });

  if (!servico) {
    return;
  }

  campoServicoId.value = servico.id;
  campoServicoNome.value = servico.nome;
  campoServicoDescricao.value = servico.descricao || "";
  campoServicoDuracao.value = servico.duracao;
  campoServicoPreco.value = servico.preco;

  botaoSalvarServico.textContent = "Atualizar serviço";
  campoServicoNome.focus();
}

function excluirServico(servicoId) {
  const agendamentosVinculados = obterAgendamentosDoServico(servicoId);

  if (agendamentosVinculados.length > 0) {
    const confirmarComAgendamentos = confirm(
      "Este serviço possui " +
        agendamentosVinculados.length +
        " agendamento(s) vinculado(s). Ao excluir, esses agendamentos também serão removidos. Deseja continuar?",
    );

    if (!confirmarComAgendamentos) {
      return;
    }

    const agendamentosRestantes = lerDados(CHAVES_STORAGE.AGENDAMENTOS).filter(
      function (agendamento) {
        return agendamento.servicoId !== servicoId;
      },
    );
    salvarDados(CHAVES_STORAGE.AGENDAMENTOS, agendamentosRestantes);
  } else {
    const confirmarSimples = confirm("Deseja realmente excluir este serviço?");

    if (!confirmarSimples) {
      return;
    }
  }

  const servicosRestantes = obterServicos().filter(function (servico) {
    return servico.id !== servicoId;
  });

  salvarListaServicos(servicosRestantes);

  if (campoServicoId.value === servicoId) {
    limparFormularioServico();
  }

  renderizarTabelaServicos();
  exibirMensagemFeedback(
    "mensagem-servico",
    "Serviço excluído com sucesso.",
    "sucesso",
  );
}

function renderizarTabelaServicos() {
  const servicos = obterServicos();

  corpoTabelaServicos.textContent = "";

  servicos.forEach(function (servico) {
    const linha = document.createElement("tr");

    const celulaNome = document.createElement("td");
    celulaNome.textContent = servico.nome;

    const celulaDuracao = document.createElement("td");
    celulaDuracao.textContent = servico.duracao + " min";

    const celulaPreco = document.createElement("td");
    celulaPreco.textContent = formatarPreco(servico.preco);

    const celulaAcoes = document.createElement("td");
    celulaAcoes.classList.add("celula-acoes");

    const botaoEditar = document.createElement("button");
    botaoEditar.type = "button";
    botaoEditar.textContent = "Editar";
    botaoEditar.classList.add("botao", "botao--secundario", "botao--pequeno");
    botaoEditar.dataset.acao = "editar";
    botaoEditar.dataset.id = servico.id;

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.classList.add("botao", "botao--secundario", "botao--pequeno");
    botaoExcluir.dataset.acao = "excluir";
    botaoExcluir.dataset.id = servico.id;

    celulaAcoes.appendChild(botaoEditar);
    celulaAcoes.appendChild(botaoExcluir);

    linha.appendChild(celulaNome);
    linha.appendChild(celulaDuracao);
    linha.appendChild(celulaPreco);
    linha.appendChild(celulaAcoes);

    corpoTabelaServicos.appendChild(linha);
  });
}

formularioServico.addEventListener("submit", function (evento) {
  evento.preventDefault();

  if (!validarFormularioServico()) {
    return;
  }

  const servicos = obterServicos();
  const idEmEdicao = campoServicoId.value;

  if (idEmEdicao) {
    const indice = servicos.findIndex(function (s) {
      return s.id === idEmEdicao;
    });

    if (indice !== -1) {
      servicos[indice].nome = campoServicoNome.value.trim();
      servicos[indice].descricao = campoServicoDescricao.value.trim();
      servicos[indice].duracao = Number(campoServicoDuracao.value);
      servicos[indice].preco = Number(campoServicoPreco.value);
    }

    salvarListaServicos(servicos);
    exibirMensagemFeedback(
      "mensagem-servico",
      "Serviço atualizado com sucesso!",
      "sucesso",
    );
  } else {
    const novoServico = {
      id: gerarId(),
      nome: campoServicoNome.value.trim(),
      descricao: campoServicoDescricao.value.trim(),
      duracao: Number(campoServicoDuracao.value),
      preco: Number(campoServicoPreco.value),
    };

    servicos.push(novoServico);
    salvarListaServicos(servicos);
    exibirMensagemFeedback(
      "mensagem-servico",
      "Serviço cadastrado com sucesso!",
      "sucesso",
    );
  }

  renderizarTabelaServicos();
  limparFormularioServico();
});

botaoCancelarServico.addEventListener("click", function () {
  limparFormularioServico();
});

corpoTabelaServicos.addEventListener("click", function (evento) {
  const botaoClicado = evento.target.closest("button");

  if (!botaoClicado) {
    return;
  }

  const id = botaoClicado.dataset.id;
  const acao = botaoClicado.dataset.acao;

  if (acao === "editar") {
    iniciarEdicaoServico(id);
  } else if (acao === "excluir") {
    excluirServico(id);
  }
});

renderizarTabelaServicos();