// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement,
// } from 'chart.js';
// import { Bar, Pie, Line } from 'react-chartjs-2';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement
// );

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalIncome: 0,
//     totalExpenses: 0,
//     balance: 0,
//     recentIncomes: [],
//     recentExpenses: []
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   // Debug - check data in console
//   useEffect(() => {
//     console.log('Dashboard Stats:', stats);
//   }, [stats]);

//   const fetchDashboardData = async () => {
//     try {
//       const response = await axios.get('/api/dashboard/stats');
//       setStats(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching dashboard stats:', error);
//       setLoading(false);
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
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   // Prepare date-wise chart data
//   const prepareLineChartData = () => {
//     if (stats.recentIncomes.length === 0 && stats.recentExpenses.length === 0) {
//       return {
//         labels: ['No Data'],
//         incomeData: [0],
//         expenseData: [0]
//       };
//     }

//     const dateMap = new Map();

//     // Process incomes
//     stats.recentIncomes.forEach(item => {
//       const date = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//       if (!dateMap.has(date)) {
//         dateMap.set(date, { income: 0, expense: 0, dateObj: new Date(item.date) });
//       }
//       dateMap.get(date).income += item.amount;
//     });

//     // Process expenses
//     stats.recentExpenses.forEach(item => {
//       const date = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//       if (!dateMap.has(date)) {
//         dateMap.set(date, { income: 0, expense: 0, dateObj: new Date(item.date) });
//       }
//       dateMap.get(date).expense += item.amount;
//     });

//     // Sort by date
//     const sortedEntries = Array.from(dateMap.entries()).sort((a, b) => 
//       a[1].dateObj - b[1].dateObj
//     );

//     return {
//       labels: sortedEntries.map(entry => entry[0]),
//       incomeData: sortedEntries.map(entry => entry[1].income),
//       expenseData: sortedEntries.map(entry => entry[1].expense)
//     };
//   };

//   const lineChartInfo = prepareLineChartData();

//   // Income vs Expenses Bar Chart
//   const incomeExpenseChartData = {
//     labels: ['Income', 'Expenses'],
//     datasets: [
//       {
       
//         data: [stats.totalIncome, stats.totalExpenses],
//         backgroundColor: ['#10b981', '#ef4444'],
//         borderColor: ['#059669', '#dc2626'],
//         borderWidth: 1,
//         borderRadius: 8,
//       },
//     ],
//   };
// const barChartOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       display: false, // Hide legend
//     },
//     tooltip: {
//       backgroundColor: 'rgba(0, 0, 0, 0.8)',
//       padding: 12,
//       callbacks: {
//         label: function(context) {
//           return formatCurrency(context.parsed.y);
//         }
//       }
//     }
//   },
//   scales: {
//     y: {
//       beginAtZero: true,
//       grid: {
//         color: 'rgba(0, 0, 0, 0.05)',
//       },
//       ticks: {
//         callback: function(value) {
//           return '$' + value.toLocaleString();
//         }
//       }
//     },
//     x: {
//       grid: {
//         display: false
//       }
//     }
//   }
// };
//   // Category Pie Chart - Using real expense categories
//   const prepareCategoryData = () => {
//     if (stats.recentExpenses.length === 0) {
//       return {
//         labels: ['No Data'],
//         data: [1],
//         colors: ['#e5e7eb']
//       };
//     }

//     const categoryMap = new Map();
    
//     stats.recentExpenses.forEach(expense => {
//       const category = expense.category || 'Other';
//       categoryMap.set(category, (categoryMap.get(category) || 0) + expense.amount);
//     });

//     const colors = ['#6C63FF', '#ef4444', '#f97316', '#3b82f6', '#10b981', '#ec4899'];
    
//     return {
//       labels: Array.from(categoryMap.keys()),
//       data: Array.from(categoryMap.values()),
//       colors: colors.slice(0, categoryMap.size)
//     };
//   };

//   const categoryInfo = prepareCategoryData();

//   const categoryChartData = {
//     labels: categoryInfo.labels,
//     datasets: [
//       {
//         data: categoryInfo.data,
//         backgroundColor: categoryInfo.colors,
//         borderWidth: 0,
//         cutout: '60%',
//       },
//     ],
//   };

//   // Line Chart Data
//   const lineChartData = {
//     labels: lineChartInfo.labels,
//     datasets: [
//       {
//         label: 'Income',
//         data: lineChartInfo.incomeData,
//         borderColor: '#10b981',
//         backgroundColor: 'rgba(16, 185, 129, 0.1)',
//         tension: 0.4,
//         fill: true,
//         pointRadius: 4,
//         pointHoverRadius: 6,
//       },
//       {
//         label: 'Expenses',
//         data: lineChartInfo.expenseData,
//         borderColor: '#ef4444',
//         backgroundColor: 'rgba(239, 68, 68, 0.1)',
//         tension: 0.4,
//         fill: true,
//         pointRadius: 4,
//         pointHoverRadius: 6,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           usePointStyle: true,
//           padding: 15,
//           font: {
//             size: 12,
//             weight: '500'
//           }
//         }
//       },
//       tooltip: {
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         padding: 12,
//         titleFont: {
//           size: 14,
//           weight: '600'
//         },
//         bodyFont: {
//           size: 13
//         },
//         borderColor: 'rgba(255, 255, 255, 0.1)',
//         borderWidth: 1
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: 'rgba(0, 0, 0, 0.05)',
//         },
//         ticks: {
//           callback: function(value) {
//             return '$' + value.toLocaleString();
//           }
//         }
//       },
//       x: {
//         grid: {
//           display: false
//         }
//       }
//     }
//   };

//   const pieOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           usePointStyle: true,
//           padding: 15,
//           font: {
//             size: 12
//           }
//         }
//       },
//       tooltip: {
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         padding: 12,
//         callbacks: {
//           label: function(context) {
//             const label = context.label || '';
//             const value = formatCurrency(context.parsed);
//             return label + ': ' + value;
//           }
//         }
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex-center" style={{ height: '400px' }}>
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="fade-in">
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold mb-2" style={{ color: 'white' }}>
//           Dashboard
//         </h1>
//         <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
//           Welcome back! Here's your financial overview.
//         </p>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-3 mb-8">
//         <div className="card group">
//           <div className="flex-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 mb-1">Total Balance</p>
//               <p className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                 {formatCurrency(stats.balance)}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">Current balance</p>
//             </div>
//             <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
//               <span className="text-3xl">💰</span>
//             </div>
//           </div>
//         </div>

//         <div className="card group">
//           <div className="flex-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 mb-1">Total Income</p>
//               <p className="text-3xl font-bold text-green-600">
//                 {formatCurrency(stats.totalIncome)}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">This month</p>
//             </div>
//             <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
//               <span className="text-3xl">📈</span>
//             </div>
//           </div>
//         </div>

//         <div className="card group">
//           <div className="flex-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 mb-1">Total Expenses</p>
//               <p className="text-3xl font-bold text-red-600">
//                 {formatCurrency(stats.totalExpenses)}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">This month</p>
//             </div>
//             <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
//               <span className="text-3xl">📉</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-2 mb-8">
//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title flex items-center">
//               <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
//                 <span className="text-white text-sm">📊</span>
//               </span>
//               Income vs Expenses
//             </h3>
//           </div>
//           <div style={{ height: '320px' }}>
//             <Bar data={incomeExpenseChartData} options={barChartOptions} />
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title flex items-center">
//               <span className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mr-3">
//                 <span className="text-white text-sm">🥧</span>
//               </span>
//               Expenses by Category
//             </h3>
//           </div>
//           <div style={{ height: '320px' }}>
//             <Pie data={categoryChartData} options={pieOptions} />
//           </div>
//         </div>
//       </div>

//       {/* Line Chart */}
//       <div className="card mb-8">
//         <div className="card-header">
//           <h3 className="card-title flex items-center">
//             <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
//               <span className="text-white text-sm">📈</span>
//             </span>
//             Income & Expenses Trend
//           </h3>
//         </div>
//         <div style={{ height: '320px' }}>
//           <Line data={lineChartData} options={chartOptions} />
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       <div className="grid grid-2">
//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title flex items-center">
//               <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
//                 <span className="text-white text-sm">💰</span>
//               </span>
//               Recent Income
//             </h3>
//           </div>
//           <div className="space-y-3">
//             {stats.recentIncomes.length === 0 ? (
//               <div className="text-center py-8">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <span className="text-2xl text-gray-400">💰</span>
//                 </div>
//                 <p className="text-gray-500">No recent income records</p>
//               </div>
//             ) : (
//               stats.recentIncomes.map((income) => (
//                 <div key={income._id} className="flex-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 group">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
//                       <span className="text-white text-sm">💰</span>
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900">{income.title}</p>
//                       <p className="text-sm text-gray-500">{formatDate(income.date)}</p>
//                     </div>
//                   </div>
//                   <p className="font-bold text-green-600 text-lg">
//                     +{formatCurrency(income.amount)}
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title flex items-center">
//               <span className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
//                 <span className="text-white text-sm">💸</span>
//               </span>
//               Recent Expenses
//             </h3>
//           </div>
//           <div className="space-y-3">
//             {stats.recentExpenses.length === 0 ? (
//               <div className="text-center py-8">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <span className="text-2xl text-gray-400">💸</span>
//                 </div>
//                 <p className="text-gray-500">No recent expense records</p>
//               </div>
//             ) : (
//               stats.recentExpenses.map((expense) => (
//                 <div key={expense._id} className="flex-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl hover:from-red-100 hover:to-pink-100 transition-all duration-200 group">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
//                       <span className="text-white text-sm">💸</span>
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900">{expense.title}</p>
//                       <p className="text-sm text-gray-500">
//                         {expense.category} • {formatDate(expense.date)}
//                       </p>
//                     </div>
//                   </div>
//                   <p className="font-bold text-red-600 text-lg">
//                     -{formatCurrency(expense.amount)}
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    recentIncomes: [],
    recentExpenses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    console.log('Dashboard Stats:', stats);
  }, [stats]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  // Export to Excel Function
  const handleExportExcel = async () => {
    try {
      // Show loading state
      const exportButton = document.getElementById('export-btn');
      if (exportButton) {
        exportButton.disabled = true;
        exportButton.textContent = 'Exporting...';
      }

      // Fetch all income and expense data
      const incomeResponse = await axios.get('/api/income');
      const expenseResponse = await axios.get('/api/expense');
      
      const incomes = incomeResponse.data;
      const expenses = expenseResponse.data;

      // Prepare Income Sheet Data
      const incomeData = incomes.map((income, index) => ({
        'No.': index + 1,
        'Type': 'Income',
        'Title': income.title,
        'Category': income.category,
        'Amount': income.amount,
        'Date': new Date(income.date).toLocaleDateString(),
        'Description': income.description || '-'
      }));

      // Prepare Expense Sheet Data
      const expenseData = expenses.map((expense, index) => ({
        'No.': index + 1,
        'Type': 'Expense',
        'Title': expense.title,
        'Category': expense.category,
        'Amount': expense.amount,
        'Date': new Date(expense.date).toLocaleDateString(),
        'Description': expense.description || '-'
      }));

      // Combined Data - Sorted by Date
      const combinedData = [
        ...incomeData,
        ...expenseData
      ].sort((a, b) => new Date(b.Date) - new Date(a.Date));

      // Summary Sheet
      const summaryData = [
        { 'Metric': 'Total Income', 'Value': `$${stats.totalIncome.toFixed(2)}` },
        { 'Metric': 'Total Expenses', 'Value': `$${stats.totalExpenses.toFixed(2)}` },
        { 'Metric': 'Net Balance', 'Value': `$${stats.balance.toFixed(2)}` },
        { 'Metric': '', 'Value': '' },
        { 'Metric': 'Income Records', 'Value': incomes.length },
        { 'Metric': 'Expense Records', 'Value': expenses.length },
        { 'Metric': 'Total Transactions', 'Value': incomes.length + expenses.length },
        { 'Metric': '', 'Value': '' },
        { 'Metric': 'Export Date', 'Value': new Date().toLocaleDateString() },
        { 'Metric': 'Export Time', 'Value': new Date().toLocaleTimeString() },
      ];

      // Create workbook with multiple sheets
      const workbook = XLSX.utils.book_new();
      
      // Summary Sheet
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      
      // All Transactions Sheet
      if (combinedData.length > 0) {
        const allTransactionsSheet = XLSX.utils.json_to_sheet(combinedData);
        XLSX.utils.book_append_sheet(workbook, allTransactionsSheet, 'All Transactions');
      }
      
      // Income Sheet
      if (incomeData.length > 0) {
        const incomeSheet = XLSX.utils.json_to_sheet(incomeData);
        XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Income');
      }
      
      // Expense Sheet
      if (expenseData.length > 0) {
        const expenseSheet = XLSX.utils.json_to_sheet(expenseData);
        XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Expenses');
      }

      // Generate filename with current date
      const fileName = `Expense_Tracker_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Download file
      XLSX.writeFile(workbook, fileName);
      
      // Reset button
      if (exportButton) {
        exportButton.disabled = false;
        exportButton.innerHTML = '<span style="font-size: 18px">📊</span> Export to Excel';
      }
      
      alert('✅ Excel file downloaded successfully!');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('❌ Error exporting data. Please try again.');
      
      // Reset button on error
      const exportButton = document.getElementById('export-btn');
      if (exportButton) {
        exportButton.disabled = false;
        exportButton.innerHTML = '<span style="font-size: 18px">📊</span> Export to Excel';
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Prepare date-wise chart data
  const prepareLineChartData = () => {
    if (stats.recentIncomes.length === 0 && stats.recentExpenses.length === 0) {
      return {
        labels: ['No Data'],
        incomeData: [0],
        expenseData: [0]
      };
    }

    const dateMap = new Map();

    stats.recentIncomes.forEach(item => {
      const date = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dateMap.has(date)) {
        dateMap.set(date, { income: 0, expense: 0, dateObj: new Date(item.date) });
      }
      dateMap.get(date).income += item.amount;
    });

    stats.recentExpenses.forEach(item => {
      const date = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dateMap.has(date)) {
        dateMap.set(date, { income: 0, expense: 0, dateObj: new Date(item.date) });
      }
      dateMap.get(date).expense += item.amount;
    });

    const sortedEntries = Array.from(dateMap.entries()).sort((a, b) => 
      a[1].dateObj - b[1].dateObj
    );

    return {
      labels: sortedEntries.map(entry => entry[0]),
      incomeData: sortedEntries.map(entry => entry[1].income),
      expenseData: sortedEntries.map(entry => entry[1].expense)
    };
  };

  const lineChartInfo = prepareLineChartData();

  // Income vs Expenses Bar Chart
  const incomeExpenseChartData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [stats.totalIncome, stats.totalExpenses],
        backgroundColor: ['#10b981', '#ef4444'],
        borderColor: ['#059669', '#dc2626'],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  // Category Pie Chart
  const prepareCategoryData = () => {
    if (stats.recentExpenses.length === 0) {
      return {
        labels: ['No Data'],
        data: [1],
        colors: ['#e5e7eb']
      };
    }

    const categoryMap = new Map();
    
    stats.recentExpenses.forEach(expense => {
      const category = expense.category || 'Other';
      categoryMap.set(category, (categoryMap.get(category) || 0) + expense.amount);
    });

    const colors = ['#6C63FF', '#ef4444', '#f97316', '#3b82f6', '#10b981', '#ec4899'];
    
    return {
      labels: Array.from(categoryMap.keys()),
      data: Array.from(categoryMap.values()),
      colors: colors.slice(0, categoryMap.size)
    };
  };

  const categoryInfo = prepareCategoryData();

  const categoryChartData = {
    labels: categoryInfo.labels,
    datasets: [
      {
        data: categoryInfo.data,
        backgroundColor: categoryInfo.colors,
        borderWidth: 0,
        cutout: '60%',
      },
    ],
  };

  // Line Chart Data
  const lineChartData = {
    labels: lineChartInfo.labels,
    datasets: [
      {
        label: 'Income',
        data: lineChartInfo.incomeData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Expenses',
        data: lineChartInfo.expenseData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            return formatCurrency(context.parsed.y);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = formatCurrency(context.parsed);
            return label + ': ' + value;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '400px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header with Export Button */}
      <div className="mb-8" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'white' }}>
            Dashboard
          </h1>
          <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Welcome back! Here's your financial overview.
          </p>
        </div>
        
        {/* Export Button */}
        <button
          id="export-btn"
          onClick={handleExportExcel}
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
          }}
        >
          <span style={{ fontSize: '18px' }}>📊</span>
          Export to Excel
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-3 mb-8">
        <div className="card group">
          <div className="flex-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Balance</p>
              <p className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(stats.balance)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Current balance</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">💰</span>
            </div>
          </div>
        </div>

        <div className="card group">
          <div className="flex-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Income</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(stats.totalIncome)}
              </p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">📈</span>
            </div>
          </div>
        </div>

        <div className="card group">
          <div className="flex-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(stats.totalExpenses)}
              </p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">📉</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-2 mb-8">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">📊</span>
              </span>
              Income vs Expenses
            </h3>
          </div>
          <div style={{ height: '320px' }}>
            <Bar data={incomeExpenseChartData} options={chartOptions} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <span className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">🥧</span>
              </span>
              Expenses by Category
            </h3>
          </div>
          <div style={{ height: '320px' }}>
            <Pie data={categoryChartData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="card mb-8">
        <div className="card-header">
          <h3 className="card-title flex items-center">
            <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm">📈</span>
            </span>
            Income & Expenses Trend
          </h3>
        </div>
        <div style={{ height: '320px' }}>
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">💰</span>
              </span>
              Recent Income
            </h3>
          </div>
          <div className="space-y-3">
            {stats.recentIncomes.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-gray-400">💰</span>
                </div>
                <p className="text-gray-500">No recent income records</p>
              </div>
            ) : (
              stats.recentIncomes.map((income) => (
                <div key={income._id} className="flex-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 group">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                      <span className="text-white text-sm">💰</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{income.title}</p>
                      <p className="text-sm text-gray-500">{formatDate(income.date)}</p>
                    </div>
                  </div>
                  <p className="font-bold text-green-600 text-lg">
                    +{formatCurrency(income.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <span className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">💸</span>
              </span>
              Recent Expenses
            </h3>
          </div>
          <div className="space-y-3">
            {stats.recentExpenses.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-gray-400">💸</span>
                </div>
                <p className="text-gray-500">No recent expense records</p>
              </div>
            ) : (
              stats.recentExpenses.map((expense) => (
                <div key={expense._id} className="flex-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl hover:from-red-100 hover:to-pink-100 transition-all duration-200 group">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                      <span className="text-white text-sm">💸</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{expense.title}</p>
                      <p className="text-sm text-gray-500">
                        {expense.category} • {formatDate(expense.date)}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-red-600 text-lg">
                    -{formatCurrency(expense.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
