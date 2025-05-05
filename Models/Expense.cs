using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace SmartExpenseTracker.Models
{
    // The Expense model represents an expense entry
    public class Expense
    {
        public int Id { get; set; } // Unique ID for the expense
        public string? Name { get; set; } // Name of the expense (e.g., "Groceries")
        public decimal Amount { get; set; } // Amount spent
        public DateTime Date { get; set; } // Date of the expense

        [Required]
        public string? Category { get; set; } // Expense category (Food, Bills, etc.)

        // Predefined categories (Users must select from this list)
        public static readonly List<string> AllowedCategories = new List<string>
        {
            "Food",
            "Bills",
            "Transportation",
            "Health",
            "Entertainment",
            "Shopping",
            "Education",
            "Housing",
            "Savings",
            "Investments",
            "Other"
        };

        // Validates if the category is allowed
        public static bool IsValidCategory(string category)
        {
            return AllowedCategories.Contains(category);
        }
    }
}
