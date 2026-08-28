import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  CreditCard, Landmark, Users, GraduationCap, CheckCircle2, 
  AlertTriangle, RefreshCw, Download, LayoutDashboard, FileText, 
  Settings, Phone, Mail, Timer, Award, Calendar, Clock, Percent, ShieldCheck
} from 'lucide-react';
import TeacherDashboard from './TeacherDashboard';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/v1'
  : 'https://smart-school-system-gdk5.onrender.com/api/v1';


const LOCALIZATION_DICTIONARY = {
  en: {
    portalTitle: "🏢 HILLSIDE ACADEMY PORTAL",
    parentView: "Parent View:",
    tabDashboard: "Dashboard",
    tabAcademic: "Academic Report",
    tabFees: "Fees & Payments",
    tabSettings: "Settings",
    profileSelector: "Child Profile Selector",
    financialSummary: "Tuition Financial Summary",
    partialOutstanding: "PARTIAL PAYMENT OUTSTANDING",
    accountSettled: "INVOICE ACCOUNT SETTLED",
    invoiceTotal: "Total Assessment Invoice",
    amountPaid: "Aggregate Amount Paid",
    outstandingBalance: "Outstanding Ledger Balance",
    payButton: "Pay via Telebirr Webhook",
    gatewayWarning: "Settle pending balance immediately using telebirr web portal simulation layer.",
    receiptLogs: "Receipt Verification Logs",
    exportStatement: "Export Statement",
    thDate: "Execution Date",
    thRef: "Reference ID",
    thGateway: "Gateway Method",
    thAmount: "Amount",
    thStatus: "Status",
    quizHeader: "Continuous Online Examination",
    quizProgress: "Progress:",
    quizSubmit: "Submit Answers",
    quizNotice: "💡 Continuous online testing modules are active for this grading sequence.",
    quizWarning: "Lockout Warning: Less than 1 minute remains. Your answers will auto-submit when time expires.",
    quizSuccessTitle: "Exam Submission Finalized",
    quizSuccessSub: "Excellent work. Your continuous assessment ledger score has updated.",
    quizScoreLabel: "Total Verified Score",
    quizFooterLabel: "Logged safely to FidelPortal cluster data matrices.",
    workspaceTitle: "Workspace Section",
    workspaceSub: "Dynamic modules routing through core API instances seamlessly.",
    dashAttendanceHeader: "Attendance Tracking Metrics",
    dashPerformanceHeader: "Continuous Assessment Progress Indicators",
    dashPresent: "Days Present",
    dashAbsent: "Days Absent",
    dashLate: "Days Late",
    dashRate: "Total Attendance Rate",
    dashCurrentGPA: "Current Cumulative GPA",
    dashClassRank: "Academic Class Standings",
    dashTargetHeader: "Target Academic Goals",
    settingHeader: "Parent Communication Channel Configuration",
    settingSub: "Manage delivery targets for direct notification vectors regarding attendance or billing metrics.",
    setSmsLabel: "SMS Alert Contact Number",
    setEmailLabel: "Primary Email Address",
    setFrequencyLabel: "Notification Telemetry Frequency",
    setFreqDaily: "Daily Summary Logs",
    setFreqWeekly: "Weekly Digests",
    setFreqCritical: "Critical Infractions Only",
    setSaveBtn: "Commit Configuration Parameter Updates",
    setSuccessAlert: "Parent profile contact channels modified successfully!"
  },
  am: {
    portalTitle: "🏢 ሂልሳይድ አካዳሚ ፖርታል",
    parentView: "የወላጅ እይታ:",
    tabDashboard: "ዳሽቦርድ",
    tabAcademic: "ትምህርታዊ ሪፖርት",
    tabFees: "ክፍያዎች",
    tabSettings: "ቅንብሮች",
    profileSelector: "የተማሪ መገለጫ መምረጫ",
    financialSummary: "የልጆች የትምህርት ክፍያ ማጠቃለያ",
    partialOutstanding: "ያልተጠናቀቀ ክፍያ አለ",
    accountSettled: "ክፍያው ሙሉ በሙሉ ተጠናቋል",
    invoiceTotal: "አጠቃላይ የክፍያ መጠየቂያ",
    amountPaid: "እስካሁን የተከፈለ አጠቃላይ ክፍያ",
    outstandingBalance: "ቀሪ ሂሳብ ዕዳ",
    payButton: "በቴሌብር ይክፈሉ",
    gatewayWarning: "በቴሌብር የክፍያ ማስፈጸሚያ አማካኝነት ቀሪ ሂሳብዎን በፍጥነት ያጠናቅቁ።",
    receiptLogs: "የክፍያ ማረጋገጫ ታሪክ",
    exportStatement: "ሪፖርት አውርድ",
    thDate: "የተፈጸመበት ቀን",
    thRef: "የማመሳከሪያ ቁጥር",
    thGateway: "የክፍያ መንገድ",
    thAmount: "የገንዘብ መጠን",
    thStatus: "ሁኔታ",
    quizHeader: "የተከታታይ ምዘና የመስመር ላይ ፈተና",
    quizProgress: "የተመለሱ ጥያቄዎች:",
    quizSubmit: "መልሶችን አስረክብ",
    quizNotice: "💡 ለዚህ የትምህርት ክፍለ ጊዜ የመስመር ላይ የተከታታይ ምዘና ፈተናዎች ንቁ ናቸው።",
    quizWarning: "የማስጠንቀቂያ ገደብ፡ ከ 1 ደቂቃ ያነሰ ጊዜ ይቀራል። ጊዜው ሲያበቃ መልሶችዎ በራስ-ሰር ይላካሉ።",
    quizSuccessTitle: "የፈተና አሰረካክ ተጠናቋል",
    quizSuccessSub: "በጣም ጥሩ ስራ። የእርስዎ ተከታታይ ምዘና ውጤት መዝገብ ላይ ተሻሽሏል።",
    quizScoreLabel: "የተረጋገጠ አጠቃላይ ውጤት",
    quizFooterLabel: "በፊደል ፖርታል የዳታ ማዕከል ውስጥ በደህና ተቀምጧል።",
    workspaceTitle: "የስራ ቦታ ክፍለ ጊዜ",
    workspaceSub: "ተለዋዋጭ የአቀማመጥ ሞጁሎች በዋና ኤፒአይ አማካኝነት ያለምንም እንከን ይሰራሉ።",
    dashAttendanceHeader: "የተማሪዎች የትምህርት ቤት መገኘት መከታተያ",
    dashPerformanceHeader: "የተከታታይ ምዘና የውጤት አመልካቾች",
    dashPresent: "የተገኘባቸው ቀናት",
    dashAbsent: "የቀረባቸው ቀናት",
    dashLate: "ያረፈደባቸው ቀናት",
    dashRate: "አጠቃላይ የትምህርት ቤት መገኘት ምጣኔ",
    dashCurrentGPA: "የአሁኑ ጠቅላላ ውጤት (GPA)",
    dashClassRank: "በትምህርት ክፍል ውስጥ ያለ ደረጃ",
    dashTargetHeader: "የታለሙ የውጤት ግቦች",
    settingHeader: "የወላጅ የመገናኛ ሰርጥ ውቅረት ቅንብሮች",
    settingSub: "ስለ መገኘት ወይም የክፍያ መለኪያዎች ቀጥተኛ የማሳወቂያ ማቅረቢያዎችን ያስተዳድሩ።",
    setSmsLabel: "የኤስኤምኤስ (SMS) ስልክ ቁጥር",
    setEmailLabel: "ዋናው የኢሜይል አድራሻ",
    setFrequencyLabel: "የማሳወቂያዎች ድግግሞሽ መጠን",
    setFreqDaily: "የዕለት ተዕለት ማጠቃለያ መዝገብ",
    setFreqWeekly: "ሳምንታዊ ማጠቃለያዎች",
    setFreqCritical: "አስቸኳይ ሁኔታዎች ብቻ",
    setSaveBtn: "ለውጦችን በቋሚነት አስቀምጥ",
    setSuccessAlert: "የወላጅ መገለጫ መገናኛ ሰርጦች በተሳካ ሁኔታ ተሻሽለዋል!"
  }
};
function OnlineQuiz({ quizData, studentName, onQuizComplete, t }) {
  const { examId, subject, totalTimeMinutes, questions } = quizData;
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(totalTimeMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timeLeft <= 0) { submitExamPayload(); return; }
    timerRef.current = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  const handleSelectAnswer = (qIdx, opt) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [qIdx]: opt });
  };

  const submitExamPayload = async () => {
    clearInterval(timerRef.current);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/exams/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName, examId,
          userAnswers: questions.map((_, idx) => answers[idx] || null),
          correctAnswers: questions.map(q => q.correctAnswer)
        })
      });
      const data = await response.json();
      setResult(data);
      setIsSubmitted(true);
      if (onQuizComplete) onQuizComplete(data);
    } catch {
      let score = 0;
      questions.forEach((q, idx) => { if (answers[idx] === q.correctAnswer) score++; });
      setResult({ score, total: questions.length });
      setIsSubmitted(true);
    } finally { setLoading(false); }
  };

  if (isSubmitted && result) {
    return (
      <div className="max-w-2xl mx-auto my-4 bg-white border rounded-2xl shadow p-8 text-center animate-fade-in">
        <Award size={48} className="mx-auto text-emerald-600 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">{t.quizSuccessTitle}</h2>
        <p className="text-slate-500 mt-2">{t.quizSuccessSub}, {studentName}.</p>
        <div className="my-6 p-6 bg-slate-50 rounded-xl inline-block min-w-[200px]">
          <span className="block text-sm font-semibold text-slate-400">{t.quizScoreLabel}</span>
          <span className="text-4xl font-extrabold text-indigo-600">{result.score} / {result.total}</span>
        </div>
        <div className="text-sm text-slate-400 italic">{t.quizFooterLabel}</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">{subject}</span>
          <h1 className="text-lg font-bold text-slate-800 mt-1">{t.quizHeader}</h1>
        </div>
        <div className={`px-4 py-2 rounded-xl font-mono text-lg font-bold ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-900 text-emerald-400'}`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>
      <div className="p-6 space-y-6">
        {timeLeft < 60 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 text-sm">
            <AlertTriangle className="shrink-0 text-amber-500" size={20} />
            <div>{t.quizWarning}</div>
          </div>
        )}
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white rounded-xl border p-5 shadow-sm space-y-3">
            <h3 className="text-slate-800 font-semibold">{qIndex + 1}. {q.questionText}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((opt, oIdx) => (
                <button key={oIdx} type="button" onClick={() => handleSelectAnswer(qIndex, opt)} className={`text-left p-3 rounded-xl border transition-all ${answers[qIndex] === opt ? 'border-indigo-600 bg-indigo-50 font-medium' : 'border-slate-200'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-50 border-t px-6 py-4 flex justify-between items-center">
        <span className="text-sm font-medium text-slate-500">{t.quizProgress} {Object.keys(answers).length} / {questions.length}</span>
        <button onClick={() => window.confirm('Submit answers?') && submitExamPayload()} disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold transition hover:bg-indigo-700">
          {loading ? '...' : t.quizSubmit}
        </button>
      </div>
    </div>
  );
}
function DashboardContentGrid({ activeChild, t }) {
  const metrics = activeChild === 'Tariku' 
    ? { present: 74, absent: 2, late: 4, total: 80, gpa: "3.62", rank: "4 / 42", target: "3.80" }
    : { present: 78, absent: 0, late: 2, total: 80, gpa: "3.94", rank: "1 / 38", target: "4.00" };
  const rate = parseFloat(((metrics.present / metrics.total) * 100).toFixed(1));

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="text-sm font-black text-slate-700 mb-4 border-b pb-2">📊 {t.dashAttendanceHeader}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 border rounded-xl"><span className="text-xs font-bold text-slate-400 block">{t.dashPresent}</span><div className="text-2xl font-black mt-1">{metrics.present}</div></div>
          <div className="p-4 bg-slate-50 border rounded-xl"><span className="text-xs font-bold text-slate-400 block">{t.dashAbsent}</span><div className="text-2xl font-black mt-1">{metrics.absent}</div></div>
          <div className="p-4 bg-slate-50 border rounded-xl"><span className="text-xs font-bold text-slate-400 block">{t.dashLate}</span><div className="text-2xl font-black mt-1">{metrics.late}</div></div>
          <div className="p-4 bg-slate-900 text-white rounded-xl shadow-inner">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.dashRate}</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{rate}%</div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-2"><div className="bg-emerald-400 h-full rounded-full" style={{ width: `${rate}%` }} /></div>
          </div>
        </div>
      </section>
      <section className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="text-sm font-black text-slate-700 mb-4 border-b pb-2">🎯 {t.dashPerformanceHeader}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div><span className="text-xs font-bold text-slate-400 block">{t.dashCurrentGPA}</span><div className="text-3xl font-extrabold text-indigo-600 mt-1">{metrics.gpa}</div></div>
          <div><span className="text-xs font-bold text-slate-400 block">{t.dashClassRank}</span><div className="text-2xl font-black text-slate-800 mt-1">{metrics.rank}</div></div>
          <div><span className="text-xs font-bold text-slate-400 block">{t.dashTargetHeader}</span><div className="text-2xl font-black text-slate-400 mt-1">{metrics.target}</div></div>
        </div>
      </section>
    </div>
  );
}

function SettingsPanelForm({ t }) {
  const [sms, setSms] = useState("+251-000-234567");
  const [email, setEmail] = useState("parent.ayane@fidel.edu.et");
  return (
    <form onSubmit={(e) => { e.preventDefault(); alert(t.setSuccessAlert); }} className="bg-white rounded-xl border max-w-2xl mx-auto overflow-hidden shadow-sm">
      <div className="p-5 bg-slate-50 border-b"><h3 className="font-black text-slate-700 text-sm uppercase tracking-wider">{t.settingHeader}</h3><p className="text-xs text-slate-400 mt-1">{t.settingSub}</p></div>
      <div className="p-6 space-y-4">
        <div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">{t.setSmsLabel}</label><input value={sms} onChange={e => setSms(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm font-medium"/></div>
        <div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">{t.setEmailLabel}</label><input value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm font-medium"/></div>
      </div>
      <div className="p-4 bg-slate-50 border-t text-right"><button type="submit" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">{t.setSaveBtn}</button></div>
    </form>
  );
}
export default function App() {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('smart_portal_role') || 'Parent');
  const [lang, setLang] = useState(() => localStorage.getItem('smart_portal_lang') || 'en');
  const [currentTab, setCurrentTab] = useState('Fees & Payments');
  const [activeChild, setActiveChild] = useState('Tariku');
  const [financials, setFinancials] = useState({ totalInvoice: 45000, amountPaid: 26500, balance: 18500 });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => { localStorage.setItem('smart_portal_role', userRole); }, [userRole]);
  useEffect(() => { localStorage.setItem('smart_portal_lang', lang); }, [lang]);

  const t = LOCALIZATION_DICTIONARY[lang];

  const sampleQuizData = {
    examId: 204,
    subject: activeChild === 'Tariku' ? 'Mathematics (Grade 9B)' : 'General Science (Grade 4A)',
    totalTimeMinutes: 3,
    questions: [
      { questionText: "If 3x + 7 = 22, calculate the isolated parameter value of x.", options: ["x = 3", "x = 5", "x = 6", "x = 4"], correctAnswer: "x = 5" },
      { questionText: "Which payment platform is primarily built into the Ethiopian mobile finance structure?", options: ["PayPal", "Stripe", "Telebirr", "Apple Pay"], correctAnswer: "Telebirr" }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between text-slate-800 font-sans antialiased">
      <div>
        <header className="bg-indigo-900 text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-emerald-400" /><h1 className="font-extrabold text-sm tracking-wider">{t.portalTitle}</h1></div>
            <div className="flex gap-2">
              <button onClick={() => setUserRole(userRole === 'Parent' ? 'Teacher' : 'Parent')} className="bg-indigo-950 border border-indigo-800 px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wide uppercase transition hover:bg-indigo-900">
                Role: {userRole}
              </button>
              <button onClick={() => setLang(lang === 'en' ? 'am' : 'en')} className="bg-indigo-800 border border-indigo-700 px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wide transition hover:bg-indigo-700">
                🌐 {lang === 'en' ? 'አማርኛ' : 'English'}
              </button>
            </div>
          </div>
          {userRole === 'Parent' && (
            <div className="bg-indigo-950 border-t border-indigo-800/60 flex max-w-5xl mx-auto overflow-x-auto">
              {['Dashboard', 'Academic Report', 'Fees & Payments', 'Settings'].map(tab => {
                const isSelected = currentTab === tab;
                const localizedLabel = tab === 'Dashboard' ? t.tabDashboard : tab === 'Academic Report' ? t.tabAcademic : tab === 'Fees & Payments' ? t.tabFees : t.tabSettings;
                return (
                  <button key={tab} onClick={() => setCurrentTab(tab)} className={`px-5 py-3 text-xs uppercase font-bold whitespace-nowrap transition-colors border-b-2 ${isSelected ? 'text-emerald-400 border-emerald-400 bg-indigo-900/40' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>{localizedLabel}</button>
                );
              })}
            </div>
          )}
        </header>

        <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          {userRole === 'Teacher' ? <TeacherDashboard /> : (
            <>
              <div className="mb-6 p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block mb-1">{t.profileSelector}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setActiveChild('Tariku')} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition ${activeChild === 'Tariku' ? 'bg-indigo-900 border-indigo-900 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>Tariku (9B)</button>
                    <button onClick={() => setActiveChild('Martha')} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition ${activeChild === 'Martha' ? 'bg-indigo-900 border-indigo-900 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>Martha (4A)</button>
                  </div>
                </div>
              </div>

              {currentTab === 'Dashboard' && <DashboardContentGrid activeChild={activeChild} t={t} />}
              {currentTab === 'Academic Report' && <OnlineQuiz quizData={sampleQuizData} studentName={`${activeChild} Abebe`} t={t} />}
              {currentTab === 'Settings' && <SettingsPanelForm t={t} />}
              {currentTab === 'Fees & Payments' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm overflow-hidden">
                  <h3 className="font-black text-sm uppercase tracking-wider text-slate-700 border-b pb-2 mb-4">💳 {t.financialSummary}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border rounded-xl overflow-hidden bg-slate-50/50">
                    <div className="p-5 text-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">{t.invoiceTotal}</span>
                      <div className="text-2xl font-black text-slate-800">{financials.totalInvoice.toLocaleString()}.00 <span className="text-xs font-semibold text-slate-400">ETB</span></div>
                    </div>
                    <div className="p-5 text-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">{t.amountPaid}</span>
                      <div className="text-2xl font-black text-emerald-600">+{financials.amountPaid.toLocaleString()}.00 <span className="text-xs font-semibold text-slate-400">ETB</span></div>
                    </div>
                    <div className="p-5 text-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">{t.outstandingBalance}</span>
                      <div className="text-2xl font-black text-rose-600">{financials.balance.toLocaleString()}.00 <span className="text-xs font-semibold text-slate-400">ETB</span></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 font-mono font-medium">
        Hillside Academy Workspace Portal. Powered securely by FidelPortal Clusters.
      </footer>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}
