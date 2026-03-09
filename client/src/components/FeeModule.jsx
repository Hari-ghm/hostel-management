import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, CreditCard, CheckCircle } from 'lucide-react';

export default function FeeModule() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getFees();
      setFees(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handlePay = async (id) => {
    if (!window.confirm("Mark this fee as Paid?")) return;
    try {
      await api.payFee(id);
      loadData();
    } catch (e) {
      alert("Error marking fee as paid. " + e.message);
    }
  };

  const downloadInvoice = (f) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241); // Primary color
    doc.text('HOSTELNOVA INVOICE', 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text(`Invoice ID: ${f._id}`, 14, 30);
    doc.text(`Date Issued: ${formatDate(f.createdAt)}`, 14, 36);
    doc.text(`Status: ${f.status.toUpperCase()}`, 14, 42);

    autoTable(doc, {
      startY: 50,
      head: [['Description', 'Due Date', 'Total Amount', 'Paid Amount']],
      body: [
        [f.feeType, formatDate(f.dueDate), `$${f.amount}`, `$${f.amountPaid || 0}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] }
    });

    if (f.status === 'Paid') {
      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129); // Success color
      doc.text('PAYMENT RECEIVED IN FULL - THANK YOU', 14, doc.lastAutoTable.finalY + 20);
    } else {
      doc.setFontSize(14);
      doc.setTextColor(239, 68, 68); // Error color
      doc.text(`PAYMENT DUE: $${f.amount - (f.amountPaid || 0)}`, 14, doc.lastAutoTable.finalY + 20);
    }

    doc.save(`Invoice_${f._id}.pdf`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Fee & Invoice Management</h2>
        <button className="btn-primary" onClick={loadData}>Refresh Data</button>
      </div>

      {loading ? <p>Loading fees...</p> : (
        <div style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-light)' }}>
          {fees.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No fee records found.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Type</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Amount</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Due Date</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f._id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px', color: 'var(--text-main)', fontWeight: '500' }}>
                      {f.feeType}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>₹{f.amount?.toLocaleString()}</div>
                      {f.amountPaid > 0 && <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Paid: ₹{f.amountPaid.toLocaleString()}</div>}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                      {formatDate(f.dueDate)}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span className={`badge ${f.status === 'Paid' ? 'badge-success' : f.status === 'Unpaid' ? 'badge-error' : 'badge-warning'}`}>
                        {f.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                         {f.status !== 'Paid' && (
                           <button onClick={() => handlePay(f._id)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                             <CreditCard size={14} /> Pay Now
                           </button>
                         )}
                         <button onClick={() => downloadInvoice(f)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                           <Download size={14} /> Invoice
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
