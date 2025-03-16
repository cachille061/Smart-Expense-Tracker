import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5251/api/expenses"; // Backend API
const CATEGORY_URL = "http://localhost:5251/api/expenses/categories";

function App() {
  const [expenses, setExpenses] = useState([]); // State to store expenses
  const [categories, setCategories] = useState([]); // State to store categories
  const [form, setForm] = useState({
    name: "",
    amount: "",
    date: "",
    category: ""
  });

  // 🔹 Fetch expenses from the API when the component loads
  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        console.log("Expenses fetched:", response.data);
        setExpenses(response.data);
      })
      .catch(error => console.error("Error fetching expenses:", error));
  }, []);

  // 🔹 Fetch predefined categories from the API
  useEffect(() => {
    axios.get(CATEGORY_URL)
      .then(response => {
        console.log("Categories fetched:", response.data);
        setCategories(response.data);
      })
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  // 🔹 Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate input
    if (!form.name || !form.amount || !form.date || !form.category) {
      alert("Please fill in all fields.");
      return;
    }

    axios.post(API_URL, form)
      .then(response => {
        console.log("Expense added:", response.data);
        setExpenses(prevExpenses => [...prevExpenses, response.data]); // Update UI
        setForm({ name: "", amount: "", date: "", category: "" }); // Reset form
      })
      .catch(error => {
        console.error("Error adding expense:", error.response?.data || error.message);
        alert(error.response?.data.message || "Failed to add expense");
      });
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "auto" }}>
      <h1>Smart Expense Tracker</h1>

      {/* 🔹 Expense Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Expense Name" required style={{ display: "block", marginBottom: "10px", width: "100%" }} />
        <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" required style={{ display: "block", marginBottom: "10px", width: "100%" }} />
        <input type="date" name="date" value={form.date} onChange={handleChange} required style={{ display: "block", marginBottom: "10px", width: "100%" }} />

        {/* 🔹 Category Dropdown */}
        <select name="category" value={form.category} onChange={handleChange} required style={{ display: "block", marginBottom: "10px", width: "100%" }}>
          <option value="">Select a Category</option>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))
          ) : (
            <option disabled>Loading categories...</option>
          )}
        </select>

        <button type="submit" style={{ padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", cursor: "pointer" }}>Add Expense</button>
      </form>

      {/* 🔹 Expenses Table */}
      <h2>Expenses</h2>
      <table border="1" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map(expense => (
              <tr key={expense.id}>
                <td>{expense.name}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{expense.category}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No expenses recorded.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
