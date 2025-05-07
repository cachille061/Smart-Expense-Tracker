const API_BASE_URL = 'https://localhost:7001/api';

export const expenseService = {
    // Get all expenses with optional filtering and pagination
    async getExpenses(params = {}) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value);
            }
        });

        const response = await fetch(`${API_BASE_URL}/expenses?${queryParams}`);
        if (!response.ok) {
            throw new Error('Failed to fetch expenses');
        }
        return response.json();
    },

    // Get a single expense by ID
    async getExpenseById(id) {
        const response = await fetch(`${API_BASE_URL}/expenses/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch expense');
        }
        return response.json();
    },

    // Create a new expense
    async createExpense(expense) {
        const response = await fetch(`${API_BASE_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expense),
        });
        if (!response.ok) {
            throw new Error('Failed to create expense');
        }
        return response.json();
    },

    // Update an existing expense
    async updateExpense(id, expense) {
        const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expense),
        });
        if (!response.ok) {
            throw new Error('Failed to update expense');
        }
        return response.json();
    },

    // Delete an expense
    async deleteExpense(id) {
        const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete expense');
        }
    },

    // Get all expense categories
    async getCategories() {
        const response = await fetch(`${API_BASE_URL}/expenses/categories`);
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        return response.json();
    }
}; 