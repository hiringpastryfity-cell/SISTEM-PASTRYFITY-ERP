// apps/master-control/src/services/pinCenterService.ts
import { GithubLightweightDB } from '@pastryfity/github-storage';

// Mendefinisikan struktur data sesuai dengan yang ada di storage
export interface TenantAuthData {
  tenantId: string;
  email: string;
  role: string;
  securePin: string;
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export class PinCenterService {
  private db: GithubLightweightDB;
  private basePath = 'database/auth/tenants.json';

  constructor(db: GithubLightweightDB) {
    this.db = db;
  }

  // [R] Mengambil semua tenant yang masih menunggu verifikasi PIN
  async getPendingTenants(): Promise<TenantAuthData[]> {
    const { data } = await this.db.readData<TenantAuthData[]>(this.basePath);
    if (!data) return [];
    
    return data.filter(tenant => tenant.status === 'PENDING_VERIFICATION');
  }

  // [U] Memverifikasi tenant, mengubah status menjadi ACTIVE, dan siap mengirimkan PIN
  async verifyAndDispatchPin(tenantId: string, superAdminEmail: string): Promise<boolean> {
    const { data: tenants, sha } = await this.db.readData<TenantAuthData[]>(this.basePath);
    if (!tenants || !sha) throw new Error("Data tenant tidak ditemukan di storage.");

    const tenantIndex = tenants.findIndex(t => t.tenantId === tenantId);
    if (tenantIndex === -1) throw new Error("Tenant tidak ditemukan.");

    // Update status menjadi ACTIVE
    tenants[tenantIndex].status = 'ACTIVE';

    const success = await this.db.writeData(
      this.basePath,
      tenants,
      `[ADMIN] Verified tenant ${tenantId} by ${superAdminEmail}`,
      sha
    );

    if (success) {
      // Di sistem nyata, ini bisa memicu pengiriman Email/WhatsApp berisi PIN ke tenant
      console.log(`✅ PIN untuk ${tenantId} resmi diotorisasi. Dispatching to user...`);
      return true;
    }

    return false;
  }
}
