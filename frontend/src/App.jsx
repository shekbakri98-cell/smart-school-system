import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Lock, Mail, User, Shield, 
  RefreshCw, LayoutDashboard, FileText, UserCheck, 
  ShieldAlert, LogOut, Phone, Mail as MailIcon 
} from 'lucide-react';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/v1'
  : 'https://smart-school-system-gdk5.onrender.com/api/v1';


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(''); // 'admin', 'teacher', ykn 'student'
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [currentUser, setCurrentUser] = useState(null);

  // Authentication Fields Input States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // User Database Profiles Master Store
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Admin Control', email: 'admin@school.com', password: 'password123', role: 'admin' },
    { id: 2, name: 'Alex Mercer', email: 'teacher@school.com', password: 'password123', role: 'teacher' },
    { id: 3, name: 'Tariku Abebe', email: 'student@school.com', password: 'password123', role: 'student' }
  ]);
  // 🔐 LIVE LOG-IN PIPELINE INTEGRATION
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      // API backend irratti dubbisuuf dhugaatti asirratti POST godha
      await new Promise(resolve => setTimeout(resolve, 500)); // Pipeline Simulation

      // Match user profile elements dynamically
      const matchedUser = accounts.find(acc => acc.email === email && acc.password === password);

      if (matchedUser) {
        setCurrentUser(matchedUser);
        setUserRole(matchedUser.role);
        setIsLoggedIn(true);
        setCurrentTab(matchedUser.role === 'admin' ? 'System Directory' : 'Dashboard');
        setEmail('');
        setPassword('');
      } else {
        setLoginError('❌ Email ykn Password kee dogoggora! Maaloo deebisi yaali.');
      }
    } catch (err) {
      setLoginError('Pipeline dropped authentication. Network verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setCurrentUser(null);
  };
  // 🚪 IF NOT LOGGED IN: SHOW SECURE LOGIN INTERFACE FORM
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-white">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-400/30">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-center tracking-wide">Hillside Access Gateway</h2>
          <p className="text-slate-400 text-xs text-center mt-1 mb-6">Maaloo email fi password kee galchi seenuuf</p>

          {loginError && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl text-xs font-bold mb-4">{loginError}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
              <input type="email" required placeholder="name@school.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl outline-none text-xs text-white focus:ring-1 focus:ring-indigo-500 font-mono"/>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
              <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl outline-none text-xs text-white focus:ring-1 focus:ring-indigo-500 font-mono"/>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition text-xs uppercase tracking-widest shadow-md disabled:opacity-50">
              {loading ? 'Authenticating Gateway...' : 'Secure Authorization'}
            </button>
          </form>
          <div className="mt-4 text-center text-[10px] text-slate-500 font-mono">Mock logs: admin@school.com / password123</div>
        </div>
      </div>
    );
  }

  // MAIN SECURE WORKSPACE NAVBAR INTERFACE
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col justify-between">
      <div>
        <header className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white shadow-xl">
          <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-emerald-400" />
              <div>
                <h1 className="font-black text-xl tracking-wider">HILLSIDE ACADEMY</h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-0.5">Secure Core Role Management Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs bg-indigo-950 px-3 py-1.5 rounded-xl border border-indigo-800 font-bold font-mono text-slate-300">
                👤 Active: {currentUser?.name} ({userRole.toUpperCase()})
              </span>
              <button onClick={handleLogout} className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md">
                <LogOut className="h-3.5 w-3.5" /> Exit
              </button>
            </div>
          </div>
          
          <div className="bg-indigo-950/40 border-t border-indigo-900/50">
            <div className="max-w-5xl mx-auto flex overflow-x-auto px-2">
              {(userRole === 'admin' 
                ? ['System Directory', 'Operational Matrix']
                : ['Dashboard', 'Performance Parameters']
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
          {/* VIEW CONTROLS DEPENDING ON AUTH ROLE */}
          {currentTab === 'System Directory' && userRole === 'admin' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
              <div className="p-5 bg-slate-950 text-white font-bold text-sm flex justify-between items-center">
                <span>📋 Admin Control Master Directory Directory</span>
                <span className="text-[10px] bg-slate-800 px-3 py-1 rounded text-slate-400 border border-slate-700">Total verified: {accounts.length}</span>
              </div>
              <div className="p-6 text-xs text-slate-500 leading-relaxed font-mono">
                Admin core access configuration terminal activated successfully. All school drivers synced cleanly.
              </div>
            </div>
          )}

          {currentTab === 'Dashboard' && (
            <div className="bg-white p-8 rounded-2xl border text-center shadow-md animate-fadeIn">
              <h2 className="text-xl font-black text-slate-700">Assalamuu Alaykum, Welcome back!</h2>
              <p className="text-sm text-slate-400 mt-2">Workspace context set for role profiles: '{userRole.toUpperCase()}'.</p>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-slate-900 text-slate-400 text-xs py-5 px-6 border-t border-slate-800 flex justify-between items-center w-full">
        <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-600" /> Helpline: +251-11-XXXXXXX</div>
        <div className="flex items-center gap-1.5"><MailIcon className="h-3.5 w-3.5 text-slate-600" /> Support: support@school.edu.et</div>
      </footer>
    </div>
  );
}
