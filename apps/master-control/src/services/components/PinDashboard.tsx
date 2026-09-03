// apps/master-control/src/components/PinDashboard.tsx
import React, { useEffect, useState } from 'react';
import { PinCenterService, TenantAuthData } from '../services/pinCenterService';
import { GithubLightweightDB } from '@pastryfity/github-storage';

// Inisialisasi DB (idealnya token diambil dari environment variables yang aman)
const db = new GithubLightweightDB({
  owner: 'pastryfity-corp',
  repo: 'pastryfity-data',
  token: process.env.NEXT_PUBLIC_GITHUB_PAT || '', 
});

const pinService = new PinCenterService(db);

export const PinDashboard: React.FC = () => {
  const [pendingTenants, setPendingTenants] = useState<TenantAuthData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPending = async () => {
    setLoading(true);
    const data = await pinService.getPendingTenants();
    setPendingTenants(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleVerify = async (tenantId: string) => {
    try {
      const success = await pinService.verifyAndDispatchPin(tenantId, 'superadmin@pastryfity.com');
      if (success) {
        alert(`Tenant ${tenantId} berhasil diverifikasi. PIN telah dikirim!`);
        fetchPending(); // Refresh data
      }
    } catch (error) {
      console.error(error);
      alert("Gagal memverifikasi tenant.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Master Control - PIN Center</h1>
      
      {loading ? (
        <p>Memuat data antrean PIN...</p>
      ) : pendingTenants.length === 0 ? (
        <p>Tidak ada pendaftaran cabang/tenant baru saat ini.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID Tenant</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Secure PIN</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pendingTenants.map((tenant) => (
                <tr key={tenant.tenantId} className="border-b">
                  <td className="py-3 px-4">{tenant.tenantId}</td>
                  <td className="py-3 px-4">{tenant.email}</td>
                  <td className="py-3 px-4">{tenant.role}</td>
                  <td className="py-3 px-4 font-mono font-bold text-red-600">
                    {tenant.securePin} {/* Super Admin melihat PIN secara real-time */}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => handleVerify(tenant.tenantId)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Verifikasi & Dispatch PIN
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
