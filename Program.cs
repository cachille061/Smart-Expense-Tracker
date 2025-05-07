using Microsoft.EntityFrameworkCore;
using SmartExpenseTracker.Models;

var builder = WebApplication.CreateBuilder(args);

// Add response compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
    policy => policy.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader());
});

// Add response caching
builder.Services.AddResponseCaching();

// Add services to the container.
builder.Services.AddControllersWithViews();

// Configure SQLite Database with optimized settings
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlite("Data Source=expenses.db");
    options.EnableSensitiveDataLogging(false);
    options.EnableDetailedErrors(builder.Environment.IsDevelopment());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Optimize middleware pipeline order
app.UseResponseCompression();
app.UseHttpsRedirection();
app.UseStaticFiles(); // Serve static files early
app.UseRouting();
app.UseCors("AllowReactApp");
app.UseResponseCaching();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
