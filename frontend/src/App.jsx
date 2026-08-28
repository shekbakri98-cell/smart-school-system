import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Landmark, Users, GraduationCap, CheckCircle2, 
  AlertTriangle, RefreshCw, LayoutDashboard, FileText, 
  Settings as SettingsIcon, Phone, Mail, Save, Edit3, 
  UserCheck, ShieldAlert, Calendar, ClipboardCheck, UserPlus, 
  Download, FileSpreadsheet
} from 'lucide-react';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/v1'
  : 'https://smart-school-system-gdk5.onrender.com/api/v1';

export default function App() {
  const [userRole, setUserRole] = useState('teacher'); // 'parent' ykn 'teacher'
  const [currentTab, setCurrentTab] = useState('Grade Entry Grid');
  const [activeChild, setActiveChild] = useState('Tariku');
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);

  // Financial Variables
  const [financials, setFinancials] = useState({ totalInvoice: 45000, amountPaid: 26500, balance: 18500 });
  const [transactions, setTransactions] = useState([
    { date: 'Aug 25, 2026', ref: '9FL5XYZ7820', amount: '18,500.00', status: 'SUCCESS' },
    { date: 'Jan 14, 2026', ref: '9BF2AAA1450', amount: '20,000.00', status: 'SUCCESS' }
  ]);

  // Student Profiles Matrix
  const [students, setStudents] = useState([
    { id: 1, name: 'Tariku Abebe', grade: 'Grade 9B', ca1: 18, exam: 65, attendance: 'Present' },
    { id: 2, name: 'Martha Abebe', grade: 'Grade 4A', ca1: 19, exam: 76, attendance: 'Present' }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [scores, setScores] = useState({ ca1: '', exam: '' });
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('');
  const fetchDashboardData = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${API_BASE_URL}/students`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) setStudents(data);
      }
    } catch (err) {
      console.log("Safe state pipeline mapping.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleSaveScore = async (id) => {
    const updatedStudent = students.find(s => s.id === id);
    const finalCA = parseFloat(scores.ca1) || updatedStudent.ca1;
    const finalExam = parseFloat(scores.exam) || updatedStudent.exam;

    try {
      await fetch(`${API_BASE_URL}/grades/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: id, ca1: finalCA, exam: finalExam })
      });
      setStudents(students.map(s => s.id === id ? { ...s, ca1: finalCA, exam: finalExam } : s));
      setEditingId(null);
      alert("🚀 Secure Hook: Saved to AlwaysData MySQL!");
    } catch (err) {
      setStudents(students.map(s => s.id === id ? { ...s, ca1: finalCA, exam: finalExam } : s));
      setEditingId(null);
    }
  };

  const toggleAttendance = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, attendance: s.attendance === 'Present' ? 'Absent' : 'Present' } : s));
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col justify-between">
      <div>
        <header className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white shadow-xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-7 w-7 text-emerald-400" />
              <div>
                <h1 className="font-black text-xl tracking-wider">HILLSIDE ACADEMY</h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-0.5">Latest Smart Education Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  const role = userRole === 'parent' ? 'teacher' : 'parent';
                  setUserRole(role);
                  setCurrentTab(role === 'parent' ? 'Dashboard' : 'Grade Entry Grid');
                }} 
                className="text-xs bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95"
              >
                🔄 Switch to {userRole === 'parent' ? 'Teacher' : 'Parent'} Portal
              </button>
              <div className="text-sm font-semibold bg-indigo-950/80 px-4 py-2 rounded-xl border border-indigo-800 text-slate-300 text-xs font-mono">
                {userRole === 'parent' ? 'Parent: Ayane M.' : 'Teacher: Alex M.'}
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-950/40 border-t border-indigo-900/50">
            <div className="max-w-6xl mx-auto flex overflow-x-auto px-2">
              {(userRole === 'parent' 
                ? ['Dashboard', 'Academic Report', 'Fees & Payments']
                : ['Grade Entry Grid', 'Attendance Tracker', 'Add New Student']
              ).map(tabName => (
                <button
                  key={tabName}
                  onClick={() => setCurrentTab(tabName)}
                  className={`px-6 py-4 text-xs uppercase tracking-widest font-black flex items-center gap-2.5 whitespace-nowrap transition-all border-b-2 ${currentTab === tabName ? 'border-emerald-400 text-emerald-400 bg-indigo-900/20' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                  {tabName}
                </button>
              ))}
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
          {userRole === 'teacher' && currentTab === 'Add New Student' && (
            <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
              <h2 className="text-lg font-black text-slate-900 mb-4">New Student Registration</h2>
              <form onSubmit={fetchDashboardData} className="space-y-4">
                <input type="text" placeholder="Full Name" required value={newStudentName} onChange={e => setNewStudentName(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none bg-slate-50"/>
                <input type="text" placeholder="Grade level" required value={newStudentGrade} onChange={e => setNewStudentGrade(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none bg-slate-50"/>
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest">Save Student</button>
              </form>
            </div>
          )}

          {userRole === 'teacher' && currentTab === 'Attendance Tracker' && (
            <div className="bg-white rounded-2xl border overflow-hidden shadow-xl">
              <div className="p-5 bg-slate-900 text-white font-bold text-sm">📅 Daily Attendance Ledger Roll</div>
              <table className="w-full text-left border-collapse text-sm">
                <tbody className="divide-y font-medium text-slate-700">
                  {students.map(s => (
                    <tr key={s.id}>
                      <td className="p-4 font-bold text-slate-900">{s.name} ({s.grade})</td>
                      <td className="p-4 text-center">
                        <button onClick={() => toggleAttendance(s.id)} className={`px-4 py-1.5 rounded-xl text-xs font-black ${s.attendance === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>{s.attendance === 'Present' ? '✓ PRESENT' : '✗ ABSENT'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {userRole === 'teacher' && currentTab === 'Grade Entry Grid' && (
            <div className="bg-white rounded-2xl border overflow-hidden shadow-xl">
              <div className="p-5 bg-slate-950 text-white font-bold text-sm">👨‍🏫 CA Evaluation Framework</div>
              <table className="w-full text-left border-collapse text-sm">
                <tbody className="divide-y font-mono text-xs">
                  {students.map(s => (
                    <tr key={s.id}>
                      <td className="p-4 font-sans font-bold text-slate-900">{s.name}</td>
                      <td className="p-4">{editingId === s.id ? <input type="number" className="w-16 border rounded p-1" value={scores.ca1} onChange={e=>setScores({...scores, ca1: e.target.value})} /> : s.ca1}</td>
                      <td className="p-4">{editingId === s.id ? <input type="number" className="w-16 border rounded p-1" value={scores.exam} onChange={e=>setScores({...scores, exam: e.target.value})} /> : s.exam}</td>
                      <td className="p-4 text-center">
                        {editingId === s.id ? <button onClick={() => handleSaveScore(s.id)} className="bg-indigo-600 text-white px-3 py-1 rounded">Save</button> : <button onClick={() => { setEditingId(s.id); setScores({ ca1: s.ca1, exam: s.exam }); }} className="border px-3 py-1 rounded">Modify</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {userRole === 'parent' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border flex justify-between items-center shadow-sm">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Assalamuu Alaykum, Ayane M.</h2>
                  <p className="text-xs text-slate-400 mt-1">Latest academic tracking state.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActiveChild('Tariku')} className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-wide border ${activeChild === 'Tariku' ? 'bg-indigo-900 text-white' : 'bg-white text-slate-600'}`}>Tariku Abebe</button>
                  <button onClick={() => setActiveChild('Martha')} className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-wide border ${activeChild === 'Martha' ? 'bg-indigo-900 text-white' : 'bg-white text-slate-600'}`}>Martha Abebe</button>
                </div>
              </div>

              {currentTab === 'Academic Report' && (
                <div className="bg-white rounded-2xl border shadow-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm uppercase text-slate-700">Academic Transcript Card</h3>
                    <button 
                      onClick={() => alert(`Report Card Blueprint Generated for ${activeChild} Abebe.`)}
                      className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Download className="h-3.5 w-3.5" /> Export Report as PDF
                    </button>
                  </div>
                  <table className="w-full text-left border-collapse text-sm font-mono text-xs">
                    <tbody className="divide-y text-slate-700">
                      {students.filter(s => s.name.includes(activeChild)).map((s, idx) => (
                        <tr key={idx}>
                          <td className="p-4 font-sans font-bold text-slate-900">General Core Framework</td>
                          <td className="p-4">CA: {s.ca1} / 20</td><td className="p-4">Exam: {s.exam} / 80</td>
                          <td className="p-4 font-sans font-black text-indigo-600">Total: {s.ca1 + s.exam} / 100</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {currentTab === 'Fees & Payments' && (
                <div className="bg-white rounded-2xl border p-6 shadow-sm">
                  <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-4">Invoice Standings</h3>
                  <div className="grid grid-cols-3 gap-4 text-center font-mono text-xs">
                    <div className="bg-slate-50 p-4 rounded-xl">Invoice: {financials.totalInvoice}</div>
                    <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl font-bold">Paid: {financials.amountPaid}</div>
                    <div className="bg-rose-50 text-rose-800 p-4 rounded-xl font-bold">Remaining: {financials.balance}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <footer className="bg-slate-900 text-slate-400 text-xs py-5 px-6 border-t border-slate-800 flex justify-between">
        <div>Helpline: +251-11-XXXXXXX</div><div>Support: support@school.edu.et</div>
      </footer>
    </div>
  );
}
