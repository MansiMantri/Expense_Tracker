import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Food', 'Transportation', 'Entertainment', 'Shopping',
    'Healthcare', 'Education', 'Bills', 'Other'
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('/api/expense');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to fetch expense records');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post('/api/expense', {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      setExpenses([response.data, ...expenses]);
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      toast.success('Expense record added successfully');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error(error.response?.data?.message || 'Failed to add expense record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense record?')) {
      return;
    }

    try {
      await axios.delete(`/api/expense/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
      toast.success('Expense record deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense record');
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await axios.get('/api/export/expense', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `expense-export-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Expense data exported successfully');
    } catch (error) {
      console.error('Error exporting expense:', error);
      toast.error('Failed to export expense data');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Food': '🍔',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Shopping': '🛍️',
      'Healthcare': '🏥',
      'Education': '📚',
      'Bills': '📄',
      'Other': '📦'
    };
    return icons[category] || '📦';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food': 'bg-orange-100 text-orange-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Education': 'bg-green-100 text-green-800',
      'Bills': 'bg-gray-100 text-gray-800',
      'Other': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '400px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600">Track and manage your expenses by category</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="btn btn-secondary"
          >
            📊 Export Excel
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Expense'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-2 mb-6">
        <div className="card">
          <div className="flex-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Expenses</h3>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="text-sm text-gray-500">
                {expenses.length} expense record{expenses.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-3xl">💸</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Category</h3>
              {Object.keys(expensesByCategory).length > 0 ? (
                <>
                  <p className="text-xl font-bold text-gray-900">
                    {Object.entries(expensesByCategory).reduce((a, b) => 
                      expensesByCategory[a[0]] > expensesByCategory[b[0]] ? a : b
                    )[0]}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(Math.max(...Object.values(expensesByCategory)))}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">No expenses yet</p>
              )}
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-3xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <div className="card mb-6">
          <div className="card-header">
            <h3 className="card-title">Add New Expense</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Grocery Shopping, Gas"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Amount *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryIcon(category)} {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                placeholder="Optional description"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Expense'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expense List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Expense Records</h3>
        </div>
        {expenses.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💸</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expense records yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first expense</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Add Expense
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div
                key={expense._id}
                className="flex-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex-1">
                  <div className="flex-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">{expense.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                        {getCategoryIcon(expense.category)} {expense.category}
                      </span>
                    </div>
                    <span className="font-bold text-red-600">
                      -{formatCurrency(expense.amount)}
                    </span>
                  </div>
                  <div className="flex-between text-sm text-gray-500">
                    <span>{formatDate(expense.date)}</span>
                    {expense.description && (
                      <span className="italic">{expense.description}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="opacity-0 group-hover:opacity-100 btn btn-danger"
                  style={{ padding: '8px 12px', fontSize: '14px' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Expense;

