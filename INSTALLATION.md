# Expense Tracker - Installation & Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** (optional, for version control)

## Installation Steps

### 1. Install Backend Dependencies

Open your terminal/command prompt in the project root directory and run:

```bash
npm install
```

This will install all the required backend dependencies including:
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Excel export functionality
- And other necessary packages

### 2. Install Frontend Dependencies

Navigate to the client directory and install React dependencies:

```bash
cd client
npm install
cd ..
```

This will install all the required frontend dependencies including:
- React and React Router
- Chart.js for data visualization
- Axios for API calls
- Toast notifications
- And other UI libraries

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
PORT=5000
```

**Important Notes:**
- Replace `your_super_secret_jwt_key_here_make_it_long_and_random` with a strong, random secret key
- If using MongoDB Atlas, replace the MongoDB URI with your Atlas connection string
- The PORT can be changed if needed (default is 5000)

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database when you first run it

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace the `MONGODB_URI` in your `.env` file

## Running the Application

### Development Mode

1. **Start the Backend Server:**
   ```bash
   npm run dev
   ```
   This will start the Express server on port 5000 (or your configured PORT)

2. **Start the Frontend Development Server:**
   ```bash
   npm run client
   ```
   This will start the React development server on port 3000

3. **Access the Application:**
   - Open your browser and go to `http://localhost:3000`
   - The backend API will be available at `http://localhost:5000`

### Production Mode

1. **Build the Frontend:**
   ```bash
   npm run build
   ```

2. **Start the Production Server:**
   ```bash
   npm start
   ```

## First Time Setup

1. **Register a New Account:**
   - Go to the application URL
   - Click "Sign up here" on the login page
   - Fill in your details and create an account

2. **Start Tracking:**
   - Add your first income source
   - Add your first expense
   - View your dashboard with charts and analytics

## Features Overview

### 🔐 User Authentication
- Secure registration and login
- JWT-based authentication
- Protected routes

### 📊 Dashboard
- Financial overview with summary cards
- Interactive charts (Bar, Pie, Line)
- Recent transactions display
- Real-time balance calculation

### 💰 Income Management
- Add income sources
- View all income records
- Delete income entries
- Export to Excel

### 💸 Expense Management
- Add expenses with categories
- Category-based tracking
- View all expense records
- Delete expense entries
- Export to Excel

### 📱 Mobile Responsive
- Works on desktop, tablet, and mobile
- Touch-friendly interface
- Responsive charts and layouts

### 📈 Data Visualization
- Bar charts for income vs expenses
- Pie charts for expense categories
- Line charts for trends over time

### 📄 Excel Export
- Export income data to Excel
- Export expense data to Excel
- Formatted spreadsheets with proper columns

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check your connection string in `.env`
   - Verify network connectivity (for Atlas)

2. **Port Already in Use:**
   - Change the PORT in `.env` file
   - Kill existing processes using the port

3. **Dependencies Installation Issues:**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json`, then reinstall

4. **Frontend Build Issues:**
   - Ensure all dependencies are installed
   - Check for version conflicts
   - Try deleting `client/node_modules` and reinstalling

### Getting Help

If you encounter any issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is accessible
4. Check that all dependencies are installed

## Security Notes

- Keep your JWT secret secure and don't commit it to version control
- Use environment variables for sensitive configuration
- Consider using HTTPS in production
- Regularly update dependencies for security patches

## Next Steps

After successful installation:

1. Customize the application to your needs
2. Add more expense categories if needed
3. Implement additional features
4. Deploy to a cloud platform for production use

Enjoy using your Expense Tracker! 🎉

