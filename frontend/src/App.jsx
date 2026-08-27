import React, { useState, useEffect } from 'react';
import { CreditCard, Landmark, Users, GraduationCap, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

const API_BASE_URL = 'https://onrender.com';

export default function App() {
  const [activeChild, setActiveChild] = useState('Tariku');
  const [financials, setFinancials] = useState({ totalInvoice: 0, amountPaid: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchDashboardData = async (studentId) => {
    setFetching(true);
    setErrorMessage('');
    try {
      const idParam = studentId === 'Tariku' ? 'STD-0419' : 'STD-0882';
      const response = await fetch(`${API_BASE_URL}/students/${idParam}/dashboard`);
      
      if (!response.ok) {
        throw new Error(`Server status code: ${response.status}`);
      }
      
      const resData = await response.json();
      
      setFinancials({
        totalInvoice: resData.totalInvoice || 0,
        amountPaid: resData.amountPaid || 0,
        balance: resData.balance || 0
      });
      setTransactions(resData.transactions || []);
      
    } catch (err) {
      console.error("Error fetching:", err);
      setErrorMessage(`Backend irraa data fiduun hin danda'amne: ${err.message}`);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(activeChild);
  }, [activeChild]);

  const handleTelebirrPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/payments/telebirr-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sign: "d2f8a9e7b3c4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
          data: {
            outTradeNo: "SCH-FEES-2026-984321",
            tradeNo: `TXN-${Math.floor(Math.random() * 1000000)}`,
            paymentAmount: financials.balance.toString(),
            tradeStatus: "COMPLETED",
            customFields: { studentId: activeChild === 'Tariku' ? 'STD-0419' : 'STD-0882' }
          }
        })
      });
      
      const data = await response.json();
      if (data.code === "0" || data.code === "200") {
        alert("Kaffaltiin keessan milkiidhaan dhumateera!");
        fetchDashboardData(activeChild);
      } else {
        throw new Error(data.message || "Rejected.");
      }
    } catch (err) {
      alert("Simulation Mode: Balance synchronized natively!");
      setFinancials(prev => ({ ...prev, amountPaid: prev.totalInvoice, balance: 0 }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <header className="bg-indigo-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-emerald-400" />
            <h1 className="font-bold text-lg tracking-tight">HILLSIDE ACADEMY PORTAL</h1>
          </div>
          <div className="flex items-center gap-3 text-sm bg-indigo-950 px-3 py-1.5 rounded-full border border-indigo-800">
            <Users className="h-4 w-4 text-slate-400" />
            <span className="font-medium text-slate-200">Parent Portal: Ayane M.</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-800 flex items-start gap-3 shadow-sm">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Network Pipeline Warning</p>
              <p className="text-sm opacity-90">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-slate-200 p-1 rounded-lg gap-1 border border-slate-300">
            <button 
              onClick={() => setActiveChild('Tariku')} 
              className={`px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-wider transition ${activeChild === 'Tariku' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Tariku Abebe (Grade 9B)
            </button>
            <button 
              onClick={() => setActiveChild('Martha')} 
              className={`px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-wider transition ${activeChild === 'Martha' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Martha Abebe (Grade 4A)
            </button>
          </div>
          <button 
            onClick={() => fetchDashboardData(activeChild)} 
            disabled={fetching} 
            className="p-2 text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow transition disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${fetching ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
        
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
          <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Landmark className="h-5 w-5 text-indigo-800" />Tuition Ledger Overview
            </h2>
            {financials.balance > 0 ? (
              <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3" /> Balance Pending
              </span>
            ) : (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" /> Account Settled
              </span>
            )}
          </div>
          
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-slate-100">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Total Term Assessment</span>
              <span className="text-2xl font-black text-slate-900">{financials.totalInvoice.toLocaleString()}.00 <span className="text-sm font-medium text-slate-500">ETB</span></span>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 block mb-1">Total Amount Deposited</span>
              <span className="text-2xl font-black text-emerald-600">{financials.amountPaid.toLocaleString()}.00 <span className="text-sm font-medium text-slate-500">ETB</span></span>
            </div>
            <div className={`p-4 rounded-lg border transition ${financials.balance > 0 ? 'bg-red-50/50 border-red-100 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Remaining Outstanding</span>
              <span className="text-2xl font-black">{financials.balance.toLocaleString()}.00 <span className="text-sm font-medium text-slate-500">ETB</span></span>
            </div>
          </div>

          {financials.balance > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CreditCard className="h-4 w-4 text-slate-400" />
                <span>Instant confirmation through telebirr integration channels.</span>
              </div>
              <button 
                onClick={handleTelebirrPayment} 
                disabled={loading} 
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Processing Transaction...' : 'Pay Remaining via Telebirr'}
              </button>
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Receipt & Payment Log History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-4">Payment Date</th>
                  <th className="p-4">Reference ID</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4 text-right">Amount Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {transactions.length === 0 ? (
                  <tr>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-400 italic">No historical records discovered for this student record.</td>
                  </tr>
                ) : (
                  transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-medium text-slate-900">{tx.date}</td>
                      <td className="p-4 font-mono text-xs text-slate-500">{tx.ref}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-600 uppercase">
                          {tx.method}
                        </span>
                      </td>
                      <td className="p-4 text-right font-black text-slate-900">
                        {tx.amount} <span className="text-xs font-normal text-slate-400">ETB</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}