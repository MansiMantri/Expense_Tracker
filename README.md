# Expense Tracker App

A comprehensive expense tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```

3. **Start the application:**
   ```bash
   # Terminal 1 - Backend
   npm run dev
   
   # Terminal 2 - Frontend
   npm run client
   ```

4. **Access the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## ✨ Features

- **🔐 User Authentication** - Secure login and registration with JWT
- **📊 Interactive Dashboard** - Financial overview with charts and analytics
- **💰 Income Management** - Add, view, delete, and export income sources
- **💸 Expense Management** - Category-based expense tracking with export
- **📈 Data Visualization** - Bar, Pie, and Line charts using Chart.js
- **📱 Mobile Responsive** - Works seamlessly across all devices
- **📄 Excel Export** - Download income and expense data in Excel format
- **🎨 Modern UI** - Clean, intuitive interface with smooth animations

## 🛠️ Tech Stack

- **Frontend:** React.js, Chart.js, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** CSS3 with responsive design
- **Export:** Excel file generation with XLSX

## 📦 Installation

For detailed installation instructions, see [INSTALLATION.md](INSTALLATION.md)

## 🎯 Usage

1. **Register/Login** - Create an account or sign in
2. **Add Income** - Track your income sources
3. **Add Expenses** - Categorize and track your spending
4. **View Dashboard** - See your financial overview with charts
5. **Export Data** - Download your data in Excel format

## 🔒 Security

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- Input validation and sanitization


**Happy Expense Tracking!** 💰📊