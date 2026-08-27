        {/* Tuition Ledger Card */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
          <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Landmark className="h-5 w-5 text-indigo-800" />Tuition Ledger Overview
            </h2>
            {financials.balance > 0 ? (
              <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3" /> Balance Pending
              </span>
            ) : (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" /> Account Settled
              </span>
            )}
          </div>
          
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-slate-100">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Total Term Assessment</span>
              <span className="text-2xl font-black text-slate-900">{financials.totalInvoice.toLocaleString()}.00 <span className="text-sm font-medium text-slate-500">ETB</span></span>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 block mb-1">Total Amount Deposited</span>
              <span className="text-2xl font-black text-emerald-600">{financials.amountPaid.toLocaleString()}.00 <span className="text-sm font-medium text-slate-500">ETB</span></span>
            </div>
            <div className={`p-4 rounded-lg border transition ${financials.balance > 0 ? 'bg-red-50/50 border-red-100 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Remaining Outstanding</span>
              <span className="text-2xl font-black">{financials.balance.toLocaleString()}.00 <span className="text-sm font-medium text-slate-400">ETB</span></span>
            </div>
          </div>

          {financials.balance > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CreditCard className="h-4 w-4 text-slate-400" />
                <span>Instant confirmation through telebirr integration channels.</span>
              </div>
              <button 
                onClick={handleTelebirrPayment} 
                disabled={loading} 
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Processing Transaction...' : 'Pay Remaining via Telebirr'}
              </button>
            </div>
          )}
        </section>

        {/* Receipt & Payment Log History Table */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Receipt & Payment Log History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-4">Payment Date</th>
                  <th className="p-4">Reference ID</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4 text-right">Amount Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-400 italic">No historical records discovered for this student record.</td>
                  </tr>
                ) : (
                  transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-medium text-slate-900">{tx.date}</td>
                      <td className="p-4 font-mono text-xs text-slate-500">{tx.ref}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-600 uppercase">
                          {tx.method || 'telebirr'}
                        </span>
                      </td>
                      <td className="p-4 text-right font-black text-slate-900">
                        {tx.amount} <span className="text-xs font-normal text-slate-400">ETB</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
