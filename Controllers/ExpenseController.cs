using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartExpenseTracker.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartExpenseTracker.Controllers
{
    [ApiController] // Marks this as a REST API controller
    [Route("api/expenses")] // Base route for API endpoints
    public class ExpenseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExpenseController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/expenses → Returns all expenses from the database
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses(
            string? sortBy = null, 
            string? order = "asc", 
            decimal? minPrice = null, 
            decimal? maxPrice = null, 
            DateTime? startDate = null, 
            DateTime? endDate = null, 
            string? category = null)
        {
            IQueryable<Expense> query = _context.Expenses;

            // 🔹 Apply Price Range Filtering
            if (minPrice.HasValue)
                query = query.Where(e => e.Amount >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(e => e.Amount <= maxPrice.Value);

            // 🔹 Apply Date Range Filtering
            if (startDate.HasValue)
                query = query.Where(e => e.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(e => e.Date <= endDate.Value);

            // 🔹 Apply Category Filtering
            if (!string.IsNullOrWhiteSpace(category) && Expense.AllowedCategories.Contains(category))
                query = query.Where(e => e.Category == category);

            // 🔹 Apply Sorting
            switch (sortBy?.ToLower())
            {
                case "name":
                    query = (order?.ToLower() == "desc") ? query.OrderByDescending(e => e.Name) : query.OrderBy(e => e.Name);
                    break;
                case "amount":
                    query = (order?.ToLower() == "desc") ? query.OrderByDescending(e => e.Amount) : query.OrderBy(e => e.Amount);
                    break;
                case "date":
                    query = (order?.ToLower() == "desc") ? query.OrderByDescending(e => e.Date) : query.OrderBy(e => e.Date);
                    break;
            }

            return await query.ToListAsync();
        }

        // GET: api/expenses/{id} → Get a specific expense by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpenseById(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
                return NotFound(new { message = "Expense not found" });

            return Ok(expense);
        }

        [HttpGet("categories")] // Ensure the correct route
        public ActionResult<IEnumerable<string>> GetCategories()
        {
            return Ok(Expense.AllowedCategories);
        }

        // POST: api/expenses → Add a new expense to the database
        [HttpPost]
        public async Task<ActionResult<Expense>> AddExpense(Expense newExpense)
        {
            if (newExpense.Amount <= 0 || string.IsNullOrWhiteSpace(newExpense.Name))
                return BadRequest(new { message = "Invalid expense data" });

            // 🔹 Validate category before adding the expense
            if (!Expense.AllowedCategories.Contains(newExpense.Category))
            {
                return BadRequest(new { 
                    message = "Invalid category. Allowed categories: " + string.Join(", ", Expense.AllowedCategories) 
                });
            }

            _context.Expenses.Add(newExpense);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExpenseById), new { id = newExpense.Id }, newExpense);
        }

        // PUT: api/expenses/{id} → Update an existing expense
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, Expense updatedExpense)
        {
            if (id != updatedExpense.Id)
                return BadRequest();

            _context.Entry(updatedExpense).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Expenses.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/expenses/{id} → Delete an expense
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
                return NotFound();

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
