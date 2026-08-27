import React, { useState } from 'react';
import { UserCheck, Edit3, Save } from 'lucide-react';

export default function TeacherDashboard() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Tariku Abebe', ca1: 8, ca2: 15, ca3: 22, exam: 35 },
    { id: 2, name: 'Martha Abebe', ca1: 10, ca2: 18, ca3: 28, exam: 38 }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [scores, setScores] = useState({ ca1: '', ca2: '', ca3: '', exam: '' });

  const startEdit = (student) => {
    setEditingId(student.id);
    setScores({ ca1: student.ca1, ca2: student.ca2, ca3: student.ca3, exam: student.exam });
  };

  const handleSave = (id) => {
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
        <span className="flex items-center gap-2"><UserCheck className="h-5 w-5 text-emerald-400" /> Continuous Assessment (CA) Grade Grid</span>
        <span className="text-xs bg-slate-800 px-3 py-1 rounded border border-slate-700 font-mono">Structure: 10% + 20% + 30% + 40%</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase text-xs">
              <th className="p-4">Student Name</th>
              <th className="p-4">Quiz (10%)</th>
              <th className="p-4">Project (20%)</th>
              <th className="p-4">Mid (30%)</th>
              <th className="p-4">Final (40%)</th>
              <th className="p-4 font-black text-slate-900">Total (100%)</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {students.map(s => {
              const total = s.ca1 + s.ca2 + s.ca3 + s.exam;
              const isEditing = editingId === s.id;
              return (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900">{s.name}</td>
                  <td className="p-4">{isEditing ? <input type="number" max="10" className="w-16 border rounded p-1" value={scores.ca1} onChange={e=>setScores({...scores, ca1: e.target.value})} /> : s.ca1}</td>
                  <td className="p-4">{isEditing ? <input type="number" max="20" className="w-16 border rounded p-1" value={scores.ca2} onChange={e=>setScores({...scores, ca2: e.target.value})} /> : s.ca2}</td>
                  <td className="p-4">{isEditing ? <input type="number" max="30" className="w-16 border rounded p-1" value={scores.ca3} onChange={e=>setScores({...scores, ca3: e.target.value})} /> : s.ca3}</td>
                  <td className="p-4">{isEditing ? <input type="number" max="40" className="w-16 border rounded p-1" value={scores.exam} onChange={e=>setScores({...scores, exam: e.target.value})} /> : s.exam}</td>
                  <td className="p-4 font-bold text-indigo-900">{total} / 100</td>
                  <td className="p-4 text-center">
                    {isEditing ? (
                      <button onClick={() => handleSave(s.id)} className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 mx-auto hover:bg-emerald-700"><Save className="h-3 w-3" /> Save</button>
                    ) : (
                      <button onClick={() => startEdit(s)} className="border border-slate-200 bg-white text-slate-700 px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 mx-auto hover:bg-slate-50"><Edit3 className="h-3 w-3" /> Edit</button>
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
