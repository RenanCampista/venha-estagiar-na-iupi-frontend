import { mockData } from '../data/transactions.js';

// ---
// ESTADO GLOBAL
// ---
let transactions = [];
let nextId = 1;
let currentTheme = 'light';

// ---
// SELETORES DO DOM (Constantes - Padrão UPPER_SNAKE_CASE)
// ---
const THEME_SWITCHER = document.getElementById('theme-switcher');
const TRANSACTION_LIST = document.getElementById('transaction-list');
const SEARCH_INPUT = document.getElementById('search');
const SORT_SELECT = document.getElementById('sort');
const BALANCE_ELEMENT = document.getElementById('balance');

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

/**
 * Formata um número como moeda brasileira.
 * @param {number} value - O valor a ser formatado.
 * @returns {string} O valor formatado como moeda.
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Calcula o saldo total (entradas - saídas).
 * @returns {number} O saldo total.
 */
function calculateBalance() {
    return transactions.reduce((total, transaction) => {
        if (transaction.type === 'income') {
            return total + transaction.amount;
        } else {
            return total - transaction.amount;
        }
    }, 0);
}


/**
 * Atualiza a exibição do saldo total.
 */
function updateBalance() {
    const balance = calculateBalance();
    BALANCE_ELEMENT.textContent = `Saldo Total: ${formatCurrency(balance)}`;
    BALANCE_ELEMENT.style.color = balance >= 0 ? 'var(--income-color)' : 'var(--expense-color)';
}


/**
 * Filtra as transações com base no texto de busca.
 * @param {string} searchText - O texto para filtrar.
 * @returns {Array} As transações filtradas.
 */
function filterTransactions(searchText) {
    if (!searchText) return transactions;
    
    return transactions.filter(transaction => 
        transaction.description.toLowerCase().includes(searchText.toLowerCase())
    );
}


/**
 * Ordena as transações com base no critério selecionado.
 * @param {Array} transactionsToSort - As transações a serem ordenadas.
 * @param {string} sortBy - O critério de ordenação.
 * @returns {Array} As transações ordenadas.
 */
function sortTransactions(transactionsToSort, sortBy) {
    const sorted = [...transactionsToSort];
    
    switch (sortBy) {
        case 'date-desc':
            return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'date-asc':
            return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        case 'amount-desc':
            return sorted.sort((a, b) => b.amount - a.amount);
        case 'amount-asc':
            return sorted.sort((a, b) => a.amount - b.amount);
        default:
            return sorted;
    }
}

/**
 * Renderiza a lista de transações.
 */
function renderTransactions() {
    const searchText = SEARCH_INPUT.value;
    const sortBy = SORT_SELECT.value;
    
    // Filtra e ordena as transações
    let filteredTransactions = filterTransactions(searchText);
    const sortedTransactions = sortTransactions(filteredTransactions, sortBy);
    
    // Limpa a lista
    TRANSACTION_LIST.innerHTML = '';
    
    // Renderiza cada transação
    sortedTransactions.forEach(transaction => {
        const li = document.createElement('li');
        li.className = `transaction-item ${transaction.type}`;
        
        li.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-date">${formatDate(transaction.date)}</div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'expense' ? '-' : ''}${formatCurrency(transaction.amount)}
            </div>
            <button class="delete-btn" data-id="${transaction.id}">X</button>
        `;
        
        TRANSACTION_LIST.appendChild(li);
    });
    
    updateBalance();
}

/**
 * Salva as transações e o tema no localStorage.
 */
function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('nextId', nextId.toString());
}

/**
 * Carrega as transações e o tema do localStorage.
 */
function loadFromLocalStorage() {
    const savedTransactions = localStorage.getItem('transactions');
    const savedNextId = localStorage.getItem('nextId');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
        nextId = savedNextId ? parseInt(savedNextId) : 1;
    } else {
        // Se não houver dados salvos, usa o mock
        transactions = mockData.map(transaction => ({
            ...transaction,
            id: nextId++
        }));
        saveToLocalStorage();
    }
    
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
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
    loadFromLocalStorage();
    renderTransactions();
}


// Inicia a aplicação
init();
