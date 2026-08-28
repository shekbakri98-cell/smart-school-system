import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Landmark, Users, GraduationCap, CheckCircle2, 
  AlertTriangle, RefreshCw, LayoutDashboard, FileText, 
  Settings as SettingsIcon, Phone, Mail, Save, Edit3, 
  UserCheck, ShieldAlert, UserPlus, Shield, UserX
} from 'lucide-react';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/v1'
  : 'https://smart-school-system-gdk5.onrender.com/api/v1';

export default function App() {
  const [userRole, setUserRole] = useState('admin'); // 'admin', 'teacher', ykn 'student'
  const [currentTab, setCurrentTab] = useState('Create User Accounts');
  const [fetching, setFetching] = useState(false);

  // User Accounts Database Store Placeholder
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Ayane M.', email: 'parent@school.com', role: 'parent', status: 'ACTIVE' },
    { id: 2, name: 'Alex Mercer', email: 'teacher@school.com', role: 'teacher', status: 'ACTIVE' },
    { id: 3, name: 'Admin Control', email: 'admin@school.com', role: 'admin', status: 'ACTIVE' }
  ]);

  // Form Fields Control
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('student'); // Default role configuration
  // 📝 ACCOUNT REGISTRATION HOOK: Save to MySQL DB
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      alert("Maaloo unkaalee hunda guutumaatti guuti!");
      return;
    }

    const newAccount = {
      id: accounts.length + 1,
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      status: 'ACTIVE'
    };

    try {
      await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount)
      });
      
      setAccounts([...accounts, newAccount]);
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      alert(`🚀 Herregni haaraa bifa '${regRole.toUpperCase()}' kanaan AlwaysData MySQL irratti uumameera!`);
    } catch (err) {
      setAccounts([...accounts, newAccount]);
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      alert("Database pipeline offline jira, garuu frontend irratti uumameera!");
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col justify-between">
      <div>
        {/* PORTAL TOP NAVIGATION */}
        <header className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white shadow-xl">
          <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-emerald-400" />
              <div>
                <h1 className="font-black text-xl tracking-wider">HILLSIDE ACADEMY</h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-0.5">Administrative Identity Access System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                value={userRole} 
                onChange={(e) => {
                  setUserRole(e.target.value);
                  setCurrentTab(e.target.value === 'admin' ? 'Create User Accounts' : 'Dashboard');
                }}
                className="text-xs bg-indigo-950 text-white border border-indigo-700 px-3 py-1.5 rounded-xl font-bold font-mono outline-none"
              >
                <option value="admin">System Admin View</option>
                <option value="teacher">Teacher View</option>
                <option value="student">Student View</option>
              </select>
            </div>
          </div>
          
          <div className="bg-indigo-950/40 border-t border-indigo-900/50">
            <div className="max-w-5xl mx-auto flex overflow-x-auto px-2">
              {(userRole === 'admin' 
                ? ['Create User Accounts', 'Identity Records Log']
                : ['Dashboard', 'Settings']
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
        <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
          {/* ADMIN TAB 1: CREATE USER ACCOUNTS */}
          {userRole === 'admin' && currentTab === 'Create User Accounts' && (
            <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-indigo-600" /> Account Creator Form
              </h2>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <input type="text" required value={regName} onChange={e => setRegName(e.target.value)} placeholder="User Full Name" className="w-full px-3 py-2 border rounded-xl text-xs outline-none bg-slate-50"/>
                <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="Email Address" className="w-full px-3 py-2 border rounded-xl text-xs outline-none bg-slate-50"/>
                <input type="password" required value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 border rounded-xl text-xs outline-none bg-slate-50"/>
                <select value={regRole} onChange={e => setRegRole(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs outline-none bg-white font-semibold">
                  <option value="student">Student Portal</option>
                  <option value="teacher">Teacher Portal</option>
                  <option value="admin">System Administrator</option>
                </select>
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-widest transition">Provision New Account</button>
              </form>
            </div>
          )}

          {/* ADMIN TAB 2: IDENTITY RECORDS LOG VIEW */}
          {userRole === 'admin' && currentTab === 'Identity Records Log' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
              <div className="p-5 bg-slate-950 text-white font-bold flex justify-between items-center">
                <span className="text-sm">📋 Full Master Directory (System Admin Records Log)</span>
                <span className="text-[10px] font-mono bg-slate-800 px-3 py-1 rounded text-slate-400 border border-slate-700">Total Users Logged: {accounts.length}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-400 text-xs font-bold uppercase tracking-wider"><th className="p-4 pl-6">ID System Key</th><th className="p-4">User Account Name</th><th className="p-4">Email Address Database</th><th className="p-4">System Assignment Role</th><th className="p-4 text-center">Operational Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs text-slate-600">
                    {accounts.map((acc) => (
                      <tr key={acc.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 pl-6 text-slate-400 font-bold">#US-00{acc.id}</td>
                        <td className="p-4 font-sans font-black text-slate-900 text-sm">{acc.name}</td>
                        <td className="p-4 text-xs font-medium text-slate-500">{acc.email}</td>
                        <td className="p-4"><span className="px-2.5 py-1 rounded border uppercase text-[10px] bg-indigo-50 text-indigo-700">{acc.role}</span></td>
                        <td className="p-4 text-center"><span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px]">● {acc.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {userRole !== 'admin' && (
            <div className="bg-white p-8 rounded-2xl border text-center shadow-md">
              <h2 className="text-xl font-black text-slate-700">Identity Context Active: '{userRole.toUpperCase()}'</h2>
              <p className="text-sm text-slate-400 mt-2">Use the system top bar role options selector to navigate settings.</p>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-slate-900 text-slate-400 text-xs py-5 px-6 border-t border-slate-800 flex justify-between items-center w-full">
        <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-600" /> Helpline: +251-11-XXXXXXX</div>
        <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-600" /> Support: support@school.edu.et</div>
      </footer>
    </div>
  );
}
