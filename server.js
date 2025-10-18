const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const XLSX = require('xlsx');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API is running!' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// User Model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

// Income Model
const incomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Income = mongoose.model('Income', incomeSchema);

// Expense Model
const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Bills', 'Other']
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Expense = mongoose.model('Expense', expenseSchema);

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Token verification endpoint
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error during token verification' });
  }
});

// Income Routes
app.get('/api/income', authenticateToken, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.userId }).sort({ date: -1 });
    res.json(incomes);
  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({ message: 'Server error fetching income data' });
  }
});

app.post('/api/income', authenticateToken, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isNumeric().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, amount, description, date } = req.body;

    const income = new Income({
      user: req.user.userId,
      title,
      amount,
      description,
      date: date ? new Date(date) : new Date()
    });

    await income.save();
    res.status(201).json(income);
  } catch (error) {
    console.error('Add income error:', error);
    res.status(500).json({ message: 'Server error adding income' });
  }
});

app.delete('/api/income/:id', authenticateToken, async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!income) {
      return res.status(404).json({ message: 'Income record not found' });
    }

    res.json({ message: 'Income record deleted successfully' });
  } catch (error) {
    console.error('Delete income error:', error);
    res.status(500).json({ message: 'Server error deleting income' });
  }
});

// Expense Routes
app.get('/api/expense', authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ message: 'Server error fetching expense data' });
  }
});

app.post('/api/expense', authenticateToken, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isNumeric().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('category').isIn(['Food', 'Transportation', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Bills', 'Other']).withMessage('Invalid category'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, amount, category, description, date } = req.body;

    const expense = new Expense({
      user: req.user.userId,
      title,
      amount,
      category,
      description,
      date: date ? new Date(date) : new Date()
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ message: 'Server error adding expense' });
  }
});

app.delete('/api/expense/:id', authenticateToken, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense record not found' });
    }

    res.json({ message: 'Expense record deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Server error deleting expense' });
  }
});

// Dashboard Stats Route
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get total income
    const incomeAggregate = await Income.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalIncome = incomeAggregate.length > 0 ? incomeAggregate[0].total : 0;

    // Get total expenses
    const expenseAggregate = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpenses = expenseAggregate.length > 0 ? expenseAggregate[0].total : 0;

    // Get recent transactions
    const recentIncomes = await Income.find({ user: userId }).sort({ date: -1 }).limit(5);
    const recentExpenses = await Expense.find({ user: userId }).sort({ date: -1 }).limit(5);

    res.json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      recentIncomes,
      recentExpenses
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
});

// Chart Data Routes
app.get('/api/charts/income-expense', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period = 'month' } = req.query;

    let startDate;
    const endDate = new Date();

    switch (period) {
      case 'week':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    }

    const incomes = await Income.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate }
    });

    res.json({ incomes, expenses });
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({ message: 'Server error fetching chart data' });
  }
});

app.get('/api/charts/expense-categories', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const categoryData = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    res.json(categoryData);
  } catch (error) {
    console.error('Category chart error:', error);
    res.status(500).json({ message: 'Server error fetching category data' });
  }
});

// Export Routes
app.get('/api/export/income', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const incomes = await Income.find({ user: userId }).sort({ date: -1 });

    // Prepare data for Excel
    const excelData = incomes.map(income => ({
      'Title': income.title,
      'Amount': income.amount,
      'Description': income.description || '',
      'Date': new Date(income.date).toLocaleDateString(),
      'Created At': new Date(income.createdAt).toLocaleDateString()
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // Title
      { wch: 15 }, // Amount
      { wch: 30 }, // Description
      { wch: 15 }, // Date
      { wch: 15 }  // Created At
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Income Records');

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=income-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    res.send(excelBuffer);
  } catch (error) {
    console.error('Export income error:', error);
    res.status(500).json({ message: 'Server error exporting income data' });
  }
});

app.get('/api/export/expense', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenses = await Expense.find({ user: userId }).sort({ date: -1 });

    // Prepare data for Excel
    const excelData = expenses.map(expense => ({
      'Title': expense.title,
      'Amount': expense.amount,
      'Category': expense.category,
      'Description': expense.description || '',
      'Date': new Date(expense.date).toLocaleDateString(),
      'Created At': new Date(expense.createdAt).toLocaleDateString()
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // Title
      { wch: 15 }, // Amount
      { wch: 15 }, // Category
      { wch: 30 }, // Description
      { wch: 15 }, // Date
      { wch: 15 }  // Created At
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Expense Records');

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=expense-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    res.send(excelBuffer);
  } catch (error) {
    console.error('Export expense error:', error);
    res.status(500).json({ message: 'Server error exporting expense data' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
