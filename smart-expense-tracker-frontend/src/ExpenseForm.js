import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

const API_URL = "http://localhost:5251/api/expenses";

const expandCircle = keyframes`
  0% {
    clip-path: circle(0% at var(--x) var(--y));
  }
  100% {
    clip-path: circle(150% at var(--x) var(--y));
  }
`;

const slideOut = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const FormContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${expandCircle} 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
  z-index: 1000;
  &.exiting {
    animation: ${slideOut} 0.5s cubic-bezier(0.77, 0, 0.175, 1) forwards;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  z-index: 1001;

  &:hover {
    transform: scale(1.1);
  }

  &::before {
    content: '';
    width: 20px;
    height: 20px;
    border-top: 3px solid #000;
    border-left: 3px solid #000;
    transform: rotate(-45deg);
  }
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(31, 38, 135, 0.15);
  width: 90%;
  max-width: 500px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #e0e7ef;
  border-radius: 0.5rem;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #4f8cff;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%);
  color: #2d1e6b;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.2s ease;
  width: 100%;
  display: block;
  text-align: center;
  &:hover {
    transform: scale(1.05);
  }
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  color: #2d1e6b;
  margin-bottom: 0.5rem;
  text-align: center;
  font-size: 1.5rem;
  display: inline-block;
`;

const ExpenseList = styled.div`
  margin-top: 2rem;
  width: 100%;
  max-width: 500px;
`;

const ExpenseItem = styled.div`
  background: white;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(31, 38, 135, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(5px);
  }
`;

const ExpenseInfo = styled.div`
  flex: 1;
`;

const ExpenseName = styled.h3`
  margin: 0;
  color: #2d1e6b;
  font-size: 1.1rem;
`;

const ExpenseDetails = styled.p`
  margin: 0.3rem 0 0;
  color: #666;
  font-size: 0.9rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff4d4d;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const EmptyState = styled.p`
  text-align: center;
  color: #666;
  font-size: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(31, 38, 135, 0.1);
`;

const ExpenseForm = ({ category, position, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    amount: '',
    date: '',
    category: category
  });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${API_URL}?category=${category}`);
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        ...form,
        date: form.date || new Date().toISOString().split('T')[0],
        amount: parseFloat(form.amount)
      };

      const response = await axios.post(API_URL, formData);
      setExpenses(prev => [...prev, response.data]);
      setForm({ name: "", amount: "", date: "", category });
    } catch (error) {
      console.error("Error adding expense:", error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Failed to add expense: ${errorMessage}\n\nError details: ${JSON.stringify(error.response?.data || error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (error) {
      console.error("Error removing expense:", error);
      alert("Failed to remove expense. Please try again.");
    }
  };

  const handleBackClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <FormContainer
      style={{
        "--x": `${position.x}px`,
        "--y": `${position.y}px`,
      }}
      className={isExiting ? "exiting" : ""}
    >
      <BackButton onClick={handleBackClick} aria-label="Go back">
        <span></span>
      </BackButton>

      <TitleContainer>
        <Title>Add {category} Expense</Title>
      </TitleContainer>

      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Expense Name"
          required
        />
        <Input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          step="0.01"
          required
        />
        <Input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Expense"}
        </Button>
      </Form>

      <TitleContainer>
        <Title>Recent Expenses</Title>
      </TitleContainer>

      <ExpenseList>
        {expenses.length === 0 ? (
          <EmptyState>No expenses added yet</EmptyState>
        ) : (
          expenses.map(expense => (
            <ExpenseItem key={expense.id}>
              <ExpenseInfo>
                <ExpenseName>{expense.name}</ExpenseName>
                <ExpenseDetails>
                  ${expense.amount.toFixed(2)} • {new Date(expense.date).toLocaleDateString()}
                </ExpenseDetails>
              </ExpenseInfo>
              <RemoveButton onClick={() => handleRemove(expense.id)} aria-label="Remove expense">
                ×
              </RemoveButton>
            </ExpenseItem>
          ))
        )}
      </ExpenseList>
    </FormContainer>
  );
};

export default ExpenseForm; 