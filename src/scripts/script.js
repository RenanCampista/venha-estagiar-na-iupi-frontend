import { mockData } from '../data/transactions.js';

// ---
// ESTADO GLOBAL
// ---
let transactions = [...mockData];
let currentTheme = 'light';

// ---
// SELETORES DO DOM (Constantes - Padrão UPPER_SNAKE_CASE)
// ---
const THEME_SWITCHER = document.getElementById('theme-switcher');

const DESCRIPTION_INPUT = document.getElementById('description');
const AMOUNT_INPUT = document.getElementById('amount');
const TYPE_SELECT = document.getElementById('type');
const DATE_INPUT = document.getElementById('date');

const DESCRIPTION_ERROR = document.getElementById('description-error');
const AMOUNT_ERROR = document.getElementById('amount-error');
const TYPE_ERROR = document.getElementById('type-error');
const DATE_ERROR = document.getElementById('date-error');
// ---
// FUNÇÕES AUXILIARES 
// ---

/**
 * Formata uma string de data (YYYY-MM-DD) para o padrão brasileiro (DD/MM/YYYY).
 * @param {string} dateString - A data no formato ISO.
 * @returns {string} A data formatada.
 */
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}


// ---
// MANIPULADORES DE EVENTOS
// ---

/**
 * Lida com o clique no botão de trocar o tema (Light/Dark).
 */
THEME_SWITCHER.addEventListener('click', () => {
});

/**
 * Função de inicialização da aplicação. A "main"
 */
function init() {
}

// Inicia a aplicação
init();
