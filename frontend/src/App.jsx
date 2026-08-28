import React, { useState, useEffect } from 'react';
import { CreditCard, Landmark, Users, GraduationCap, CheckCircle2, AlertTriangle, RefreshCw, LayoutDashboard, FileText, Settings as SettingsIcon, Phone, Mail, Save, Edit3, UserCheck, ShieldAlert, Languages } from 'lucide-react';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/v1'
  : 'https://smart-school-system-gdk5.onrender.com/api/v1';

export default function App() {
  const [userRole, setUserRole] = useState('parent'); // 'parent' ykn 'teacher'
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [activeChild, setActiveChild] = useState('Tariku');
  const [financials, setFinancials] = useState({ totalInvoice: 45000, amountPaid: 26500, balance: 18500 });
  const [transactions, setTransactions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);

  // Settings System States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lang, setLang] = useState('om');
  const [settingsMessage, setSettingsMessage] = useState('');

  // Academic Matrix Models
  const [students, setStudents] = useState([
    { id: 1, name: 'Tariku Abebe', grade: 'Grade 9B', ca1: 18, exam: 65 },
    { id: 2, name: 'Martha Abebe', grade: 'Grade 4A', ca1: 19, exam: 76 }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [scores, setScores] = useState({ ca1: '', exam: '' });
  const fetchDashboardData = async (studentId) => {
    setFetching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      if (studentId === 'Tariku') {
        setFinancials({ totalInvoice: 45000, amountPaid: 26500, balance: 18500 });
        setTransactions([
          { date: 'Aug 25, 2026', ref: '9FL5XYZ7820', amount: '18,500.00', status: 'SUCCESS' },
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

  const handleSaveScore = (id) => {
    setStudents(students.map(s => s.id === id ? {
      ...s,
      ca1: parseFloat(scores.ca1) || 0,
      exam: parseFloat(scores.exam) || 0
    } : s));
    setEditingId(null);
    alert("Qabxiin barataa database irratti sirriitti ol-kaayameera!");
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
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased flex flex-col justify-between font-sans">
      <div>
        <header className="bg-indigo-900 text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-emerald-400" />
              <h1 className="font-extrabold text-lg tracking-wider">🏢 HILLSIDE ACADEMY PORTAL</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setUserRole(userRole === 'parent' ? 'teacher' : 'parent')} 
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-md font-bold transition"
              >
                🔄 Switch to {userRole === 'parent' ? 'Teacher' : 'Parent'} View
              </button>
              <div className="text-sm font-medium bg-indigo-950 px-4 py-1.5 rounded-full border border-indigo-800 flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" /> {userRole === 'parent' ? 'Parent: Ayane M.' : 'Teacher: Alex M.'}
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-950 border-t border-indigo-800/60">
            <div className="max-w-5xl mx-auto flex overflow-x-auto">
              {(userRole === 'parent' 
                ? ['Dashboard', 'Academic Report', 'Fees & Payments', 'Settings']
                : ['Dashboard', 'Grade Entry Grid', 'Settings']
              ).map(tabName => (
                <button
                  key={tabName}
                  onClick={() => setCurrentTab(tabName)}
                  className={`px-5 py-3 text-xs uppercase tracking-wider font-bold border-b-2 font-mono flex items-center gap-2 whitespace-nowrap transition ${currentTab === tabName ? 'border-emerald-400 text-emerald-400 bg-indigo-900/40' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                  {tabName === 'Dashboard' && <LayoutDashboard className="h-3.5 w-3.5" />}
                  {tabName === 'Academic Report' && <FileText className="h-3.5 w-3.5" />}
                  {tabName === 'Grade Entry Grid' && <UserCheck className="h-3.5 w-3.5" />}
                  {tabName === 'Fees & Payments' && <CreditCard className="h-3.5 w-3.5" />}
                  {tabName === 'Settings' && <SettingsIcon className="h-3.5 w-3.5" />}
                  {tabName}
                </button>
              ))}
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          {userRole === 'parent' && (
            <>
              <div className="mb-6 p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">Student Context</span>
                  <div className="flex gap-2">
                    <button onClick={() => setActiveChild('Tariku')} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition ${activeChild === 'Tariku' ? 'bg-indigo-900 text-white' : 'bg-white text-slate-600'}`}>Tariku Abebe (9B)</button>
                    <button onClick={() => setActiveChild('Martha')} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition ${activeChild === 'Martha' ? 'bg-indigo-900 text-white' : 'bg-white text-slate-600'}`}>Martha Abebe (4A)</button>
                  </div>
                </div>
              </div>

              {currentTab === 'Dashboard' && (
                <div className="bg-white p-6 rounded-xl border">
                  <h2 className="text-xl font-bold text-slate-800">Assalamuu Alaykum, Ayane!</h2>
                  <p className="text-sm text-slate-500 mt-1">Hillside Academy accounts performance grid tracker.</p>
                </div>
              )}

              {currentTab === 'Academic Report' && (
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="p-4 bg-slate-900 text-white font-bold text-sm">Continuous Assessment Report ({activeChild} Abebe)</div>
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b text-slate-500 text-xs uppercase font-bold">
                        <th className="p-4">Subject</th><th className="p-4">CA (20%)</th><th className="p-4">Exam (80%)</th><th className="p-4">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-xs font-mono">
                      {students.filter(s => s.name.includes(activeChild)).map((s, idx) => (
                        <tr key={idx}>
                          <td className="p-4 font-sans font-semibold text-slate-900">General Curriculum Matrix</td>
                          <td className="p-4">{s.ca1} / 20</td><td className="p-4">{s.exam} / 80</td>
                          <td className="p-4 font-bold text-indigo-900">{s.ca1 + s.exam} / 100</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {currentTab === 'Fees & Payments' && (
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-bold text-slate-700 mb-4">Tuition Financial Summary</h3>
                  <div className="grid grid-cols-3 gap-4 text-center font-mono">
                    <div className="bg-slate-50 p-3 rounded">Invoice: {financials.totalInvoice} ETB</div>
                    <div className="bg-emerald-50 text-emerald-800 p-3 rounded">Paid: {financials.amountPaid} ETB</div>
                    <div className="bg-red-50 text-red-800 p-3 rounded">Remaining: {financials.balance} ETB</div>
                  </div>
                </div>
              )}
            </>
          )}

          {userRole === 'teacher' && (
            <>
              {currentTab === 'Dashboard' && (
                <div className="bg-white p-6 rounded-xl border">
                  <h2 className="text-xl font-bold text-slate-800">Welcome, Teacher Alex Mercer!</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage continuous assessment grades and classroom metrics seamlessly.</p>
                </div>
              )}

              {currentTab === 'Grade Entry Grid' && (
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="p-4 bg-slate-950 text-white font-bold text-sm">👨‍🏫 Continuous Assessment Editing Grid</div>
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b text-slate-500 text-xs uppercase font-bold">
                        <th className="p-4">Student Name</th><th className="p-4">CA (20%)</th><th className="p-4">Exam (80%)</th><th className="p-4">Total</th><th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-xs font-mono">
                      {students.map(s => (
                        <tr key={s.id}>
                          <td className="p-4 font-sans font-semibold text-slate-900">{s.name} ({s.grade})</td>
                          <td className="p-4">{editingId === s.id ? <input type="number" className="w-16 border rounded p-1" value={scores.ca1} onChange={e=>setScores({...scores, ca1: e.target.value})} /> : s.ca1}</td>
                          <td className="p-4">{editingId === s.id ? <input type="number" className="w-16 border rounded p-1" value={scores.exam} onChange={e=>setScores({...scores, exam: e.target.value})} /> : s.exam}</td>
                          <td className="p-4 font-bold text-indigo-900">{s.ca1 + s.exam} / 100</td>
                          <td className="p-4 text-center font-sans">
                            {editingId === s.id ? (
                              <button onClick={() => handleSaveScore(s.id)} className="bg-emerald-600 text-white px-3 py-1 rounded text-xs">Save</button>
                            ) : (
                              <button onClick={() => { setEditingId(s.id); setScores({ ca1: s.ca1, exam: s.exam }); }} className="border px-3 py-1 rounded text-xs hover:bg-slate-50">Edit</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {currentTab === 'Settings' && (
            <div className="max-w-2xl mx-auto space-y-4 bg-white p-6 rounded-xl border">
              <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Account Security</h3>
              {settingsMessage && <div className="bg-emerald-50 text-emerald-700 p-3 text-xs font-bold rounded-lg mb-4">{settingsMessage}</div>}
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <input type="password" placeholder="Current Password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs font-mono"/>
                <input type="password" placeholder="New Password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs font-mono"/>
                <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs font-mono"/>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"><Save className="h-3.5 w-3.5" /> Save Configuration</button>
              </form>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-slate-800 text-slate-400 text-xs py-4 px-6 border-t border-slate-700">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Helpline: +251-11-XXXXXXX</div>
          <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Support: support@school.edu.et</div>
        </div>
      </footer>
    </div>
  );
}
