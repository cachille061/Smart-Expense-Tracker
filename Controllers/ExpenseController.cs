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
    [ResponseCache(Duration = 60)] // Cache responses for 60 seconds
    public class ExpenseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private const int DefaultPageSize = 20;

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
            string? category = null,
            int page = 1,
            int pageSize = DefaultPageSize)
        {
            // Validate pagination parameters
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = DefaultPageSize;

            // Build query with AsNoTracking for read-only operations
            var query = _context.Expenses.AsNoTracking();

            // Apply filters
            if (minPrice.HasValue)
                query = query.Where(e => e.Amount >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(e => e.Amount <= maxPrice.Value);

            if (startDate.HasValue)
                query = query.Where(e => e.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(e => e.Date <= endDate.Value);

            if (!string.IsNullOrWhiteSpace(category) && Expense.AllowedCategories.Contains(category))
                query = query.Where(e => e.Category == category);

            // Apply sorting
            query = sortBy?.ToLower() switch
            {
                "name" => order?.ToLower() == "desc" 
                    ? query.OrderByDescending(e => e.Name) 
                    : query.OrderBy(e => e.Name),
                "amount" => order?.ToLower() == "desc" 
                    ? query.OrderByDescending(e => e.Amount) 
                    : query.OrderBy(e => e.Amount),
                "date" => order?.ToLower() == "desc" 
                    ? query.OrderByDescending(e => e.Date) 
                    : query.OrderBy(e => e.Date),
                _ => query.OrderByDescending(e => e.Date) // Default sorting
            };

            // Get total count for pagination
            var totalCount = await query.CountAsync();
            
            // Apply pagination
            var expenses = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Add pagination metadata to response headers
            Response.Headers.Add("X-Total-Count", totalCount.ToString());
            Response.Headers.Add("X-Total-Pages", ((totalCount + pageSize - 1) / pageSize).ToString());
            Response.Headers.Add("X-Current-Page", page.ToString());

            return Ok(expenses);
        }

        // GET: api/expenses/{id} → Get a specific expense by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpenseById(int id)
        {
            var expense = await _context.Expenses
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id);

            if (expense == null)
                return NotFound(new { message = "Expense not found" });

            return Ok(expense);
        }

        [HttpGet("categories")] // Ensure the correct route
        [ResponseCache(Duration = 3600)] // Cache categories for 1 hour
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

            var existingExpense = await _context.Expenses.FindAsync(id);
            if (existingExpense == null)
                return NotFound();

            // Update only modified properties
            _context.Entry(existingExpense).CurrentValues.SetValues(updatedExpense);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Expenses.AnyAsync(e => e.Id == id))
                    return NotFound();
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
