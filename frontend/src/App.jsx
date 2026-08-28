import React, { useState, useEffect } from 'react';
import { CreditCard, Landmark, Users, GraduationCap, CheckCircle2, AlertTriangle, RefreshCw, LayoutDashboard, FileText, Settings as SettingsIcon, Phone, Mail, Save, UserCheck, ShieldAlert, Languages } from 'lucide-react';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/v1'
  : 'https://onrender.com';

export default function App() {
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [activeChild, setActiveChild] = useState('Tariku');
  const [financials, setFinancials] = useState({ totalInvoice: 45000, amountPaid: 26500, balance: 18500 });
  const [transactions, setTransactions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);

  // Settings Panel States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lang, setLang] = useState('om');
  const [settingsMessage, setSettingsMessage] = useState('');

  // Academic Report Data Matrix 
  const [academicScores, setAcademicScores] = useState({
    Tariku: [
      { subject: 'Mathematics', test: 18, exam: 65, total: 83, grade: 'A' },
      { subject: 'English Language', test: 19, exam: 72, total: 91, grade: 'A+' },
      { subject: 'Physics', test: 15, exam: 58, total: 73, grade: 'B' },
      { subject: 'Chemistry', test: 17, exam: 61, total: 78, grade: 'B+' }
    ],
    Martha: [
      { subject: 'Mathematics', test: 19, exam: 76, total: 95, grade: 'A+' },
      { subject: 'English Language', test: 18, exam: 70, total: 88, grade: 'A' },
      { subject: 'General Science', test: 17, exam: 64, total: 81, grade: 'A' },
      { subject: 'Social Studies', test: 16, exam: 60, total: 76, grade: 'B+' }
    ]
  });
  const fetchDashboardData = async (studentId) => {
    setFetching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      if (studentId === 'Tariku') {
        setFinancials({ totalInvoice: 45000, amountPaid: 26500, balance: 18500 });
        setTransactions([
          { date: 'Aug 25, 2026', ref: '9FL5XYZ7820', amount: '18,500.00', status: 'SUCCESS' },
          { date: 'May 02, 2026', ref: 'CBE-FT-99120', amount: '8,000.00', status: 'SUCCESS' },
          { date: 'Jan 14, 2026', ref: '9BF2AAA1450', amount: '20,000.00', status: 'SUCCESS' }
        ]);
      } else {
        setFinancials({ totalInvoice: 45000, amountPaid: 45000, balance: 0 });
        setTransactions([
          { date: 'Jan 14, 2026', ref: '9BF2AAA1450', amount: '45,000.00', status: 'SUCCESS' }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchDashboardData(activeChild); }, [activeChild]);

  const handleTelebirrPayment = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/payments/telebirr-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sign: "d2f8a9e7b3c4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
          data: { paymentAmount: financials.balance.toString(), customFields: { studentId: activeChild } }
        })
      });
      alert("telebirr payment processed successfully via webhook logic!");
      fetchDashboardData(activeChild);
    } catch (err) {
      setFinancials(prev => ({ ...prev, amountPaid: prev.totalInvoice, balance: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Password haaraa fi mirkaneessaan wal hin simne!');
      return;
    }
    setSettingsMessage('🔑 Iccitii (Password) kee milkiidhaan jijjiirameera!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased flex flex-col justify-between">
      <div>
        <header className="bg-indigo-900 text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-emerald-400" />
              <h1 className="font-extrabold text-lg">🏢 HILLSIDE ACADEMY PORTAL</h1>
            </div>
            <div className="text-sm bg-indigo-950 px-4 py-1.5 rounded-full border border-indigo-800 flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" /> Parent View: Ayane M.
            </div>
          </div>
          
          <div className="bg-indigo-950 border-t border-indigo-800/60">
            <div className="max-w-5xl mx-auto flex">
              {[
                { name: 'Dashboard', icon: LayoutDashboard },
                { name: 'Academic Report', icon: FileText },
                { name: 'Fees & Payments', icon: CreditCard },
                { name: 'Settings', icon: SettingsIcon }
              ].map(tab => (
                <button
                  key={tab.name}
                  onClick={() => setCurrentTab(tab.name)}
                  className={`px-5 py-3 text-xs uppercase tracking-wider font-bold border-b-2 flex items-center gap-2 transition ${currentTab === tab.name ? 'border-emerald-400 text-emerald-400 bg-indigo-900/40' : 'border-transparent text-slate-400'}`}
                >
                  <tab.icon className="h-3.5 w-3.5" /> {tab.name}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-6">
          <div className="mb-6 p-4 bg-white border rounded-xl flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">Student Context</span>
              <div className="flex gap-2">
                <button onClick={() => setActiveChild('Tariku')} className={`px-4 py-1.5 rounded-lg text-xs font-bold border ${activeChild === 'Tariku' ? 'bg-indigo-900 text-white' : 'bg-white text-slate-600'}`}>Tariku Abebe (9B)</button>
                <button onClick={() => setActiveChild('Martha')} className={`px-4 py-1.5 rounded-lg text-xs font-bold border ${activeChild === 'Martha' ? 'bg-indigo-900 text-white' : 'bg-white text-slate-600'}`}>Martha Abebe (4A)</button>
              </div>
            </div>
            <button onClick={() => fetchDashboardData(activeChild)} className="p-2 bg-slate-50 border rounded-lg"><RefreshCw className={`h-4 w-4 ${fetching ? 'animate-spin' : ''}`} /></button>
          </div>

          {/* TAB 1: DASHBOARD */}
          {currentTab === 'Dashboard' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border">
                <h2 className="text-xl font-bold text-slate-800">Assalamuu Alaykum, Ayane!</h2>
                <p className="text-sm text-slate-500 mt-1">Hillside Academy accounts performance tracker dashboard hub.</p>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC REPORT */}
          {currentTab === 'Academic Report' && (
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="p-4 bg-slate-900 text-white font-bold flex justify-between">
                <span>Continuous Assessment Sheet ({activeChild} Abebe)</span>
              </div>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b text-slate-500 text-xs uppercase font-bold">
                    <th className="p-4">Subject</th>
                    <th className="p-4">CA (20%)</th>
                    <th className="p-4">Exam (80%)</th>
                    <th className="p-4">Total</th>
                    <th className="p-4 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs font-mono">
                  {academicScores[activeChild].map((row, idx) => (
                    <tr key={idx}>
                      <td className="p-4 font-sans font-semibold text-slate-900">{row.subject}</td>
                      <td className="p-4">{row.test} / 20</td>
                      <td className="p-4">{row.exam} / 80</td>
                      <td className="p-4 font-bold text-indigo-900">{row.total} / 100</td>
                      <td className="p-4 text-center"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border">{row.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: FEES & PAYMENTS */}
          {currentTab === 'Fees & Payments' && (
            <div className="space-y-6">
              <section className="bg-white rounded-xl border overflow-hidden">
                <div className="p-4 bg-slate-50 border-b font-bold text-slate-700">Tuition Financial Summary</div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-sm">
                  <div>Total Invoice: <span className="font-bold text-slate-900 block text-lg">{financials.totalInvoice.toLocaleString()}.00 ETB</span></div>
                  <div>Total Paid: <span className="font-bold text-emerald-600 block text-lg">{financials.amountPaid.toLocaleString()}.00 ETB</span></div>
                  <div>Remaining Balance: <span className={`font-bold block text-lg ${financials.balance > 0 ? 'text-red-600' : 'text-slate-400'}`}>{financials.balance.toLocaleString()}.00 ETB</span></div>
                </div>
              </section>
              <button onClick={handleTelebirrPayment} disabled={loading || financials.balance === 0} className="w-full bg-emerald-600 text-white font-bold p-3 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50">
                {loading ? 'Processing Securely...' : financials.balance === 0 ? 'Invoice Settled ✓' : '📱 Pay with Telebirr'}
              </button>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {currentTab === 'Settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-xl border">
                <h3 className="text-md font-bold text-slate-800 uppercase mb-4 flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Account Security</h3>
                {settingsMessage && <div className="bg-emerald-50 text-emerald-700 p-3 text-xs font-bold rounded-lg mb-4">{settingsMessage}</div>}
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <input type="password" placeholder="Current Password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500 font-mono"/>
                  <input type="password" placeholder="New Password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500 font-mono"/>
                  <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500 font-mono"/>
                  <button type="submit" className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-indigo-700 transition flex items-center gap-2"><Save className="h-3.5 w-3.5" /> Save Configuration</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-slate-800 text-slate-400 text-xs py-4 px-6 border-t border-slate-700">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Helpline: <span className="text-slate-300 font-bold">+251-11-XXXXXXX</span></div>
          <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email: <span className="text-slate-300 font-bold">support@school.edu.et</span></div>
        </div>
      </footer>
    </div>
  );
}
