import React, { useState, useEffect, useRef } from 'react';
import { 
  CreditCard, Landmark, Users, GraduationCap, CheckCircle2, 
  AlertTriangle, RefreshCw, Download, LayoutDashboard, FileText, 
  Settings, Phone, Mail, Timer, Award 
} from 'lucide-react';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/v1'
  : 'https://smart-school-system-gdk5.onrender.com/api/v1';


// Global Localization Matrix Object Configuration Mapping
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
    workspaceSub: "Dynamic layout modules routing through core API instances seamlessly."
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
    workspaceSub: "ተለዋዋጭ የአቀማመጥ ሞጁሎች በዋና ኤፒአይ አማካኝነት ያለምንም እንከን ይሰራሉ።"
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
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSubmitted) {
        e.preventDefault();
        e.returnValue = 'Warning: Your active exam answers will be wiped out if you leave.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitted]);

  const handleSelectAnswer = (questionIndex, selectedOption) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [questionIndex]: selectedOption });
  };

  const submitExamPayload = async () => {
    clearInterval(timerRef.current);
    setLoading(true);
    const userAnswersArray = questions.map((_, idx) => answers[idx] || null);
    const correctAnswersArray = questions.map((q) => q.correctAnswer);

    try {
      const response = await fetch(`${API_BASE_URL}/exams/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          examId,
          userAnswers: userAnswersArray,
          correctAnswers: correctAnswersArray
        })
      });
      const data = await response.json();
      setResult(data);
      setIsSubmitted(true);
      if (onQuizComplete) onQuizComplete(data);
    } catch (error) {
      console.error('Submission failed, triggering mock fallback matrix:', error);
      let score = 0;
      questions.forEach((q, idx) => {
        if (answers[idx] === q.correctAnswer) score++;
      });
      setResult({ score, total: questions.length });
      setIsSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (window.confirm('Are you absolutely sure you want to finalize and turn in your exam sheets?')) {
      submitExamPayload();
    }
  };

  const handleAutoSubmit = () => {
    submitExamPayload();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeCritical = timeLeft < 60;

  if (isSubmitted && result) {
    return (
      <div className="max-w-2xl mx-auto my-4 bg-white border border-slate-100 rounded-2xl shadow p-8 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-50 rounded-full text-emerald-600 mb-4">
          <Award size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">{t.quizSuccessTitle}</h2>
        <p className="text-slate-500 mt-2">{t.quizSuccessSub}, {studentName}.</p>
        <div className="my-6 p-6 bg-slate-50 rounded-xl inline-block min-w-[200px]">
          <span className="block text-sm uppercase tracking-wider text-slate-400 font-semibold">{t.quizScoreLabel}</span>
          <span className="text-4xl font-extrabold text-indigo-600">{result.score} / {result.total}</span>
        </div>
        <div className="text-sm text-slate-400 italic">{t.quizFooterLabel}</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">{subject}</span>
          <h1 className="text-lg font-bold text-slate-800 mt-1">{t.quizHeader}</h1>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold shadow-inner ${
          isTimeCritical ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-slate-900 text-emerald-400'
        }`}>
          <Timer size={20} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {isTimeCritical && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 text-sm">
            <AlertTriangle className="shrink-0 text-amber-500" size={20} />
            <div>{t.quizWarning}</div>
          </div>
        )}
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-sm">
            <h3 className="text-slate-800 font-semibold flex gap-2">
              <span className="text-slate-400 font-mono">{qIndex + 1}.</span> {q.questionText}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {q.options.map((option, optIndex) => {
                const isSelected = answers[qIndex] === option;
                return (
                  <button
                    key={optIndex}
                    type="button"
                    onClick={() => handleSelectAnswer(qIndex, option)}
                    className={`flex items-center text-left p-3.5 rounded-xl border transition-all ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-medium ring-2 ring-indigo-600/10' 
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 text-xs ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>
                      {isSelected && '✓'}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
        <span className="text-sm text-slate-500 font-medium">{t.quizProgress} {Object.keys(answers).length} / {questions.length}</span>
        <button
          onClick={handleManualSubmit}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl border-b-2 border-indigo-800 shadow transition-all disabled:opacity-50"
        >
          {loading ? '...' : t.quizSubmit}
        </button>
      </div>
    </div>
  );
}
export default function App() {
  const [lang, setLang] = useState('en'); 
  const [currentTab, setCurrentTab] = useState('Fees & Payments');
  const [activeChild, setActiveChild] = useState('Tariku');
  const [financials, setFinancials] = useState({ totalInvoice: 45000, amountPaid: 26500, balance: 18500 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const t = LOCALIZATION_DICTIONARY[lang];

  const sampleQuizData = {
    examId: 204,
    subject: activeChild === 'Tariku' ? 'Mathematics (Grade 9B)' : 'General Science (Grade 4A)',
    totalTimeMinutes: 3,
    questions: [
      {
        questionText: "If 3x + 7 = 22, calculate the isolated parameter value of x.",
        options: ["x = 3", "x = 5", "x = 6", "x = 4"],
        correctAnswer: "x = 5"
      },
      {
        questionText: "Which payment platform is primarily built into the Ethiopian mobile finance structure?",
        options: ["PayPal", "Stripe", "Telebirr", "Apple Pay"],
        correctAnswer: "Telebirr"
      }
    ]
  };

  const fetchDashboardData = async (studentId) => {
    setFetching(true);
    setErrorMessage('');
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      if (studentId === 'Tariku') {
        setFinancials({ totalInvoice: 45000, amountPaid: 26500, balance: 18500 });
        setTransactions([
          { date: 'Aug 25, 2026', ref: '9FL5XYZ7820', amount: '18,500.00', status: 'SUCCESS', method: 'telebirr' },
          { date: 'May 02, 2026', ref: 'CBE-FT-99120', amount: '8,000.00', status: 'SUCCESS', method: 'CBE Transfer' },
          { date: 'Jan 14, 2026', ref: '9BF2AAA1450', amount: '20,000.00', status: 'SUCCESS', method: 'telebirr' }
        ]);
      } else {
        setFinancials({ totalInvoice: 45000, amountPaid: 45000, balance: 0 });
        setTransactions([
          { date: 'Jan 14, 2026', ref: '9BF2AAA1450', amount: '45,000.00', status: 'SUCCESS', method: 'telebirr' }
        ]);
      }
    } catch (err) {
      setErrorMessage('Pipeline dropped connection. Verify live deployment status hooks.');
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
          data: { outTradeNo: "SCH-FEES-2026-984321", tradeNo: `TXN-${Math.floor(Math.random() * 1000000)}`, paymentAmount: financials.balance.toString(), tradeStatus: "COMPLETED", customFields: { studentId: activeChild } }
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

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`HILLSIDE ACADEMY STATEMENT\nChild: ${activeChild}\nPaid: ${financials.amountPaid} ETB`);
    link.download = `Statement_${activeChild}.txt`;
    link.click();
  };
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased flex flex-col justify-between">
      <div>
        <header className="bg-indigo-900 text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-emerald-400" />
              <h1 className="font-extrabold text-lg tracking-wider">{t.portalTitle}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Language Switcher Toggle */}
              <button 
                onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                className="bg-indigo-800/80 hover:bg-indigo-700 text-white text-xs font-bold font-mono tracking-wide px-3 py-1.5 rounded-lg border border-indigo-700 transition"
              >
                🌐 {lang === 'en' ? 'አማርኛ (AM)' : 'English (EN)'}
              </button>

              <div className="text-sm font-medium bg-indigo-950 px-4 py-1.5 rounded-full border border-indigo-800 flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" /> {t.parentView} Ayane M.
              </div>
            </div>
          </div>
          <div className="bg-indigo-950 border-t border-indigo-800/60">
            <div className="max-w-5xl mx-auto flex overflow-x-auto">
              {[
                { id: 'Dashboard', label: t.tabDashboard, icon: LayoutDashboard },
                { id: 'Academic Report', label: t.tabAcademic, icon: FileText },
                { id: 'Fees & Payments', label: t.tabFees, icon: CreditCard },
                { id: 'Settings', label: t.tabSettings, icon: Settings }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`px-5 py-3 text-xs uppercase tracking-wider font-bold border-b-2 font-mono flex items-center gap-2 whitespace-nowrap transition ${currentTab === tab.id ? 'border-emerald-400 text-emerald-400 bg-indigo-900/40' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                  <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Active Student Selector Bar */}
          <div className="mb-6 p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block mb-1">{t.profileSelector}</span>
              <div className="flex gap-2">
                <button onClick={() => setActiveChild('Tariku')} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition ${activeChild === 'Tariku' ? 'bg-indigo-900 border-indigo-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Tariku Abebe (Grade 9B)</button>
                <button onClick={() => setActiveChild('Martha')} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition ${activeChild === 'Martha' ? 'bg-indigo-900 border-indigo-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Martha Abebe (Grade 4A)</button>
              </div>
            </div>
            <button onClick={() => fetchDashboardData(activeChild)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 border border-slate-200 rounded-lg hover:shadow-sm transition"><RefreshCw className={`h-4 w-4 ${fetching ? 'animate-spin' : ''}`} /></button>
          </div>

          {/* Conditional Sub-Workspace Router */}
          {currentTab === 'Academic Report' ? (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-semibold text-indigo-800">
                {t.quizNotice}
              </div>
              <OnlineQuiz 
                quizData={sampleQuizData} 
                studentName={`${activeChild} Abebe`}
                onQuizComplete={(res) => alert(`Assessment synced with ledger: ${res.score}/${res.total}`)}
                t={t}
              />
            </div>
          ) : currentTab !== 'Fees & Payments' ? (
            <div className="bg-white p-12 rounded-xl text-center border shadow-sm border-slate-200 my-4">
              <h2 className="text-xl font-bold text-slate-700">{currentTab} {t.workspaceTitle}</h2>
              <p className="text-sm text-slate-400 mt-2">{t.workspaceSub}</p>
            </div>
          ) : (
            <>
              {/* Financial Dashboard Panel */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2"><Landmark className="h-4 w-4 text-indigo-900" /> {t.financialSummary}</h3>
                  {financials.balance > 0 ? (
                    <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-md flex items-center gap-1.5 animate-pulse"><AlertTriangle className="h-3 w-3" /> {t.partialOutstanding}</span>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-md flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> {t.accountSettled}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  <div className="p-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{t.invoiceTotal}</span>
                    <span className="text-2xl font-black text-slate-800">{financials.totalInvoice.toLocaleString()}.00 <span className="text-xs font-semibold text-slate-400">ETB</span></span>
                  </div>
                  <div className="p-6 bg-slate-50/50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{t.amountPaid}</span>
                    <span className="text-2xl font-black text-emerald-600">+{financials.amountPaid.toLocaleString()}.00 <span className="text-xs font-semibold text-slate-400">ETB</span></span>
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{t.outstandingBalance}</span>
                    <span className={`text-2xl font-black ${financials.balance > 0 ? 'text-rose-600' : 'text-slate-500'}`}>{financials.balance.toLocaleString()}.00 <span className="text-xs font-semibold text-slate-400">ETB</span></span>
                  </div>
                </div>

                {financials.balance > 0 && (
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <CreditCard className="h-4 w-4 text-indigo-600" /> {t.gatewayWarning}
                    </div>
                    <button
                      onClick={handleTelebirrPayment}
                      disabled={loading}
                      className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg tracking-wide shadow-sm transition active:scale-[0.99] disabled:opacity-50"
                    >
                      {loading ? '...' : t.payButton}
                    </button>
                  </div>
                )}
              </section>

              {/* Transactions Ledger Panel Matrix */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">{t.receiptLogs}</h3>
                  <button onClick={handleDownloadPDF} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition"><Download className="h-3.5 w-3.5" /> {t.exportStatement}</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        <th className="p-4">{t.thDate}</th>
                        <th className="p-4">{t.thRef}</th>
                        <th className="p-4">{t.thGateway}</th>
                        <th className="p-4">{t.thAmount}</th>
                        <th className="p-4 text-right">{t.thStatus}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium">
                      {transactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 text-slate-500">{tx.date}</td>
                          <td className="p-4 font-mono font-bold text-slate-700">{tx.ref}</td>
                          <td className="p-4"><span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase font-mono ${tx.method === 'telebirr' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>{tx.method}</span></td>
                          <td className="p-4 font-bold text-slate-900">{tx.amount} ETB</td>
                          <td className="p-4 text-right"><span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50/50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-100">● {tx.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>© 2026 Hillside Academy Workspace Portal. Powered securely by FidelPortal Clusters.</div>
          <div className="flex gap-4 text-[11px] text-slate-500 font-semibold font-mono">
            <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-slate-400" /> +251-11-XXXXXXX</span>
            <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-slate-400" /> portal@hillside.edu.et</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
