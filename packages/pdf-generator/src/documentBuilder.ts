// packages/pdf-generator/src/documentBuilder.ts

export interface DocumentTemplate {
  templateId: string;
  title: string;
  layout: 'A4' | 'F4';
  contentBase: string; // Teks HTML atau Markdown dengan variabel
}

export interface EmployeeData {
  nama: string;
  jabatan: string;
  gajiPokok: number;
  bonusKpi: number;
  periode: string;
}

export class DocumentBuilder {
  
  // Mengganti variabel dinamis pada template (Contoh: {nama} menjadi "Andi")
  private compileTemplate(templateContent: string, data: Record<string, any>): string {
    let compiled = templateContent;
    for (const [key, value] = Object.entries(data)) {
      const regex = new RegExp(`{${key}}`, 'g');
      compiled = compiled.replace(regex, value.toString());
    }
    return compiled;
  }

  // Generate Slip Gaji Karyawan dengan e-signature
  async generatePayrollSlip(employee: EmployeeData): Promise<string> {
    const template: DocumentTemplate = {
      templateId: 'TPL-PAYROLL',
      title: 'Slip Gaji Karyawan',
      layout: 'A4',
      contentBase: `
        <h1>PASTRYFITY - SLIP GAJI</h1>
        <p><strong>Periode:</strong> {periode}</p>
        <p><strong>Nama:</strong> {nama}</p>
        <p><strong>Jabatan:</strong> {jabatan}</p>
        <hr/>
        <p>Gaji Pokok: Rp {gajiPokok}</p>
        <p>Bonus Kinerja (KPI): Rp {bonusKpi}</p>
        <p><strong>Total Diterima: Rp {totalDiterima}</strong></p>
        <br/>
        <p><em>[E-Signature & Stempel Digital PASTRYFITY]</em></p>
      `
    };

    const payload = {
      ...employee,
      gajiPokok: employee.gajiPokok.toLocaleString('id-ID'),
      bonusKpi: employee.bonusKpi.toLocaleString('id-ID'),
      totalDiterima: (employee.gajiPokok + employee.bonusKpi).toLocaleString('id-ID')
    };

    const finalHtml = this.compileTemplate(template.contentBase, payload);
    
    // Di lingkungan nyata, baris ini akan memanggil library pembuat PDF (misal: puppeteer / html-pdf)
    console.log(`[PDF-ENGINE] Merendering Dokumen ${template.layout}...`);
    return finalHtml; 
  }
}
