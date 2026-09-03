// apps/tenant-app/src/services/accountingService.ts
import { GithubLightweightDB } from '@pastryfity/github-storage';
import { TransactionPayload } from '../../../pos-terminal/src/services/posService';
import { WasteRecord } from './mrpService';

export interface JournalEntry {
  journalId: string;
  date: string;
  description: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  referenceId: string; // ID Transaksi POS atau ID Waste
}

export class AccountingService {
  private db: GithubLightweightDB;
  private basePath = 'database/finance/journal.json';

  constructor(db: GithubLightweightDB) {
    this.db = db;
  }

  // Auto-Posting dari Transaksi POS Kasir
  async postSalesTransaction(transaction: TransactionPayload, totalHpp: number) {
    const entries: JournalEntry[] = [];
    const date = new Date().toISOString();
    const refId = transaction.transactionId;

    // 1. Mencatat Pendapatan (Kas/Bank bertambah, Pendapatan bertambah)
    entries.push({
      journalId: `JRN-${Date.now()}-1`, date, referenceId: refId,
      description: `Penjualan POS - ${transaction.paymentMethod}`,
      accountCode: transaction.paymentMethod === 'CASH' ? '1-1001' : '1-1002',
      accountName: transaction.paymentMethod === 'CASH' ? 'Kas di Tangan' : 'Kas di Bank (QRIS)',
      debit: transaction.totalAmount, credit: 0
    });
    entries.push({
      journalId: `JRN-${Date.now()}-2`, date, referenceId: refId,
      description: `Pendapatan Penjualan POS`,
      accountCode: '4-1001', accountName: 'Pendapatan Penjualan',
      debit: 0, credit: transaction.totalAmount
    });

    // 2. Mencatat HPP dan Pengurangan Persediaan
    entries.push({
      journalId: `JRN-${Date.now()}-3`, date, referenceId: refId,
      description: `Harga Pokok Penjualan (HPP)`,
      accountCode: '5-1001', accountName: 'Harga Pokok Penjualan',
      debit: totalHpp, credit: 0
    });
    entries.push({
      journalId: `JRN-${Date.now()}-4`, date, referenceId: refId,
      description: `Pengurangan Persediaan Barang Jadi`,
      accountCode: '1-1021', accountName: 'Persediaan Barang Jadi',
      debit: 0, credit: totalHpp
    });

    await this.saveJournalEntries(entries, `[FINANCE] Auto-post Sales ${refId}`);
  }

  // Auto-Posting dari Pencatatan Waste Dapur (Roti Gosong)
  async postWasteLoss(waste: WasteRecord) {
    const entries: JournalEntry[] = [];
    const date = waste.date;
    const refId = waste.recordId;

    // Mencatat Beban Kerugian dan Pengurangan Persediaan
    entries.push({
      journalId: `JRN-${Date.now()}-1`, date, referenceId: refId,
      description: `Kerugian Waste / Defective - ${waste.reason}`,
      accountCode: '5-2001', accountName: 'Beban Kerugian Waste',
      debit: waste.totalLossValue, credit: 0
    });
    entries.push({
      journalId: `JRN-${Date.now()}-2`, date, referenceId: refId,
      description: `Pengurangan Persediaan Barang Jadi (Waste)`,
      accountCode: '1-1021', accountName: 'Persediaan Barang Jadi',
      debit: 0, credit: waste.totalLossValue
    });

    await this.saveJournalEntries(entries, `[FINANCE] Auto-post Waste Loss ${refId}`);
  }

  private async saveJournalEntries(newEntries: JournalEntry[], commitMsg: string) {
    const { data: currentJournal, sha } = await this.db.readData<JournalEntry[]>(this.basePath);
    const journal = currentJournal || [];
    journal.push(...newEntries);

    await this.db.writeData(this.basePath, journal, commitMsg, sha || undefined);
  }

  // Mengambil Buku Besar untuk Laporan Laba/Rugi
  async getGeneralLedger(): Promise<JournalEntry[]> {
    const { data } = await this.db.readData<JournalEntry[]>(this.basePath);
    return data || [];
  }
}
