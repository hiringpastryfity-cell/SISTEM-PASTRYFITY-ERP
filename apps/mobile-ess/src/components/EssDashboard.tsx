// apps/mobile-ess/src/components/EssDashboard.tsx
import React, { useState } from 'react';
import { HRMService, DailyEssReport } from '../services/hrmService';
import { GithubLightweightDB } from '@pastryfity/github-storage';

const db = new GithubLightweightDB({
  owner: 'pastryfity-corp',
  repo: 'pastryfity-data',
  token: process.env.NEXT_PUBLIC_GITHUB_PAT || '',
});

const hrmService = new HRMService(db);

export const EssDashboard: React.FC<{ employeeId: string, role: 'BAKER' | 'KASIR' }> = ({ employeeId, role }) => {
  const [tasksCompleted, setTasksCompleted] = useState<number>(0);
  const [isClean, setIsClean] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulasi pengambilan GPS Absensi
      const mockGps = "3.5952° N, 98.6722° E (Medan)"; 
      
      const report: DailyEssReport = {
        reportId: `ESS-${Date.now()}`,
        employeeId,
        date: new Date().toISOString(),
        role,
        tasksCompleted,
        isCleanKitchenOrStore: isClean,
        gpsLocation: mockGps
      };

      await hrmService.submitDailyReport(report);
      alert("Laporan Kerja Harian & Absensi GPS berhasil dikirim!");
      
      setTasksCompleted(0);
      setIsClean(false);
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim laporan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-blue-50 min-h-screen">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto mt-4">
        <h1 className="text-xl font-bold mb-1 text-center">PastryFity ESS</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Employee Self Service</p>

        <div className="bg-gray-100 p-4 rounded-xl mb-6 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">ID Karyawan</p>
            <p className="font-bold">{employeeId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Posisi</p>
            <p className="font-bold text-blue-600">{role}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              {role === 'BAKER' ? 'Jumlah Batch Adonan Selesai' : 'Total Transaksi Shift Ini'}
            </label>
            <input 
              type="number" 
              min="0"
              required
              className="w-full p-3 border rounded-xl"
              value={tasksCompleted}
              onChange={e => setTasksCompleted(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center mt-2 p-3 border rounded-xl bg-gray-50">
            <input 
              type="checkbox" 
              id="cleanCheck"
              className="w-5 h-5 mr-3"
              checked={isClean}
              onChange={e => setIsClean(e.target.checked)}
            />
            <label htmlFor="cleanCheck" className="text-sm font-medium">
              Saya menyatakan {role === 'BAKER' ? 'Dapur' : 'Area Kasir'} sudah dibersihkan sebelum tutup shift.
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 mt-4 shadow-md"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Laporan & Absen Tutup Shift'}
          </button>
        </form>
      </div>
    </div>
  );
};
