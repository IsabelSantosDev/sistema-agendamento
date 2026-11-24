// Validando formato de e-mail
function validarEmail(email) {
    const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return padraoEmail.test(email);
}

// Validando formato de telefone
function validarTelefone(telefone) {
    const apenasNumeros = telefone.replace(/\D/g, "");
    return apenasNumeros.length >= 10 && apenasNumeros.length <= 11;
}

function exibirErroCampo(idInput, idSpanErro, mensagem) {
    const input = document.getElementById(idInput);
    const spanErro = document.getElementById(idSpanErro);

    if (input) {
        input.classList.add("invalido");
    }

    if (spanErro) {
        spanErro.textContent = mensagem;
    }
}

function limparErroCampo(idInput, idSpanErro) {
    const input = document.getElementById(idInput);
    const spanErro = document.getElementById(idSpanErro);

    if (input) {
        input.classList.remove("invalido");
    }

    if (spanErro) {
        spanErro.textContent = "";
    }
}

// Mensagem de feedback
function exibirMensagemFeedback(idElemento, mensagem, tipo) {
    const elemento = document.getElementById(idElemento);

    if (!elemento) {
        return;
    }

    elemento.textContent = mensagem;
    elemento.className = "feedback-mensagem feedback-mensagem--" + tipo;

    setTimeout(function() {
        elemento.textContent = "";
        elemento.className = "feedback-mensagem";
    }, 4000);
}