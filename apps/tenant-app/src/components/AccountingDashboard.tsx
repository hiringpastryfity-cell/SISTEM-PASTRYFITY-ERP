// apps/tenant-app/src/components/AccountingDashboard.tsx
import React, { useEffect, useState } from 'react';
import { AccountingService, JournalEntry } from '../services/accountingService';
import { GithubLightweightDB } from '@pastryfity/github-storage';

const db = new GithubLightweightDB({
  owner: 'pastryfity-corp',
  repo: 'pastryfity-data',
  token: process.env.NEXT_PUBLIC_GITHUB_PAT || '',
});

const financeService = new AccountingService(db);

export const AccountingDashboard: React.FC = () => {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournals = async () => {
      const data = await financeService.getGeneralLedger();
      // Reverse array agar entri terbaru ada di atas
      setJournals(data.reverse());
      setLoading(false);
    };
    fetchJournals();
  }, []);

  // Kalkulasi sederhana untuk Executive Analytics (Laba/Rugi)
  const totalPendapatan = journals
    .filter(j => j.accountCode === '4-1001')
    .reduce((sum, j) => sum + j.credit, 0); // Pendapatan bertambah di kredit
    
  const totalHPP = journals
    .filter(j => j.accountCode === '5-1001')
    .reduce((sum, j) => sum + j.debit, 0); // HPP bertambah di debit
    
  const totalKerugianWaste = journals
    .filter(j => j.accountCode === '5-2001')
    .reduce((sum, j) => sum + j.debit, 0); // Kerugian bertambah di debit

  const labaKotor = totalPendapatan - totalHPP - totalKerugianWaste;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Accounting & Finance Dashboard</h1>

      {/* Top Cards: Profit & Loss Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-500 font-bold">Total Pendapatan</p>
          <p className="text-xl font-bold text-green-700">Rp {totalPendapatan.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500 font-bold">Total HPP</p>
          <p className="text-xl font-bold text-yellow-700">Rp {totalHPP.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-red-500">
          <p className="text-sm text-gray-500 font-bold">Kerugian Waste</p>
          <p className="text-xl font-bold text-red-700">Rp {totalKerugianWaste.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-blue-900 p-4 rounded shadow text-white">
          <p className="text-sm font-bold opacity-80">Laba Kotor (Gross Profit)</p>
          <p className="text-2xl font-bold">Rp {labaKotor.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Table: General Ledger */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-bold p-4 border-b bg-gray-100">Buku Jurnal Umum (Auto-Posted)</h2>
        {loading ? (
          <p className="p-4">Memuat data jurnal...</p>
        ) : (
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800 text-white sticky top-0">
                <tr>
                  <th className="py-2 px-4 text-left">Tanggal</th>
                  <th className="py-2 px-4 text-left">Ref ID</th>
                  <th className="py-2 px-4 text-left">Kode Akun</th>
                  <th className="py-2 px-4 text-left">Nama Akun & Deskripsi</th>
                  <th className="py-2 px-4 text-right">Debit (Rp)</th>
                  <th className="py-2 px-4 text-right">Kredit (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {journals.map(journal => (
                  <tr key={journal.journalId} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 whitespace-nowrap">{new Date(journal.date).toLocaleString('id-ID')}</td>
                    <td className="py-2 px-4 font-mono text-xs">{journal.referenceId}</td>
                    <td className="py-2 px-4 font-bold">{journal.accountCode}</td>
                    <td className="py-2 px-4">
                      <div className="font-semibold">{journal.accountName}</div>
                      <div className="text-xs text-gray-500">{journal.description}</div>
                    </td>
                    <td className="py-2 px-4 text-right text-gray-700">
                      {journal.debit > 0 ? journal.debit.toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="py-2 px-4 text-right text-gray-700">
                      {journal.credit > 0 ? journal.credit.toLocaleString('id-ID') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
