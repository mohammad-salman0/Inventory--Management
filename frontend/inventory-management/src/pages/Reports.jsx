// src/pages/Reports.jsx
import React, { useState, useEffect } from 'react';

const Reports = () => {
  const token = localStorage.getItem('token');
  const [reportType, setReportType] = useState('daily');
  const [date, setDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!date) return;
    fetch(`http://localhost:4000/sales/report?type=${reportType}&date=${date}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setReportData(data.data);
          setMsg('');
        } else {
          setMsg('Failed to fetch report');
        }
      })
      .catch(() => setMsg('Server error fetching report'));
  }, [reportType, date, token]);

  const handleExport = async (format) => {
    if (!date) {
      alert('Please select a date first');
      return;
    }
    try {
      const response = await fetch(`http://localhost:4000/sales/export/${format}?type=${reportType}&date=${date}`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sales_report_${reportType}_${date}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export report');
    }
  };

  return (
    <div>
      <h2>Sales Reports</h2>
      <div>
        <label>
          Report Type:
          <select value={reportType} onChange={e => setReportType(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
        <label style={{ marginLeft: 20 }}>
          Date:
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
      </div>

      {msg && <p>{msg}</p>}

      <button onClick={() => handleExport('csv')} style={{ marginRight: 10, marginTop: 10 }}>Export CSV</button>
      <button onClick={() => handleExport('pdf')} style={{ marginTop: 10 }}>Export PDF</button>

      {reportData.length === 0 ? <p>No data available</p> : (
        <table border="1" cellPadding="6" cellSpacing="0" style={{ marginTop: 20, width: '100%' }}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map(sale => (
              <tr key={sale._id}>
                <td>{sale.productName}</td>
                <td>{sale.quantity}</td>
                <td>{sale.totalPrice.toFixed(2)}</td>
                <td>{new Date(sale.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reports;
