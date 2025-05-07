// Format currency values
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Format dates
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
};

// Calculate total expenses
export const calculateTotal = (expenses) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Group expenses by category
export const groupByCategory = (expenses) => {
    return expenses.reduce((groups, expense) => {
        const category = expense.category;
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(expense);
        return groups;
    }, {});
};

// Validate expense data
export const validateExpense = (expense) => {
    const errors = {};
    
    if (!expense.name?.trim()) {
        errors.name = 'Name is required';
    }
    
    if (!expense.amount || expense.amount <= 0) {
        errors.amount = 'Amount must be greater than 0';
    }
    
    if (!expense.category) {
        errors.category = 'Category is required';
    }
    
    if (!expense.date) {
        errors.date = 'Date is required';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}; 