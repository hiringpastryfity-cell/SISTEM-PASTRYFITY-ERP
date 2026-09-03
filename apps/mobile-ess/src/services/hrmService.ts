// apps/mobile-ess/src/services/hrmService.ts
import { GithubLightweightDB } from '@pastryfity/github-storage';

export interface DailyEssReport {
  reportId: string;
  employeeId: string;
  date: string;
  role: 'BAKER' | 'KASIR';
  tasksCompleted: number; // Jumlah batch adonan atau transaksi
  isCleanKitchenOrStore: boolean;
  gpsLocation: string;
}

export class HRMService {
  private db: GithubLightweightDB;

  constructor(db: GithubLightweightDB) {
    this.db = db;
  }

  // Karyawan mengirimkan Laporan Harian & Absensi GPS
  async submitDailyReport(report: DailyEssReport) {
    const { data: currentReports, sha } = await this.db.readData<DailyEssReport[]>('database/hrm/daily_reports.json');
    const reportsList = currentReports || [];
    
    reportsList.push(report);

    await this.db.writeData(
      'database/hrm/daily_reports.json',
      reportsList,
      `[HRM] Daily ESS Report submitted by ${report.employeeId}`,
      sha || undefined
    );
    
    return true;
  }

  // Mesin KPI Otomatis
  calculateKPI(role: 'BAKER' | 'KASIR', performanceMetrics: any): number {
    let finalKpi = 0;

    if (role === 'BAKER') {
      // KPI Baker = 40% Ketepatan Baking + 40% Efisiensi Waste + 20% Laporan Harian ESS
      const bakingScore = performanceMetrics.bakingAccuracy * 0.40;
      const wasteScore = performanceMetrics.wasteEfficiency * 0.40;
      const essScore = performanceMetrics.essCompleteness * 0.20;
      finalKpi = bakingScore + wasteScore + essScore;
    } 
    else if (role === 'KASIR') {
      // KPI Kasir = 50% Omzet POS + 30% Akurasi Kasir + 20% Laporan Harian ESS
      const omzetScore = performanceMetrics.posOmzetTarget * 0.50;
      const accuracyScore = performanceMetrics.cashierAccuracy * 0.30;
      const essScore = performanceMetrics.essCompleteness * 0.20;
      finalKpi = omzetScore + accuracyScore + essScore;
    }

    return Math.min(finalKpi, 100); // Maksimal 100
  }
}
