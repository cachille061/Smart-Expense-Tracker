# Smart Expense Tracker

A full-stack expense tracking application built with ASP.NET Core and React.

## Project Structure

```
Smart-Expense-Tracker/
├── smart-expense-tracker-frontend/    # React frontend application
│   ├── src/                          # React source code
│   │   ├── components/               # React components
│   │   ├── services/                 # API service calls
│   │   └── utils/                    # Utility functions
│   ├── public/                       # Static files
│   └── package.json                  # Frontend dependencies
│
├── Controllers/                      # API Controllers
│   └── ExpenseController.cs          # Expense-related endpoints
│
├── Models/                           # Data Models
│   ├── Expense.cs                    # Expense entity
│   └── ApplicationDbContext.cs       # Database context
│
├── Migrations/                       # Database migrations
│
├── wwwroot/                          # Backend static files
│   ├── css/                         # Stylesheets
│   ├── js/                          # JavaScript files
│   └── lib/                         # Third-party libraries
│
└── Program.cs                        # Application entry point
```

## Technology Stack

### Backend
- ASP.NET Core 6.0+
- Entity Framework Core
- SQLite Database
- RESTful API Architecture

### Frontend
- React 18+
- Modern JavaScript (ES6+)
- CSS3 with modern features
- Responsive Design

## Features

- Track daily expenses
- Categorize expenses
- Filter and sort expenses
- Responsive design for all devices
- Real-time updates
- Data persistence
- Secure API endpoints

## Getting Started

### Prerequisites
- .NET 6.0 SDK or later
- Node.js 14.0 or later
- npm or yarn

### Backend Setup
1. Navigate to the project root:
   ```bash
   cd Smart-Expense-Tracker
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Run database migrations:
   ```bash
   dotnet ef database update
   ```

4. Start the backend:
   ```bash
   dotnet run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd smart-expense-tracker-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Expenses
- `GET /api/expenses` - Get all expenses (with filtering and pagination)
- `GET /api/expenses/{id}` - Get a specific expense
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/{id}` - Update an existing expense
- `DELETE /api/expenses/{id}` - Delete an expense
- `GET /api/expenses/categories` - Get all expense categories

## Performance Optimizations

The application implements several performance optimizations:

1. **Backend Optimizations**
   - Response compression
   - Response caching
   - Entity Framework query optimization
   - Asynchronous programming
   - Proper middleware ordering

2. **Frontend Optimizations**
   - Code splitting
   - Lazy loading
   - Efficient state management
   - Optimized re-renders
   - Proper error handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 