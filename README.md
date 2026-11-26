# Sistema de agendamento

Sistema de agendamento de compromissos desenvolvido com **HTML, CSS e JavaScript puro**, sem frameworks ou bibliotecas externas. Os dados são armazenados no `localStorage` do navegador.

## 🎯 Funcionalidades

- **Dashboard** com indicadores em tempo real (total, hoje, futuros, cancelados) e lista dos próximos compromissos.
- **Clientes**: cadastro, edição, exclusão (com verificação de agendamentos vinculados) e pesquisa por nome.
- **Serviços**: cadastro, edição e exclusão, com validação de duração e preço.
- **Agendamentos**: cadastro e edição com verificação de conflito de horário (considerando o intervalo completo: início + duração), bloqueio de datas passadas, cancelamento (sem exclusão) e exclusão definitiva.
- **Listagem de agendamentos** com pesquisa por cliente e filtros combináveis por data, status e serviço, ordenada por data/horário.
- **Calendário mensal** com navegação entre meses, destaque visual nos dias com compromissos e painel de detalhes ao clicar em um dia.

## 🛠️ Tecnologias

- HTML5 semântico
- CSS3 (variáveis, Grid, Flexbox, responsividade)
- JavaScript puro (manipulação de DOM, eventos, localStorage)
- Fonte: [Poppins](https://fonts.google.com/specimen/Poppins) (Google Fonts)

## 📂 Estrutura do projeto

```
sistema-agendamento/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── storage.js       → Comunicação com o localStorage
    ├── utils.js         → Funções utilitárias (validações, feedback visual)
    ├── clientes.js      → CRUD de clientes
    ├── servicos.js      → CRUD de serviços
    ├── agendamentos.js  → CRUD de agendamentos, conflito de horário, filtros
    ├── calendario.js    → Visualização e navegação do calendário
    ├── dashboard.js     → Indicadores e próximos compromissos
    └── app.js           → Navegação entre seções (SPA)
```

## 📌 Regras de negócio implementadas

- Um cliente não pode ser excluído sem antes confirmar o que fazer com seus agendamentos vinculados (o mesmo vale para serviços).
- Não é possível agendar em datas passadas.
- A verificação de conflito de horário considera o intervalo completo do compromisso (horário de início + duração), não apenas o horário inicial.
- Agendamentos cancelados liberam o horário, mas o registro continua no histórico.

## 👩‍💻 Autora

Desenvolvido por mim(Isabel) como projeto de estudo em front-end, com foco em JavaScript puro e boas práticas de desenvolvimento.