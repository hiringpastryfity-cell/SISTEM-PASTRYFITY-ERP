// apps/pos-terminal/src/services/posService.ts

// Cukup import 'db' yang sudah diinisialisasi
import { db } from '@pastryfity/github-storage/src/dbInstance';

export class POSService {
  // Tidak perlu lagi memanggil token disini
  
  async processCheckout(transactionData) {
    // Langsung gunakan db.writeData atau db.readData
    await db.writeData('database/transactions/daily_sales.json', transactionData, 'New TRX');
  }
}
