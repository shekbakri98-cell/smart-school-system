import React, { useState } from 'react';
import { UserCheck, Edit3, Save, AlertCircle } from 'lucide-react';

export default function TeacherDashboard() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Tariku Abebe', ca1: 8, ca2: 15, ca3: 22, exam: 35 },
    { id: 2, name: 'Martha Abebe', ca1: 10, ca2: 18, ca3: 28, exam: 38 }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [scores, setScores] = useState({ ca1: '', ca2: '', ca3: '', exam: '' });

  // Evaluation Boundaries Configuration
  const limits = { ca1: 10, ca2: 20, ca3: 30, exam: 40 };

  const startEdit = (student) => {
    setEditingId(student.id);
    setScores({ ca1: student.ca1, ca2: student.ca2, ca3: student.ca3, exam: student.exam });
  };

  const handleSave = (id) => {
    // Stop save operation if any live value violates bounds
    if (
      parseFloat(scores.ca1) > limits.ca1 || 
      parseFloat(scores.ca2) > limits.ca2 || 
      parseFloat(scores.ca3) > limits.ca3 || 
      parseFloat(scores.exam) > limits.exam ||
      [scores.ca1, scores.ca2, scores.ca3, scores.exam].some(val => parseFloat(val) < 0)
    ) {
      return;
    }

    setStudents(students.map(s => s.id === id ? {
      ...s,
      ca1: parseFloat(scores.ca1) || 0,
      ca2: parseFloat(scores.ca2) || 0,
      ca3: parseFloat(scores.ca3) || 0,
      exam: parseFloat(scores.exam) || 0
    } : s));
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
      <div className="p-4 bg-slate-900 text-white font-bold flex items-center justify-between">
        <span className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-emerald-400" /> 
          Continuous Assessment (CA) Grade Grid
        </span>
        <span className="text-xs bg-slate-800 px-3 py-1 rounded border border-slate-700 font-mono">
          Structure: 10% + 20% + 30% + 40%
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase text-xs">
              <th className="p-4">Student Name</th>
              <th className="p-4">Quiz ({limits.ca1}%)</th>
              <th className="p-4">Project ({limits.ca2}%)</th>
              <th className="p-4">Mid ({limits.ca3}%)</th>
              <th className="p-4">Final ({limits.exam}%)</th>
              <th className="p-4 font-black text-slate-900">Total (100%)</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {students.map(s => {
              const total = s.ca1 + s.ca2 + s.ca3 + s.exam;
              const isEditing = editingId === s.id;

              // Compute real-time validation errors locally inside map cycle
              const errs = {
                ca1: parseFloat(scores.ca1) > limits.ca1 || parseFloat(scores.ca1) < 0,
                ca2: parseFloat(scores.ca2) > limits.ca2 || parseFloat(scores.ca2) < 0,
                ca3: parseFloat(scores.ca3) > limits.ca3 || parseFloat(scores.ca3) < 0,
                exam: parseFloat(scores.exam) > limits.exam || parseFloat(scores.exam) < 0,
              };
              const hasError = errs.ca1 || errs.ca2 || errs.ca3 || errs.exam;

              return (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900">{s.name}</td>
                  
                  {/* Quiz (10%) Input Cell */}
                  <td className="p-4">
                    {isEditing ? (
                      <div className="relative flex items-center">
                        <input type="number" max={limits.ca1} min="0" className={`w-20 border rounded p-1 pr-6 outline-none transition ${errs.ca1 ? 'border-red-500 bg-red-50 focus:ring-1 focus:ring-red-400' : 'focus:ring-1 focus:ring-indigo-500'}`} value={scores.ca1} onChange={e=>setScores({...scores, ca1: e.target.value})} />
                        {errs.ca1 && <AlertCircle className="h-3.5 w-3.5 text-red-500 absolute right-1.5" title={`Max allowed is ${limits.ca1}`} />}
                      </div>
                    ) : s.ca1}
                  </td>

                  {/* Project (20%) Input Cell */}
                  <td className="p-4">
                    {isEditing ? (
                      <div className="relative flex items-center">
                        <input type="number" max={limits.ca2} min="0" className={`w-20 border rounded p-1 pr-6 outline-none transition ${errs.ca2 ? 'border-red-500 bg-red-50 focus:ring-1 focus:ring-red-400' : 'focus:ring-1 focus:ring-indigo-500'}`} value={scores.ca2} onChange={e=>setScores({...scores, ca2: e.target.value})} />
                        {errs.ca2 && <AlertCircle className="h-3.5 w-3.5 text-red-500 absolute right-1.5" title={`Max allowed is ${limits.ca2}`} />}
                      </div>
                    ) : s.ca2}
                  </td>

                  {/* Mid Exam (30%) Input Cell */}
                  <td className="p-4">
                    {isEditing ? (
                      <div className="relative flex items-center">
                        <input type="number" max={limits.ca3} min="0" className={`w-20 border rounded p-1 pr-6 outline-none transition ${errs.ca3 ? 'border-red-500 bg-red-50 focus:ring-1 focus:ring-red-400' : 'focus:ring-1 focus:ring-indigo-500'}`} value={scores.ca3} onChange={e=>setScores({...scores, ca3: e.target.value})} />
                        {errs.ca3 && <AlertCircle className="h-3.5 w-3.5 text-red-500 absolute right-1.5" title={`Max allowed is ${limits.ca3}`} />}
                      </div>
                    ) : s.ca3}
                  </td>

                  {/* Final Exam (40%) Input Cell */}
                  <td className="p-4">
                    {isEditing ? (
                      <div className="relative flex items-center">
                        <input type="number" max={limits.exam} min="0" className={`w-20 border rounded p-1 pr-6 outline-none transition ${errs.exam ? 'border-red-500 bg-red-50 focus:ring-1 focus:ring-red-400' : 'focus:ring-1 focus:ring-indigo-500'}`} value={scores.exam} onChange={e=>setScores({...scores, exam: e.target.value})} />
                        {errs.exam && <AlertCircle className="h-3.5 w-3.5 text-red-500 absolute right-1.5" title={`Max allowed is ${limits.exam}`} />}
                      </div>
                    ) : s.exam}
                  </td>

                  {/* Dynamically Aggregated Sum Output Column */}
                  <td className="p-4 font-bold text-indigo-900">
                    {isEditing ? (
                      <span className="text-slate-500 font-medium">
                        {((parseFloat(scores.ca1) || 0) + (parseFloat(scores.ca2) || 0) + (parseFloat(scores.ca3) || 0) + (parseFloat(scores.exam) || 0)).toFixed(0)} / 100
                      </span>
                    ) : (
                      `${total} / 100`
                    )}
                  </td>

                  {/* Operational Controls Action Buttons */}
                  <td className="p-4 text-center">
                    {isEditing ? (
                      <button 
                        onClick={() => handleSave(s.id)} 
                        disabled={hasError}
                        className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 mx-auto transition ${hasError ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                      >
                        <Save className="h-3 w-3" /> Save
                      </button>
                    ) : (
                      <button 
                        onClick={() => startEdit(s)} 
                        className="border border-slate-200 bg-white text-slate-700 px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 mx-auto hover:bg-slate-50"
                      >
                        <Edit3 className="h-3 w-3" /> Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
