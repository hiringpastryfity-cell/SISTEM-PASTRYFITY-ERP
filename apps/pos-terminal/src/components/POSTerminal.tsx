// apps/pos-terminal/src/components/POSTerminal.tsx
import React, { useState } from 'react';
import { POSService, CartItem, CustomCakeDetails } from '../services/posService';
import { GithubLightweightDB } from '@pastryfity/github-storage';
// Asumsi print-engine sudah di-setup
// import { ThermalPrinter } from '@pastryfity/print-engine'; 

const db = new GithubLightweightDB({
  owner: 'pastryfity-corp',
  repo: 'pastryfity-data',
  token: process.env.NEXT_PUBLIC_GITHUB_PAT || '', 
});

const posService = new POSService(db);

// Data dummy produk (idealnya ditarik dari db)
const PRODUCT_CATALOG = [
  { sku: 'B001', name: 'Butter Croissant', price: 25000, category: 'Pastry' },
  { sku: 'B002', name: 'Almond Danish', price: 30000, category: 'Pastry' },
  { sku: 'C001', name: 'Signature Tiramisu (Slice)', price: 45000, category: 'Cakes' },
  { sku: 'C002', name: 'Custom Whole Cake', price: 350000, category: 'Cakes' },
];

export const POSTerminal: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCustomCakeForm, setShowCustomCakeForm] = useState(false);
  const [customCakeData, setCustomCakeData] = useState<CustomCakeDetails>({
    greetingText: '', pickupDate: '', designNotes: '', isDownPayment: false
  });

  const addToCart = (product: any) => {
    if (product.sku === 'C002') setShowCustomCakeForm(true);
    
    setCart(prev => {
      const existing = prev.find(item => item.sku === product.sku);
      if (existing) {
        return prev.map(item => item.sku === product.sku 
          ? { ...item, quantity: item.quantity + 1 } 
          : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleCheckout = async (paymentMethod: 'QRIS' | 'CASH') => {
    if (cart.length === 0) return alert("Keranjang kosong!");
    setIsProcessing(true);

    try {
      const transaction = await posService.processCheckout(
        'KASIR_01', 
        cart, 
        paymentMethod,
        showCustomCakeForm ? customCakeData : undefined
      );

      // Trigger Thermal Printer (Mencetak Struk Kasir 58mm/80mm)
      // await ThermalPrinter.printReceipt(transaction);
      
      alert(`Transaksi Berhasil! Struk sedang dicetak.\nID: ${transaction.transactionId}`);
      setCart([]);
      setShowCustomCakeForm(false);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Kiri: Grid Produk (Touchscreen Friendly) */}
      <div className="w-2/3 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">PastryFity POS Terminal</h2>
        <div className="grid grid-cols-3 gap-4">
          {PRODUCT_CATALOG.map(prod => (
            <button 
              key={prod.sku} 
              onClick={() => addToCart(prod)}
              className="p-6 bg-white rounded-xl shadow hover:bg-blue-50 active:bg-blue-100 flex flex-col items-center justify-center h-32"
            >
              <span className="font-semibold text-lg">{prod.name}</span>
              <span className="text-gray-600">Rp {prod.price.toLocaleString('id-ID')}</span>
            </button>
          ))}
        </div>

        {/* Form Custom Cake (Muncul jika produk C002 dipilih) */}
        {showCustomCakeForm && (
          <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <h3 className="font-bold mb-2">Detail Pesanan Custom Cake</h3>
            <input 
              type="text" placeholder="Teks Ucapan (Cth: Happy Bday Andi)" 
              className="block w-full mb-2 p-2 border rounded"
              onChange={(e) => setCustomCakeData({...customCakeData, greetingText: e.target.value})}
            />
            <input 
              type="date" 
              className="block w-full mb-2 p-2 border rounded"
              onChange={(e) => setCustomCakeData({...customCakeData, pickupDate: e.target.value})}
            />
            <textarea 
              placeholder="Catatan Desain Ringan (Hindari foto Hi-Res)" 
              className="block w-full mb-2 p-2 border rounded"
              onChange={(e) => setCustomCakeData({...customCakeData, designNotes: e.target.value})}
            />
          </div>
        )}
      </div>

      {/* Kanan: Panel Keranjang & Checkout */}
      <div className="w-1/3 bg-white shadow-xl p-4 flex flex-col">
        <h2 className="text-xl font-bold border-b pb-2 mb-4">Current Order</h2>
        
        <div className="flex-1 overflow-y-auto">
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between mb-3 p-2 bg-gray-50 rounded">
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-500">{item.quantity}x @ Rp {item.price.toLocaleString('id-ID')}</div>
              </div>
              <div className="font-bold">
                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-xl font-bold mb-6">
            <span>Total:</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleCheckout('CASH')}
              disabled={isProcessing}
              className="bg-green-600 text-white p-4 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
            >
              CASH / TUNAI
            </button>
            <button 
              onClick={() => handleCheckout('QRIS')}
              disabled={isProcessing}
              className="bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              BAYAR QRIS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
