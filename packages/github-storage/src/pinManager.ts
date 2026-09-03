// packages/github-storage/src/pinManager.ts
import { GithubLightweightDB } from './dbEngine';

interface TenantAuthData {
  tenantId: string;
  email: string;
  role: string;
  securePin: string;
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export class PinManager {
  private db: GithubLightweightDB;
  private basePath = 'database/auth/tenants.json';

  constructor(db: GithubLightweightDB) {
    this.db = db;
  }

  // Generate 6-digit Secure PIN
  private generateSecurePin(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Mendaftarkan Tenant Baru & Generate PIN untuk Super Admin
  async onboardNewTenant(tenantId: string, email: string, role: string) {
    const { data: existingData, sha } = await this.db.readData<TenantAuthData[]>(this.basePath);
    const tenants = existingData || [];

    // Cek apakah tenant sudah ada
    if (tenants.find(t => t.email === email)) {
      throw new Error("Email tenant sudah terdaftar.");
    }

    const newPin = this.generateSecurePin();
    const newTenant: TenantAuthData = {
      tenantId,
      email,
      role,
      securePin: newPin,
      status: 'PENDING_VERIFICATION', // Super Admin harus verifikasi
      createdAt: new Date().toISOString(),
    };

    tenants.push(newTenant);

    const success = await this.db.writeData(
      this.basePath,
      tenants,
      `[AUTH] Onboard new tenant: ${tenantId}`,
      sha || undefined
    );

    if (success) {
      console.log(`PIN generated for ${tenantId}. Dispatching to Super Admin Dashboard...`);
      // Catatan: PIN dikembalikan ke fungsi pemanggil (API) untuk diteruskan ke Master Control
      return newPin; 
    }
    
    throw new Error("Gagal menyimpan data tenant ke GitHub Storage.");
  }
}
