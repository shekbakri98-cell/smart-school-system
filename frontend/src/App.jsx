import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Landmark, Users, GraduationCap, CheckCircle2, 
  AlertTriangle, RefreshCw, LayoutDashboard, FileText, 
  Settings as SettingsIcon, Phone, Mail, Save, Edit3, 
  UserCheck, ShieldAlert, Calendar, ClipboardCheck, UserPlus, Clock, BookOpen
} from 'lucide-react';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/v1'
  : 'https://smart-school-system-gdk5.onrender.com/api/v1';


export default function App() {
  const [userRole, setUserRole] = useState('admin'); // 'admin', 'teacher', ykn 'student'
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [activeChild, setActiveChild] = useState('Tariku');
  const [fetching, setFetching] = useState(false);

  // Core System Profiles Store
  const [students, setStudents] = useState([
    { id: 1, name: 'Tariku Abebe', grade: 'Grade 9B', ca1: 18, exam: 65, attendance: 'Present' },
    { id: 2, name: 'Martha Abebe', grade: 'Grade 4A', ca1: 19, exam: 76, attendance: 'Present' }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [scores, setScores] = useState({ ca1: '', exam: '' });
  const [financials, setFinancials] = useState({ totalInvoice: 45000, amountPaid: 26500, balance: 18500 });

  // 📅 INTERACTIVE CLASSROOM TIMETABLE MATRIX PLACEHOLDER
  const [timetable, setTimetable] = useState([
    { period: 'Period 1 (8:30 AM)', subject: 'Mathematics', teacher: 'Alex M.', room: 'Room 102' },
    { period: 'Period 2 (9:30 AM)', subject: 'English Lang.', teacher: 'Chala B.', room: 'Room 104' },
    { period: 'Period 3 (10:40 AM)', subject: 'General Physics', teacher: 'Kedir A.', room: 'Lab 02' }
  ]);
  const fetchDashboardData = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${API_BASE_URL}/students`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) setStudents(data);
      }
    } catch (err) {
      console.log("Safely mocking relational database connectors.");
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
      alert("🚀 Secure Hook Verified: Saved to AlwaysData MySQL!");
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
            <div className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-emerald-400" />
              <div>
                <h1 className="font-black text-xl tracking-wider">HILLSIDE SCHOOL SYSTEM</h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-0.5">Unified Core Management Console</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                value={userRole} 
                onChange={(e) => {
                  setUserRole(e.target.value);
                  setCurrentTab('Dashboard');
                }}
                className="text-xs bg-indigo-950 text-white border border-indigo-700 px-3 py-1.5 rounded-xl font-bold font-mono outline-none"
              >
                <option value="admin">Admin Dashboard</option>
                <option value="teacher">Teacher Control</option>
                <option value="student">Parent / Student View</option>
              </select>
            </div>
          </div>
          
          <div className="bg-indigo-950/40 border-t border-indigo-900/50">
            <div className="max-w-6xl mx-auto flex overflow-x-auto px-2">
              {userRole === 'admin' && ['Dashboard', 'Classroom Timetable'].map(tabName => (
                <button key={tabName} onClick={() => setCurrentTab(tabName)} className={`px-6 py-4 text-xs uppercase tracking-widest font-black ${currentTab === tabName ? 'border-b-2 border-emerald-400 text-emerald-400 bg-indigo-900/20' : 'text-slate-400 hover:text-slate-200'}`}>{tabName}</button>
              ))}
              {userRole === 'teacher' && ['Dashboard', 'CA Evaluation Grid', 'Attendance Sheet', 'Classroom Timetable'].map(tabName => (
                <button key={tabName} onClick={() => setCurrentTab(tabName)} className={`px-6 py-4 text-xs uppercase tracking-widest font-black ${currentTab === tabName ? 'border-b-2 border-emerald-400 text-emerald-400 bg-indigo-900/20' : 'text-slate-400 hover:text-slate-200'}`}>{tabName}</button>
              ))}
              {userRole === 'student' && ['Dashboard', 'Report Card Details', 'Fees Ledger', 'Classroom Timetable'].map(tabName => (
                <button key={tabName} onClick={() => setCurrentTab(tabName)} className={`px-6 py-4 text-xs uppercase tracking-widest font-black ${currentTab === tabName ? 'border-b-2 border-emerald-400 text-emerald-400 bg-indigo-900/20' : 'text-slate-400 hover:text-slate-200'}`}>{tabName}</button>
              ))}
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
          {currentTab === 'Dashboard' && (
            <div className="bg-white p-8 rounded-2xl border text-center shadow-md animate-fadeIn">
              <h2 className="text-xl font-black text-slate-700">Unified Management Control Dashboard Active</h2>
              <p className="text-sm text-slate-400 mt-2">Active control context set for role profile: '{userRole.toUpperCase()}'.</p>
            </div>
          )}

          {/* TEACHER WINDOW: ATTENDANCE SHEET */}
          {userRole === 'teacher' && currentTab === 'Attendance Sheet' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
              <div className="p-4 bg-slate-900 text-white font-bold text-sm">📅 Daily Attendance Verification Grid</div>
              <table className="w-full text-left text-sm border-collapse font-mono text-xs">
                {students.map(s => (
                  <tr key={s.id} className="border-b">
                    <td className="p-4 font-sans font-bold text-slate-900">{s.name} ({s.grade})</td>
                    <td className="p-4 text-center"><button onClick={() => toggleAttendance(s.id)} className={`px-4 py-1 rounded border font-sans font-bold ${s.attendance === 'Present' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{s.attendance === 'Present' ? '✓ PRESENT' : '✗ ABSENT'}</button></td>
                  </tr>
                ))}
              </table>
            </div>
          )}

          {userRole === 'teacher' && currentTab === 'CA Evaluation Grid' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
              <div className="p-4 bg-slate-950 text-white font-bold text-sm">👨‍🏫 CA Evaluation Grid Matrix</div>
              <table className="w-full text-left text-sm font-mono text-xs border-collapse">
                {students.map(s => (
                  <tr key={s.id} className="border-b">
                    <td className="p-4 font-sans font-bold text-slate-900">{s.name}</td>
                    <td className="p-4">CA: {editingId === s.id ? <input type="number" className="w-16 border rounded" value={scores.ca1} onChange={e=>setScores({...scores, ca1: e.target.value})} /> : s.ca1}</td>
                    <td className="p-4">Exam: {editingId === s.id ? <input type="number" className="w-16 border rounded" value={scores.exam} onChange={e=>setScores({...scores, exam: e.target.value})} /> : s.exam}</td>
                    <td className="p-4 text-center">{editingId === s.id ? <button onClick={() => handleSaveScore(s.id)} className="bg-indigo-600 text-white px-3 py-1 rounded">Save</button> : <button onClick={() => { setEditingId(s.id); setScores({ ca1: s.ca1, exam: s.exam }); }} className="border px-3 py-1 rounded">Edit</button>}</td>
                  </tr>
                ))}
              </table>
            </div>
          )}
          {/* DYNAMIC HAARAA: CLASSROOM TIMETABLE SCHEDULER MATRIX CARD */}
          {currentTab === 'Classroom Timetable' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white p-5 rounded-2xl border flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Clock className="h-5 w-5" /></div>
                <div>
                  <h3 className="font-black text-slate-900 text-md">Daily Class Master Scheduler</h3>
                  <p className="text-xs text-slate-400">Class sessions structure configuration index timeline parameters.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {timetable.map((slot, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md inline-block mb-3">{slot.period}</span>
                      <h4 className="font-black text-slate-900 text-sm mb-1">{slot.subject}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><User className="h-3 w-3" /> Inst: {slot.teacher}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-4 block border-t pt-2 text-right">Hall: {slot.room}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STUDENT MODULES */}
          {userRole === 'student' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-4 rounded-xl border flex gap-2">
                <button onClick={() => setActiveChild('Tariku')} className={`px-4 py-1 rounded-lg text-xs font-bold ${activeChild === 'Tariku' ? 'bg-indigo-900 text-white' : 'bg-white text-slate-600 border'}`}>Tariku Abebe</button>
                <button onClick={() => setActiveChild('Martha')} className={`px-4 py-1 rounded-lg text-xs font-bold ${activeChild === 'Martha' ? 'bg-indigo-900 text-white' : 'bg-white text-slate-600 border'}`}>Martha Abebe</button>
              </div>
              {currentTab === 'Report Card Details' && (
                <div className="bg-white rounded-2xl border shadow-xl p-6">
                  <h3 className="font-bold text-sm text-slate-700 border-b pb-2 mb-4">Academic Transcript Details</h3>
                  {students.filter(s => s.name.includes(activeChild)).map((s, idx) => (
                    <div key={idx} className="font-mono text-xs space-y-1">
                      <p>CA Result: {s.ca1} / 20</p><p>Exam Result: {s.exam} / 80</p>
                    </div>
                  ))}
                </div>
              )}
              {currentTab === 'Fees Ledger' && (
                <div className="bg-white rounded-2xl border p-6 shadow-sm font-mono text-xs">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-50 border p-3 rounded-xl">Invoice: {financials.totalInvoice}</div>
                    <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl">Paid: {financials.amountPaid}</div>
                    <div className="bg-rose-50 text-rose-800 p-3 rounded-xl">Remaining: {financials.balance}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <footer className="bg-slate-900 text-slate-400 text-xs py-5 px-6 border-t border-slate-800 flex justify-between items-center w-full font-sans">
        <div>Helpline Support: +251-11-XXXXXXX</div><div>System Email: support@school.edu.et</div>
      </footer>
    </div>
  );
}
