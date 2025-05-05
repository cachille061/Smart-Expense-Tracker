import React from "react";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.7rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  font-family: inherit;
`;

const Select = styled.select`
  padding: 0.7rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  font-family: inherit;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #4f8cff 0%, #6a82fb 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: linear-gradient(90deg, #6a82fb 0%, #4f8cff 100%);
  }
`;

const ExpenseForm = ({ form, categories, onChange, onSubmit }) => (
  <Form onSubmit={onSubmit}>
    <Input
      name="name"
      placeholder="Expense Name"
      value={form.name}
      onChange={onChange}
      required
    />
    <Input
      name="amount"
      placeholder="Amount"
      type="number"
      value={form.amount}
      onChange={onChange}
      required
    />
    <Input
      name="date"
      placeholder="mm/dd/yyyy"
      type="date"
      value={form.date}
      onChange={onChange}
      required
    />
    <Select
      name="category"
      value={form.category}
      onChange={onChange}
      required
    >
      <option value="">Select a Category</option>
      {categories.length > 0 ? (
        categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))
      ) : (
        <option disabled>Loading categories...</option>
      )}
    </Select>
    <Button type="submit">Add Expense</Button>
  </Form>
);

export default ExpenseForm; 