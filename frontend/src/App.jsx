import React, { useState, useEffect } from 'react';
import { CreditCard, Landmark, Users, GraduationCap, CheckCircle2, AlertTriangle, RefreshCw, LayoutDashboard, FileText, Settings as SettingsIcon, Phone, Mail, Save, Edit3, UserCheck, ShieldAlert, Calendar, ClipboardCheck, UserPlus } from 'lucide-react';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/v1'
  : 'https://smart-school-system-gdk5.onrender.com/api/v1';

export default function App() {
  const [userRole, setUserRole] = useState('teacher'); // 'parent' ykn 'teacher'
  const [currentTab, setCurrentTab] = useState('Grade Entry Grid');
  const [activeChild, setActiveChild] = useState('Tariku');
  const [financials, setFinancials] = useState({ totalInvoice: 45000, amountPaid: 26500, balance: 18500 });
  const [transactions, setTransactions] = useState([]);
  const [fetching, setFetching] = useState(false);

  // Core System States
  const [students, setStudents] = useState([
    { id: 1, name: 'Tariku Abebe', grade: 'Grade 9B', ca1: 18, exam: 65, attendance: 'Present' },
    { id: 2, name: 'Martha Abebe', grade: 'Grade 4A', ca1: 19, exam: 76, attendance: 'Present' }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [scores, setScores] = useState({ ca1: '', exam: '' });

  // Add Student Form States
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
      console.log("Safely parsing backend state.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  // 📝 ADD STUDENT HOOK: Save a new profile to MySQL DB
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentName || !newStudentGrade) {
      alert("Maaloo maqaa fi kutaa guutumaatti guuti!");
      return;
    }

    const newStudent = {
      id: students.length + 1,
      name: newStudentName,
      grade: newStudentGrade,
      ca1: 0,
      exam: 0,
      attendance: 'Present'
    };

    try {
      await fetch(`${API_BASE_URL}/students/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
      setStudents([...students, newStudent]);
      setNewStudentName('');
      setNewStudentGrade('');
      alert("🚀 Barataan haaraa AlwaysData MySQL database irratti milkiidhaan galmaayeera!");
    } catch (err) {
      setStudents([...students, newStudent]);
      setNewStudentName('');
      setNewStudentGrade('');
      alert("Database offline jira, garuu frontend irratti dabalameera!");
    }
  };

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
      alert("Qabxiin barataa database irratti sirriitti ol-kaayameera!");
    } catch (err) {
      setStudents(students.map(s => s.id === id ? { ...s, ca1: finalCA, exam: finalExam } : s));
      setEditingId(null);
    }
  };

  const toggleAttendance = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, attendance: s.attendance === 'Present' ? 'Absent' : 'Present' } : s));
  };
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased flex flex-col justify-between">
      <div>
        <header className="bg-indigo-900 text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-emerald-400" />
              <h1 className="font-extrabold text-lg tracking-wider">🏢 HILLSIDE ACADEMY PORTAL</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  const role = userRole === 'parent' ? 'teacher' : 'parent';
                  setUserRole(role);
                  setCurrentTab(role === 'parent' ? 'Dashboard' : 'Grade Entry Grid');
                }} 
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
                ? ['Dashboard', 'Academic Report', 'Fees & Payments']
                : ['Grade Entry Grid', 'Attendance Tracker', 'Add New Student']
              ).map(tabName => (
                <button
                  key={tabName}
                  onClick={() => setCurrentTab(tabName)}
                  className={`px-5 py-3 text-xs uppercase tracking-wider font-bold border-b-2 font-mono flex items-center gap-2 whitespace-nowrap transition ${currentTab === tabName ? 'border-emerald-400 text-emerald-400 bg-indigo-900/40' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                  {tabName === 'Dashboard' && <LayoutDashboard className="h-3.5 w-3.5" />}
                  {tabName === 'Academic Report' && <FileText className="h-3.5 w-3.5" />}
                  {tabName === 'Grade Entry Grid' && <UserCheck className="h-3.5 w-3.5" />}
                  {tabName === 'Attendance Tracker' && <ClipboardCheck className="h-3.5 w-3.5" />}
                  {tabName === 'Add New Student' && <UserPlus className="h-3.5 w-3.5" />}
                  {tabName === 'Fees & Payments' && <CreditCard className="h-3.5 w-3.5" />}
                  {tabName}
                </button>
              ))}
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* TEACHER WINDOW: ADD NEW STUDENT */}
          {userRole === 'teacher' && currentTab === 'Add New Student' && (
            <div className="max-w-md mx-auto bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-600" /> Galmeessa Barataa Haaraa
              </h2>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Maqaa Guutuu</label>
                  <input type="text" required value={newStudentName} onChange={e => setNewStudentName(e.target.value)} placeholder="Fakkeenya: Chala Abebe" className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500"/>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Kutaa / Grade</label>
                  <input type="text" required value={newStudentGrade} onChange={e => setNewStudentGrade(e.target.value)} placeholder="Fakkeenya: Grade 9B" className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500"/>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition">
                  <Save className="h-4 w-4" /> Barataa Galmeessi
                </button>
              </form>
            </div>
          )}

          {/* TEACHER WINDOW: ATTENDANCE TRACKER */}
          {userRole === 'teacher' && currentTab === 'Attendance Tracker' && (
            <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-900 text-white font-bold text-sm">📅 Daily Attendance Verification Grid</div>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b text-slate-500 text-xs uppercase font-bold"><th className="p-4">Student Name</th><th className="p-4">Class Room</th><th className="p-4 text-center">Status Toggle</th></tr>
                </thead>
                <tbody className="divide-y text-xs font-mono">
                  {students.map(s => (
                    <tr key={s.id}>
                      <td className="p-4 font-sans font-semibold text-slate-900 text-sm">{s.name}</td>
                      <td className="p-4 font-sans text-slate-500">{s.grade}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => toggleAttendance(s.id)} className={`px-4 py-1.5 rounded-lg text-xs font-bold font-sans ${s.attendance === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{s.attendance === 'Present' ? '✓ Present' : '✗ Absent'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TEACHER WINDOW: GRADE ENTRY GRID */}
          {userRole === 'teacher' && currentTab === 'Grade Entry Grid' && (
            <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-950 text-white font-bold text-sm">👨‍🏫 Continuous Assessment Editing Grid</div>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b text-slate-500 text-xs uppercase font-bold"><th className="p-4">Student Name</th><th className="p-4">CA (20%)</th><th className="p-4">Exam (80%)</th><th className="p-4 text-center">Action</th></tr>
                </thead>
                <tbody className="divide-y text-xs font-mono">
                  {students.map(s => (
                    <tr key={s.id}>
                      <td className="p-4 font-sans font-semibold text-slate-900">{s.name} ({s.grade})</td>
                      <td className="p-4">{editingId === s.id ? <input type="number" className="w-16 border rounded p-1" value={scores.ca1} onChange={e=>setScores({...scores, ca1: e.target.value})} /> : s.ca1}</td>
                      <td className="p-4">{editingId === s.id ? <input type="number" className="w-16 border rounded p-1" value={scores.exam} onChange={e=>setScores({...scores, exam: e.target.value})} /> : s.exam}</td>
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

          {/* PARENT CHANNELS */}
          {userRole === 'parent' && (
            <div className="bg-white p-6 rounded-xl border text-center shadow-sm">
              <h2 className="text-xl font-bold text-slate-700">Parent Dashboard Active</h2>
              <p className="text-sm text-slate-400 mt-2">All school ledgers aligned with live student tracking states.</p>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-slate-800 text-slate-400 text-xs py-4 px-6 border-t border-slate-700">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>Helpline: +251-11-XXXXXXX</div><div>Support: support@school.edu.et</div>
        </div>
      </footer>
    </div>
  );
}
