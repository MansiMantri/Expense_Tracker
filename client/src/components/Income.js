// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const Income = () => {
//   const [incomes, setIncomes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     amount: '',
//     description: '',
//     date: new Date().toISOString().split('T')[0]
//   });
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetchIncomes();
//   }, []);

//   const fetchIncomes = async () => {
//     try {
//       const response = await axios.get('/api/income');
//       setIncomes(response.data);
//     } catch (error) {
//       console.error('Error fetching incomes:', error);
//       toast.error('Failed to fetch income records');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       const response = await axios.post('/api/income', {
//         ...formData,
//         amount: parseFloat(formData.amount)
//       });
      
//       setIncomes([response.data, ...incomes]);
//       setFormData({
//         title: '',
//         amount: '',
//         description: '',
//         date: new Date().toISOString().split('T')[0]
//       });
//       setShowForm(false);
//       toast.success('Income record added successfully');
//     } catch (error) {
//       console.error('Error adding income:', error);
//       toast.error(error.response?.data?.message || 'Failed to add income record');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this income record?')) {
//       return;
//     }

//     try {
//       await axios.delete(`/api/income/${id}`);
//       setIncomes(incomes.filter(income => income._id !== id));
//       toast.success('Income record deleted successfully');
//     } catch (error) {
//       console.error('Error deleting income:', error);
//       toast.error('Failed to delete income record');
//     }
//   };

//   const exportToExcel = async () => {
//     try {
//       const response = await axios.get('/api/export/income', {
//         responseType: 'blob'
//       });
      
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `income-export-${new Date().toISOString().split('T')[0]}.xlsx`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//       toast.success('Income data exported successfully');
//     } catch (error) {
//       console.error('Error exporting income:', error);
//       toast.error('Failed to export income data');
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount);
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

//   if (loading) {
//     return (
//       <div className="flex-center" style={{ height: '400px' }}>
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="fade-in">
//       <div className="flex-between mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Income Management</h1>
//           <p className="text-gray-600">Track and manage your income sources</p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={exportToExcel}
//             className="btn btn-secondary"
//           >
//             📊 Export Excel
//           </button>
//           <button
//             onClick={() => setShowForm(!showForm)}
//             className="btn btn-primary"
//           >
//             {showForm ? 'Cancel' : '+ Add Income'}
//           </button>
//         </div>
//       </div>

//       {/* Summary Card */}
//       <div className="card mb-6">
//         <div className="flex-between">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">Total Income</h3>
//             <p className="text-3xl font-bold text-green-600">
//               {formatCurrency(totalIncome)}
//             </p>
//             <p className="text-sm text-gray-500">
//               {incomes.length} income record{incomes.length !== 1 ? 's' : ''}
//             </p>
//           </div>
//           <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
//             <span className="text-3xl">💰</span>
//           </div>
//         </div>
//       </div>

//       {/* Add Income Form */}
//       {showForm && (
//         <div className="card mb-6">
//           <div className="card-header">
//             <h3 className="card-title">Add New Income</h3>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-2">
//               <div className="form-group">
//                 <label className="form-label">Title *</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   className="form-input"
//                   placeholder="e.g., Salary, Freelance Work"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Amount *</label>
//                 <input
//                   type="number"
//                   name="amount"
//                   value={formData.amount}
//                   onChange={handleChange}
//                   className="form-input"
//                   placeholder="0.00"
//                   step="0.01"
//                   min="0"
//                   required
//                 />
//               </div>
//             </div>
//             <div className="grid grid-2">
//               <div className="form-group">
//                 <label className="form-label">Date</label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   className="form-input"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Description</label>
//                 <input
//                   type="text"
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   className="form-input"
//                   placeholder="Optional description"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 type="submit"
//                 className="btn btn-primary"
//                 disabled={submitting}
//               >
//                 {submitting ? 'Adding...' : 'Add Income'}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setShowForm(false)}
//                 className="btn btn-secondary"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Income List */}
//       <div className="card">
//         <div className="card-header">
//           <h3 className="card-title">Income Records</h3>
//         </div>
//         {incomes.length === 0 ? (
//           <div className="text-center py-8">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-2xl">💰</span>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No income records yet</h3>
//             <p className="text-gray-500 mb-4">Start by adding your first income source</p>
//             <button
//               onClick={() => setShowForm(true)}
//               className="btn btn-primary"
//             >
//               Add Income
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {incomes.map((income) => (
//               <div
//                 key={income._id}
//                 className="flex-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
//               >
//                 <div className="flex-1">
//                   <div className="flex-between mb-2">
//                     <h4 className="font-semibold text-gray-900">{income.title}</h4>
//                     <span className="font-bold text-green-600">
//                       +{formatCurrency(income.amount)}
//                     </span>
//                   </div>
//                   <div className="flex-between text-sm text-gray-500">
//                     <span>{formatDate(income.date)}</span>
//                     {income.description && (
//                       <span className="italic">{income.description}</span>
//                     )}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => handleDelete(income._id)}
//                   className="opacity-0 group-hover:opacity-100 btn btn-danger"
//                   style={{ padding: '8px 12px', fontSize: '14px' }}
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Income;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await axios.get('/api/income');
      setIncomes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching incomes:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/income', formData);
      setFormData({
        title: '',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchIncomes();
      setShowForm(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error adding income:', error);
      alert('Error adding income. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await axios.delete(`/api/income/${id}`);
        fetchIncomes();
      } catch (error) {
        console.error('Error deleting income:', error);
        alert('Error deleting income. Please try again.');
      }
    }
  };

  const handleExportExcel = () => {
    alert('Export to Excel functionality coming soon!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '400px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'white' }}>
            Income Management
          </h1>
          <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Track and manage your income sources
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleExportExcel}
            className="btn"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📊 Export Excel
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
            style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ➕ Add Income
          </button>
        </div>
      </div>

      {/* Total Income Card */}
      <div className="card mb-8" style={{ 
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
            Total Income
          </h2>
          <p style={{ fontSize: '42px', fontWeight: '700', color: '#10b981', margin: '8px 0' }}>
            {formatCurrency(totalIncome)}
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            {incomes.length} income {incomes.length === 1 ? 'record' : 'records'}
          </p>
        </div>
        <div style={{ fontSize: '64px' }}>💰</div>
      </div>

      {/* Add Income Form */}
      {showForm && (
        <div className="card mb-8">
          <div className="card-header">
            <h2 className="card-title">Add New Income</h2>
            <button
              onClick={() => setShowForm(false)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '4px',
                lineHeight: 1
              }}
              title="Close form"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2 mb-4">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Monthly Salary"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  name="amount"
                  className="form-input"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Salary">Salary</option>
                  <option value="Investments">Investments</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Description (Optional)</label>
              <textarea
                name="description"
                className="form-input"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add notes about this income"
                rows="3"
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">
                💰 Add Income
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

      {/* Income Records */}
      <div className="card">
        <h2 className="card-title mb-4">Income Records</h2>
        
        {incomes.length === 0 ? (
          <div className="text-center py-8">
            <div style={{ 
              width: '64px', 
              height: '64px', 
              background: '#f3f4f6', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px' 
            }}>
              <span style={{ fontSize: '32px' }}>💰</span>
            </div>
            <p style={{ color: '#6b7280' }}>No income records yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {incomes.map((income) => (
              <div 
                key={income._id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '20px',
                  background: '#fafafa',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fafafa';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: '600', 
                      color: '#111827', 
                      margin: 0
                    }}>
                      {income.title}
                    </h3>
                    <span style={{ 
                      fontSize: '20px', 
                      fontWeight: '700', 
                      color: '#10b981'
                    }}>
                      +{formatCurrency(income.amount)}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>
                    {formatDate(income.date)}
                    <span style={{
                      marginLeft: '8px',
                      color: '#10b981',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {income.category}
                    </span>
                  </p>
                  {income.description && (
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#6b7280', 
                      marginTop: '8px',
                      fontStyle: 'italic'
                    }}>
                      {income.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(income._id)}
                  className="btn btn-danger"
                  style={{ padding: '10px 24px', fontSize: '14px', alignSelf: 'flex-start' }}
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

export default Income;

