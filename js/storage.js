// Chaves localStorage
const CHAVES_STORAGE = {
  CLIENTES: "agendamento_clientes",
  SERVICOS: "agendamento_servicos",
  AGENDAMENTOS: "agendamento_agendamentos"
};

// Lista de dados
function salvarDados(chave,dados) {
    try {
        const dadosEmTexto = JSON.stringify(dados);
        localStorage.setItem(chave, dadosEmTexto);
        return true;
    } catch (error) {
        console.error("Erro ao salvar dados no localStorage:", error);
        return false;
    }
}

function lerDados(chave) {
    try {
        const dadosEmTexto = localStorage.getItem(chave);

        if (!dadosEmTexto) {
            return [];
        }

        const dados = JSON.parse(dadosEmTexto);

        if (!Array.isArray(dados)) {
            console.warn("Dados inválidos encontrados para a chave:", chave);
            return [];
        }

        return dados;
    } catch (error) {
        console.error("Erro ao ler dados do localStorage:", error);
        return [];
    }
}

// ID para identificar clientes, serviços e agendamento
function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}