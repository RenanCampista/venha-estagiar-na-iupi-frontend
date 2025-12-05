# Controle de Despesas - Desafio Frontend IUPI

Aplicação web para controle financeiro proposta para o [Desafio Frontend IUPI](desafio.md), desenvolvida com HTML, CSS e JavaScript puro.

## Funcionalidades Implementadas

### Requisitos Funcionais

**1. Renderização e Formatação**
- Carregamento de dados iniciais do arquivo `transactions.js`
- Formatação automática de valores em moeda brasileira (R$)
- Conversão de datas para o padrão brasileiro (DD/MM/YYYY)
- Indicação visual do tipo de transação (entrada/saída) com cores diferenciadas

**2. Formulário e Validação**
- Cadastro de novas transações via formulário
- Validação completa de campos obrigatórios
- Validação de valores (não permite zero ou negativos)
- Exibição de mensagens de erro específicas para cada campo
- Prevenção de recarregamento da página no submit

**3. Filtro e Ordenação**
- Ordenação por data (mais recentes/mais antigas)
- Ordenação por valor (maior/menor)

**4. Tema Light/Dark**
- Alternância entre tema claro e escuro
- Implementação com CSS Custom Properties

**5. Layout Responsivo**
- Desktop (> 768px): Layout em duas colunas (formulário | lista de transações)
- Mobile (< 768px): Layout em coluna única (formulário sobre lista)

### Requisitos Bônus Implementados

- **Saldo Total**: Cálculo e exibição do balanço financeiro (entradas - saídas)
- **Exclusão de Transações**: Botão para remover itens da lista com confirmação
- **Persistência de Dados**: Salvamento automático no `localStorage` para transações e tema

## Estrutura do Projeto

```
venha-estagiar-na-iupi-frontend/
├── index.html
├── src/
│   ├── data/
│   │   └── transactions.js
│   ├── scripts/
│   │   └── script.js
│   └── styles/
│       └── style.css
├── desafio.md
└── README.md
```