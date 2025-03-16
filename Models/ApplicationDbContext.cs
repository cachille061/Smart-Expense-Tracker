using Microsoft.EntityFrameworkCore;

namespace SmartExpenseTracker.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Expense> Expenses { get; set; } // Represents the Expenses table
    }
}
