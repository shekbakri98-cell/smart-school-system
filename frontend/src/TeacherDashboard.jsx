import React, { useState, useEffect } from 'react';
import { UserCheck, Edit3, Save, RefreshCw } from 'lucide-react';

const API_BASE_URL = 'https://onrender.com';

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [scores, setScores] = useState({ ca1: '', ca2: '', ca3: '', exam: '' });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchStudentGrades = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/grades/continuous-assessment`);
      if (!response.ok) throw new Error(`Server status: ${response.status}`);
      const data = await response.json();
      setStudents(data || []);
    } catch (err) {
      setErrorMessage('Qabxii barattootaa fiduun hin danda\'amne.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentGrades();
  }, []);

  const startEdit = (student) => {
    setEditingId(student.id);
    setScores({ ca1: student.ca1, ca2: student.ca2, ca3: student.ca3, exam: student.exam });
  };

  const handleSave = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/grades/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: id,
          ca1: Number(scores.ca1),
          ca2: Number(scores.ca2),
          ca3: Number(scores.ca3),
          exam: Number(scores.exam)
        })
      });
      if (response.ok) {
        alert("Qabxiin barataa milkiidhaan database irratti kuufameera!");
        setEditingId(null);
        fetchStudentGrades();
      }
    } catch (err) {
      alert("Update fail.");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-900 text-white font-bold flex items-center justify-between">
        <span className="flex items-center gap-2"><UserCheck className="h-5 w-5 text-emerald-400" /> Continuous Assessment Grade Grid</span>
        <button onClick={fetchStudentGrades} className="p-1 hover:bg-slate-800 rounded"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button>
      </div>
      {errorMessage && <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold">{errorMessage}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b font-bold text-slate-500 text-xs uppercase">
              <th className="p-4">Student Name</th>
              <th className="p-4">Quiz (10%)</th>
              <th className="p-4">Project (20%)</th>
              <th className="p-4">Mid (30%)</th>
              <th className="p-4">Final (40%)</th>
              <th className="p-4 font-black text-slate-900">Total (100%)</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map(s => {
              const total = s.ca1 + s.ca2 + s.ca3 + s.exam;
              const isEditing = editingId === s.id;
              return (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900">{s.name}</td>
                  <td className="p-4">{isEditing ? <input type="number" className="w-16 border rounded p-1" value={scores.ca1} onChange={e=>setScores({...scores, ca1: e.target.value})} /> : s.ca1}</td>
                  <td className="p-4">{isEditing ? <input type="number" className="w-16 border rounded p-1" value={scores.ca2} onChange={e=>setScores({...scores, ca2: e.target.value})} /> : s.ca2}</td>
                  <td className="p-4">{isEditing ? <input type="number" className="w-16 border rounded p-1" value={scores.ca3} onChange={e=>setScores({...scores, ca3: e.target.value})} /> : s.ca3}</td>
                  <td className="p-4">{isEditing ? <input type="number" className="w-16 border rounded p-1" value={scores.exam} onChange={e=>setScores({...scores, exam: e.target.value})} /> : s.exam}</td>
                  <td className="p-4 font-bold text-indigo-900">{total} / 100</td>
                  <td className="p-4 text-center">
                    {isEditing ? (
                      <button onClick={() => handleSave(s.id)} className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 mx-auto"><Save className="h-3 w-3" /> Save</button>
                    ) : (
                      <button onClick={() => startEdit(s)} className="border border-slate-200 bg-white text-slate-700 px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 mx-auto"><Edit3 className="h-3 w-3" /> Edit</button>
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
