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
      // API backend irratti herrega haaraa galmeessuu
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
          
          {/* ADMIN ACTION WINDOW: ACCOUNT REGISTRATION GRID */}
          {userRole === 'admin' && currentTab === 'Create User Accounts' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* 1. NEW ACCOUNT CREATION FORM */}
              <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xl h-fit">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-indigo-600" /> Account Creator
                </h2>
                <form onSubmit={handleCreateAccount} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">User Name</label>
                    <input type="text" required value={regName} onChange={e => setRegName(e.target.value)} placeholder="e.g. Kedir Ahmed" className="w-full px-3 py-2 border rounded-xl text-xs outline-none bg-slate-50 mt-1"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                    <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="name@school.edu.et" className="w-full px-3 py-2 border rounded-xl text-xs outline-none bg-slate-50 mt-1"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Password</label>
                    <input type="password" required value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 border rounded-xl text-xs outline-none bg-slate-50 mt-1"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Assign Portal Role</label>
                    <select value={regRole} onChange={e => setRegRole(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs outline-none bg-white font-semibold mt-1">
                      <option value="student">Student Portal</option>
                      <option value="teacher">Teacher Portal</option>
                      <option value="admin">System Administrator</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-widest transition shadow-md">
                    Provision Account
                  </button>
                </form>
              </div>

              {/* 2. RECENT ACCOUNTS IDENTITY AUDIT LOG */}
              <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="p-4 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" /> Identity Access Audit Log
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider"><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Assigned Role</th><th className="p-4 text-center">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-xs text-slate-600">
                      {accounts.map(acc => (
                        <tr key={acc.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-sans font-bold text-slate-900">{acc.name}</td>
                          <td className="p-4 text-xs">{acc.email}</td>
                          <td className="p-4"><span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded uppercase text-[10px]">{acc.role}</span></td>
                          <td className="p-4 text-center"><span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded text-[10px]">✓ {acc.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* NON-ADMIN GENERIC WORKSPACE INTERFACES */}
          {userRole !== 'admin' && (
            <div className="bg-white p-8 rounded-2xl border text-center shadow-md">
              <h2 className="text-xl font-black text-slate-700">Identity Context Active: '{userRole.toUpperCase()}'</h2>
              <p className="text-sm text-slate-400 mt-2">Use the system top bar role options selector to navigate settings.</p>
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
