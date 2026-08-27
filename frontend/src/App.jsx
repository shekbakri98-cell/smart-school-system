import React, { useState, useEffect } from 'react';
import { CreditCard, Landmark, Users, GraduationCap, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import TeacherDashboard from './TeacherDashboard'; // Teacher Dashboard dabalataan waamuu

const API_BASE_URL = 'https://onrender.com';

export default function App() {
  const [view, setView] = useState('parent'); // Switch gochuuf: 'parent' ykn 'teacher'
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
      if (!response.ok) throw new Error(`Server returned error status: ${response.status}`);
      const resData = await response.json();
      
      setFinancials({
        totalInvoice: resData.totalInvoice || 0,
        amountPaid: resData.amountPaid || 0,
        balance: resData.balance || 0
      });
      setTransactions(resData.transactions || []);
    } catch (err) {
      setErrorMessage(`Backend irraa data fiduun hin danda'amne: ${err.message}`);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (view === 'parent') fetchDashboardData(activeChild);
  }, [activeChild, view]);

  const handleTelebirrPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/payments/telebirr-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            paymentAmount: financials.balance.toString(),
            tradeNo: `TXN-${Math.floor(Math.random() * 1000000)}`,
            customFields: { studentId: activeChild === 'Tariku' ? 'STD-0419' : 'STD-0882' }
          }
        })
      });
      const data = await response.json();
      if (data.code === "200") {
        alert("Kaffaltiin keessan Telebirr kanaan milkiidhaan dhumateera!");
        fetchDashboardData(activeChild);
      }
    } catch (err) {
      alert("Erroo kaffaltii uumameera.");
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
          <div className="flex gap-2 bg-indigo-950 p-1 rounded border border-indigo-800 text-xs">
            <button onClick={() => setView('parent')} className={`px-3 py-1 rounded transition ${view === 'parent' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}>Parent Portal</button>
            <button onClick={() => setView('teacher')} className={`px-3 py-1 rounded transition ${view === 'teacher' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}>Teacher Dashboard</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {view === 'teacher' ? (
          <TeacherDashboard />
        ) : (
          <>
            {errorMessage && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 text-sm font-semibold rounded shadow-sm">{errorMessage}</div>}
            <div className="flex items-center justify-between mb-6">
              <div className="flex bg-slate-200 p-1 rounded-lg gap-1 border border-slate-300">
                <button onClick={() => setActiveChild('Tariku')} className={`px-4 py-2 rounded-md font-semibold text-xs uppercase transition ${activeChild === 'Tariku' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-600'}`}>Tariku Abebe</button>
                <button onClick={() => setActiveChild('Martha')} className={`px-4 py-2 rounded-md font-semibold text-xs uppercase transition ${activeChild === 'Martha' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-600'}`}>Martha Abebe</button>
              </div>
              <button onClick={() => fetchDashboardData(activeChild)} disabled={fetching} className="p-2 bg-white border rounded-lg shadow-sm hover:text-indigo-600"><RefreshCw className={`h-4 w-4 ${fetching ? 'animate-spin' : ''}`} /></button>
            </div>

            <section className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
              <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2"><Landmark className="h-5 w-5 text-indigo-800" />Tuition Ledger Overview</h2>
                {financials.balance > 0 ? <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold rounded-full">Balance Pending</span> : <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-full">Account Settled</span>}
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-slate-100">
                <div className="bg-slate-50 p-4 rounded-lg border">Total: {financials.totalInvoice.toLocaleString()} ETB</div>
                <div className="bg-emerald-50/50 p-4 rounded-lg border text-emerald-600">Paid: {financials.amountPaid.toLocaleString()} ETB</div>
                <div className={`p-4 rounded-lg border ${financials.balance > 0 ? 'bg-red-50 text-red-600 font-bold' : 'bg-slate-50 text-slate-400'}`}>Remaining: {financials.balance.toLocaleString()} ETB</div>
              </div>
              {financials.balance > 0 && (
                <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
                  <span className="text-xs text-slate-500 flex items-center gap-1"><CreditCard className="h-4 w-4" /> Instant confirmation via telebirr.</span>
                  <button onClick={handleTelebirrPayment} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2 rounded-lg transition">{loading ? 'Processing...' : 'Pay via Telebirr'}</button>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
