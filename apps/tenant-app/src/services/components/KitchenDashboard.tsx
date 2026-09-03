// apps/tenant-app/src/components/KitchenDashboard.tsx
import React, { useState } from 'react';
import { MRPService } from '../services/mrpService';
import { GithubLightweightDB } from '@pastryfity/github-storage';

const db = new GithubLightweightDB({
  owner: 'pastryfity-corp',
  repo: 'pastryfity-data',
  token: process.env.NEXT_PUBLIC_GITHUB_PAT || '',
});

const mrpService = new MRPService(db);

// Data dummy Resep (Biasanya ditarik dari github-storage database/mrp/recipes.json)
const MASTER_RECIPES = [
  {
    recipeId: 'R-001',
    sku: 'B001',
    name: 'Butter Croissant',
    calculatedHpp: 8500,
    ingredients: [
      { name: 'Tepung Terigu Protein Tinggi', qty: 50, unit: 'Gram' },
      { name: 'French Butter', qty: 25, unit: 'Gram' },
      { name: 'Ragi', qty: 2, unit: 'Gram' }
    ]
  }
];

export const KitchenDashboard: React.FC = () => {
  const [wasteForm, setWasteForm] = useState({ sku: '', qty: 0, reason: 'GOSONG' as any });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteForm.sku || wasteForm.qty <= 0) return alert("Data tidak valid");
    
    setIsSubmitting(true);
    try {
      const record = await mrpService.recordWaste(wasteForm.sku, wasteForm.qty, wasteForm.reason);
      alert(`Waste berhasil dicatat!\nTotal Kerugian: Rp ${record.totalLossValue.toLocaleString('id-ID')}`);
      setWasteForm({ sku: '', qty: 0, reason: 'GOSONG' });
    } catch (error) {
      console.error(error);
      alert("Gagal mencatat waste.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Kitchen & MRP Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel Master Resep (BOM) */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Master Resep (BOM) & HPP</h2>
          {MASTER_RECIPES.map(recipe => (
            <div key={recipe.recipeId} className="mb-4 border p-4 rounded bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{recipe.name}</h3>
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                  HPP: Rp {recipe.calculatedHpp.toLocaleString('id-ID')} / pcs
                </span>
              </div>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing.name}: {ing.qty} {ing.unit}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Panel Defective / Waste Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold border-b pb-2 mb-4 text-red-600">Catat Defective / Waste Roti</h2>
          <form onSubmit={handleWasteSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pilih Produk (SKU)</label>
              <select 
                className="w-full p-2 border rounded"
                value={wasteForm.sku}
                onChange={e => setWasteForm({...wasteForm, sku: e.target.value})}
              >
                <option value="">-- Pilih Produk --</option>
                {MASTER_RECIPES.map(r => (
                  <option key={r.sku} value={r.sku}>{r.name} ({r.sku})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Jumlah Rusak (Pcs)</label>
              <input 
                type="number" 
                min="1"
                className="w-full p-2 border rounded"
                value={wasteForm.qty}
                onChange={e => setWasteForm({...wasteForm, qty: Number(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Alasan</label>
              <select 
                className="w-full p-2 border rounded"
                value={wasteForm.reason}
                onChange={e => setWasteForm({...wasteForm, reason: e.target.value as any})}
              >
                <option value="GOSONG">Roti Gosong (Overbaked)</option>
                <option value="JATUH">Jatuh / Kontaminasi</option>
                <option value="EXPIRED">Kedaluwarsa</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50 mt-2"
            >
              Kirim Laporan Waste
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
