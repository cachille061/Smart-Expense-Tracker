import React from "react";
import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const Th = styled.th`
  background: #f3f4f6;
  font-weight: 700;
  padding: 0.8rem 1rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 0.8rem 1rem;
  text-align: left;
  font-weight: 400;
`;

const Tr = styled.tr`
  &:nth-child(even) ${Td} {
    background: #f9fafb;
  }
`;

const ExpenseTable = ({ expenses }) => (
  <Table>
    <thead>
      <tr>
        <Th>Name</Th>
        <Th>Amount</Th>
        <Th>Date</Th>
        <Th>Category</Th>
      </tr>
    </thead>
    <tbody>
      {expenses.length > 0 ? (
        expenses.map(exp => (
          <Tr key={exp.id}>
            <Td>{exp.name}</Td>
            <Td>${Number(exp.amount).toFixed(2)}</Td>
            <Td>{new Date(exp.date).toLocaleDateString()}</Td>
            <Td>{exp.category}</Td>
          </Tr>
        ))
      ) : (
        <tr>
          <Td colSpan="4" style={{ textAlign: "center" }}>No expenses recorded.</Td>
        </tr>
      )}
    </tbody>
  </Table>
);

export default ExpenseTable; 