import { mockData } from '../data/transactions.js';

// ---
// ESTADO GLOBAL
// ---
let transactions = [];
let nextId = 1;

// ---
// SELETORES DO DOM (Constantes - Padrão UPPER_SNAKE_CASE)
// ---
const THEME_SWITCHER = document.getElementById('theme-switcher');
const TRANSACTION_FORM = document.getElementById('transaction-form');
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
        transaction.description.toLowerCase().includes(searchText.toLowerCase()) // case insensitive
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
 * Limpa todas as mensagens de erro do formulário.
 */
function clearErrors() {
    DESCRIPTION_ERROR.textContent = '';
    AMOUNT_ERROR.textContent = '';
    TYPE_ERROR.textContent = '';
    DATE_ERROR.textContent = '';
}

/**
 * Valida o formulário de transação.
 * @returns {boolean} True se o formulário é válido, false caso contrário.
 */
function validateForm() {
    clearErrors();
    let isValid = true;
    
    // Validação da descrição
    if (!DESCRIPTION_INPUT.value.trim()) {
        DESCRIPTION_ERROR.textContent = 'A descrição é obrigatória';
        isValid = false;
    }
    
    // Validação do valor
    const amount = parseFloat(AMOUNT_INPUT.value);
    if (!AMOUNT_INPUT.value || isNaN(amount) || amount <= 0) {
        AMOUNT_ERROR.textContent = 'O valor deve ser maior que zero';
        isValid = false;
    }
    
    // Validação do tipo
    if (!TYPE_SELECT.value) {
        TYPE_ERROR.textContent = 'Selecione o tipo de transação';
        isValid = false;
    }
    
    // Validação da data
    if (!DATE_INPUT.value) {
        DATE_ERROR.textContent = 'A data é obrigatória';
        isValid = false;
    }
    
    return isValid;
}

/**
 * Adiciona uma nova transação.
 * @param {Object} transactionData - Os dados da transação.
 */
function addTransaction(transactionData) {
    const newTransaction = {
        id: nextId++,
        description: transactionData.description,
        amount: parseFloat(transactionData.amount),
        date: transactionData.date,
        type: transactionData.type
    };
    
    transactions.push(newTransaction);
    saveToLocalStorage();
    renderTransactions(); // Renderiza novamente após adicionar
}

/**
 * Remove uma transação pelo ID.
 * @param {number} id - O ID da transação a ser removida.
 */
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id); // Remove através do filtro
    saveToLocalStorage();
    renderTransactions();
}


/**
 * Salva as transações e o tema no localStorage.
 */
function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions)); // stringify para salvar como string (ls só aceita strings)
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

/**
 * Alterna o tema entre light e dark.
 */
function toggleTheme() {
    const currentTheme  = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ---
// MANIPULADORES DE EVENTOS
// ---

/**
 * Lida com o clique no botão de trocar o tema (Light/Dark).
 */
THEME_SWITCHER.addEventListener('click', toggleTheme);

/**
 * Lida com o envio do formulário de transação.
 */
TRANSACTION_FORM.addEventListener('submit', (event) => {
    event.preventDefault();
    
    if (validateForm()) {
        const formData = {
            description: DESCRIPTION_INPUT.value.trim(),
            amount: AMOUNT_INPUT.value,
            type: TYPE_SELECT.value,
            date: DATE_INPUT.value
        };
        
        addTransaction(formData);
        TRANSACTION_FORM.reset();
        clearErrors();
    }
});

/**
 * Lida com cliques nos botões de excluir.
 */
TRANSACTION_LIST.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        if (!confirm("Tem certeza que deseja excluir esta transação?")) return;

        const id = parseInt(event.target.getAttribute('data-id'));
        deleteTransaction(id);
    }
});

/**
 * Lida com a digitação no campo de busca.
 */
SEARCH_INPUT.addEventListener('input', renderTransactions);

/**
 * Lida com a mudança no select de ordenação.
 */
SORT_SELECT.addEventListener('change', renderTransactions);

/**
 * Função de inicialização da aplicação. A "main"
 */
function init() {
    loadFromLocalStorage();
    renderTransactions();
}

// Inicia a aplicação
init();
