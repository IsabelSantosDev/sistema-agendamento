const botaoMesAnterior = document.getElementById("botao-mes-anterior");
const botaoMesSeguinte = document.getElementById("botao-mes-seguinte");
const elementoMesAno = document.getElementById("calendario-mes-ano");
const gradeCalendario = document.getElementById("grade-calendario");
const detalhesDiaCalendario = document.getElementById("detalhes-dia-calendario");
const botaoMenuCalendario = document.querySelector('[data-secao="calendario"]');

const NOMES_MESES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const NOMES_DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

let dataReferenciaCalendario = new Date();
dataReferenciaCalendario.setDate(1);

// Converte um objeto Date em string "AAAA-MM-DD"
function formatarDataISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return ano + "-" + mes + "-" + dia;
}

function renderizarCalendario() {
    const ano = dataReferenciaCalendario.getFullYear();
    const mes = dataReferenciaCalendario.getMonth();

    elementoMesAno.textContent = NOMES_MESES[mes] + " / " + ano;

    gradeCalendario.textContent = "";

    NOMES_DIAS_SEMANA.forEach(function (nomeDia){
        const celulaCabecalho = document.createElement("div");
        celulaCabecalho.classList.add("calendario__dia-semana");
        celulaCabecalho.textContent = nomeDia;
        gradeCalendario.appendChild(celulaCabecalho);
    });

    const primeiroDiaDoMes = new Date(ano, mes, 1);
    const quantidadeDiasDoMes = new Date(ano, mes + 1, 0).getDate();
    const diaDaSemanaInicial = primeiroDiaDoMes.getDay();

    for (let i = 0; i < diaDaSemanaInicial; i++) {      const celulaVazia = document.createElement("div");
        celulaVazia.classList.add("calendario__dia", "calendario__dia--vazio");
        gradeCalendario.appendChild(celulaVazia);   
    }

    const agendamentos = obterAgendamentos();

    for (let dia = 1; dia <= quantidadeDiasDoMes; dia++) {
        const dataDoDia = new Date(ano, mes, dia);
        const dataISO = formatarDataISO(dataDoDia);
        
        const agendamentosDoDia = agendamentos.filter(function (agendamento){
            return agendamento.data === dataISO && agendamento.status !== "cancelado";
        });

        const celulaDia = document.createElement("div");
        celulaDia.classList.add("calendario__dia");
        celulaDia.dataset.data = dataISO;

        if (agendamentosDoDia.length > 0) {
            celulaDia.classList.add("calendario__dia--tem-compromisso");
        }

        const numeroDia = document.createElement("span");
        numeroDia.classList.add("calendario__dia-numero");
        numeroDia.textContent = dia;
        celulaDia.appendChild(numeroDia);

        if (agendamentosDoDia.length > 0) {
            const indicador = document.createElement("span");
            indicador.classList.add("calendario__dia-indicador");
            indicador.textContent = agendamentosDoDia.length + (agendamentosDoDia.length === 1 ? " compromisso" : " compromissos");
            celulaDia.appendChild(indicador);
        }

        celulaDia.addEventListener("click", function (){
            exibirDetalhesDoDia(dataISO);
        });

        gradeCalendario.appendChild(celulaDia);
    }
}

function exibirDetalhesDoDia(dataISO) {
    const agendamentos = obterAgendamentos()
    .filter(function (agendamento){
        return agendamento.data === dataISO;
    })
    .sort(function (a, b){
        return horarioParaMinutos(a.horario) - horarioParaMinutos(b.horario);
    });

    const clientes = obterClientes();
    const servicos = obterServicos();

    detalhesDiaCalendario.textContent = "";

    const titulo = document.createElement("h3");
    titulo.textContent = "Compromissos em " + formatarDataBR(dataISO);
    detalhesDiaCalendario.appendChild(titulo);

    if (agendamentos.length === 0) {
        const mensagemVazio = document.createElement("p");
        mensagemVazio.textContent = "Nenhum agendamento para este dia.";
        detalhesDiaCalendario.appendChild(mensagemVazio);
    } else {
        const lista = document.createElement("ul");
        lista.classList.add("lista-proximos");

        agendamentos.forEach(function (agendamento){
            const cliente = clientes.find(function (c){ return c.id === agendamento.clienteId; });
            const servico = servicos.find(function (s){ return s.id === agendamento.servicoId; });

            const item = document.createElement("li");

            const textoItem = document.createElement("span");
            textoItem.textContent = agendamento.horario + " - " + (cliente ? cliente.nome : "Cliente removido") + " (" + 
            (servico ? servico.nome : "Serviço removido") + ")";

            const badge = document.createElement("span");
            badge.classList.add("badge-status", "badge-status--" + agendamento.status);
            badge.textContent = agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1);

            item.appendChild(textoItem);
            item.appendChild(badge);
            lista.appendChild(item);
        });

        detalhesDiaCalendario.appendChild(lista);
    }

    detalhesDiaCalendario.hidden = false;

    document.querySelectorAll(".calendario__dia.selecionado").forEach(function (celula){
        celula.classList.remove("selecionado");
    });
    const celulaSelecionada = document.querySelector('.calendario__dia[data-data="' + dataISO + '"]');
    if (celulaSelecionada) {
        celulaSelecionada.classList.add("selecionado");
    }
}

// Navegação entre meses
botaoMesAnterior.addEventListener("click", function (){
    dataReferenciaCalendario.setMonth(dataReferenciaCalendario.getMonth() - 1);
    detalhesDiaCalendario.hidden = true;
    renderizarCalendario();
});

botaoMesSeguinte.addEventListener("click", function (){
    dataReferenciaCalendario.setMonth(dataReferenciaCalendario.getMonth() + 1);
    detalhesDiaCalendario.hidden = true;
    renderizarCalendario();
});

botaoMenuCalendario.addEventListener("click", function (){
    detalhesDiaCalendario.hidden = true;
    renderizarCalendario();
})

// Ao carregar a página
renderizarCalendario();