// apps/tenant-app/src/services/mrpService.ts
import { GithubLightweightDB } from '@pastryfity/github-storage';

export interface RawMaterial {
  materialId: string;
  name: string;
  unit: 'Gram' | 'Ml' | 'Pcs';
  costPerUnit: number; // Harga per satuan terkecil
}

export interface RecipeIngredient {
  materialId: string;
  quantityNeeded: number; // Presisi Gram/Ml
}

export interface MasterRecipe {
  recipeId: string;
  sku: string; // Terhubung ke POS
  name: string;
  ingredients: RecipeIngredient[];
  calculatedHpp: number; // HPP per porsi/pcs
}

export interface WasteRecord {
  recordId: string;
  date: string;
  sku: string;
  quantityDamaged: number;
  reason: 'GOSONG' | 'JATUH' | 'EXPIRED';
  totalLossValue: number; // Kuantitas * Calculated HPP
}

export class MRPService {
  private db: GithubLightweightDB;
  
  constructor(db: GithubLightweightDB) {
    this.db = db;
  }

  // Kalkulasi HPP otomatis berdasarkan harga bahan baku terbaru
  async calculateHPP(ingredients: RecipeIngredient[]): Promise<number> {
    const { data: materials } = await this.db.readData<RawMaterial[]>('database/wms/materials.json');
    if (!materials) return 0;

    let totalCost = 0;
    for (const item of ingredients) {
      const material = materials.find(m => m.materialId === item.materialId);
      if (material) {
        totalCost += material.costPerUnit * item.quantityNeeded;
      }
    }
    return totalCost;
  }

  // Pencatatan Waste / Defective Roti memotong stok dan membukukan kerugian
  async recordWaste(sku: string, quantityDamaged: number, reason: WasteRecord['reason']) {
    const { data: recipes } = await this.db.readData<MasterRecipe[]>('database/mrp/recipes.json');
    const recipe = recipes?.find(r => r.sku === sku);
    
    if (!recipe) throw new Error("Resep tidak ditemukan untuk SKU ini.");

    const lossValue = recipe.calculatedHpp * quantityDamaged;

    const wasteRecord: WasteRecord = {
      recordId: `WST-${Date.now()}`,
      date: new Date().toISOString(),
      sku,
      quantityDamaged,
      reason,
      totalLossValue: lossValue
    };

    // Simpan ke storage (nantinya akan di-listen oleh Modul Akuntansi)
    const { data: currentWaste, sha } = await this.db.readData<WasteRecord[]>('database/mrp/waste_log.json');
    const wasteList = currentWaste || [];
    wasteList.push(wasteRecord);

    await this.db.writeData(
      'database/mrp/waste_log.json',
      wasteList,
      `[MRP] Recorded waste for ${sku} - Loss: Rp${lossValue}`,
      sha || undefined
    );

    return wasteRecord;
  }
}
