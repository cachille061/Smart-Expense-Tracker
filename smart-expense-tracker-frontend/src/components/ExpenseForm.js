import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/api';
import { validateExpense } from '../utils/formatters';

const ExpenseForm = ({ onExpenseAdded, onExpenseUpdated, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadCategories();
        if (initialData) {
            setFormData({
                ...initialData,
                date: new Date(initialData.date).toISOString().split('T')[0]
            });
        }
    }, [initialData]);

    const loadCategories = async () => {
        try {
            const data = await expenseService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { isValid, errors: validationErrors } = validateExpense(formData);
        if (!isValid) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const expenseData = {
                ...formData,
                amount: parseFloat(formData.amount)
            };

            if (initialData) {
                await expenseService.updateExpense(initialData.id, expenseData);
                onExpenseUpdated(expenseData);
            } else {
                const newExpense = await expenseService.createExpense(expenseData);
                onExpenseAdded(newExpense);
            }

            // Reset form if it's a new expense
            if (!initialData) {
                setFormData({
                    name: '',
                    amount: '',
                    category: '',
                    date: new Date().toISOString().split('T')[0]
                });
            }
        } catch (error) {
            console.error('Failed to save expense:', error);
            setErrors({ submit: 'Failed to save expense. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-group">
                <label htmlFor="name">Expense Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={errors.amount ? 'error' : ''}
                />
                {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={errors.category ? 'error' : ''}
                >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={errors.date ? 'error' : ''}
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            {errors.submit && <div className="error-message">{errors.submit}</div>}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}
            </button>
        </form>
    );
};

export default ExpenseForm; 