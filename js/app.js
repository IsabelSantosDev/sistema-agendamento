// Seleciona botões do menu principal
const botoesMenu = document.querySelectorAll(".menu-principal__item");


// Seleciona seções
const secoes = document.querySelectorAll(".secao");

// Esconde seções e mostra só a escolhida
function mostrarSecao(nomeSecao){
    secoes.forEach(function(secao){
        secao.classList.remove("ativo");
    });
    
    const secaoAlvo = document.getElementById("secao-" + nomeSecao);

    if (secaoAlvo) {
        secaoAlvo.classList.add("ativo");
    }
}

// Remove destaque dos botões e marca apenas o botão clicado
function marcarBotaoAtivo(botaoClicado){
    botoesMenu.forEach(function(botao){
        botao.classList.remove("ativo")
    });

    botaoClicado.classList.add("ativo");
}

// Evento de clique nos botões do menu
botoesMenu.forEach(function(botao){
    botao.addEventListener("click", function(){
        const nomeSecao = botao.dataset.secao;

        mostrarSecao(nomeSecao);
        marcarBotaoAtivo(botao);
    });
});