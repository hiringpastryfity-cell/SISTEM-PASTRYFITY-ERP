// apps/pos-terminal/src/services/posService.ts
import { GithubLightweightDB } from '@pastryfity/github-storage';

export interface CartItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  variant?: string; // Size, Flavour, Topping
}

export interface CustomCakeDetails {
  greetingText: string;
  pickupDate: string;
  designNotes: string; // Teks ringkas pengganti foto resolusi tinggi
  isDownPayment: boolean;
}

export interface TransactionPayload {
  transactionId: string;
  cashierId: string;
  timestamp: string;
  items: CartItem[];
  customCake?: CustomCakeDetails;
  totalAmount: number;
  paymentMethod: 'QRIS' | 'CASH' | 'CARD';
}

export class POSService {
  private db: GithubLightweightDB;
  private basePath = 'database/transactions/daily_sales.json';

  constructor(db: GithubLightweightDB) {
    this.db = db;
  }

  // Memproses Checkout & Menyimpan Transaksi
  async processCheckout(
    cashierId: string, 
    items: CartItem[], 
    paymentMethod: 'QRIS' | 'CASH' | 'CARD',
    customCake?: CustomCakeDetails
  ): Promise<TransactionPayload> {
    
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const transactionId = `TRX-${Date.now()}`;
    
    const transaction: TransactionPayload = {
      transactionId,
      cashierId,
      timestamp: new Date().toISOString(),
      items,
      customCake,
      totalAmount,
      paymentMethod
    };

    // Ambil data transaksi hari ini, lalu append transaksi baru
    const { data: currentSales, sha } = await this.db.readData<TransactionPayload[]>(this.basePath);
    const salesList = currentSales || [];
    salesList.push(transaction);

    const success = await this.db.writeData(
      this.basePath,
      salesList,
      `[POS] New transaction: ${transactionId} by ${cashierId}`,
      sha || undefined
    );

    if (!success) {
      throw new Error("Gagal menyimpan transaksi ke sistem pusat.");
    }

    // Mengembalikan data transaksi untuk memicu cetak struk di Thermal Printer
    return transaction;
  }
}
