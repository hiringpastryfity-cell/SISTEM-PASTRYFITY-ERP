// =====================================================================
// KONFIGURASI DATABASE GITHUB API
// =====================================================================
const TOKEN 1 = 'github_pat_11CNG6K6A0ORL74PLGnTwq_'; 
const TOKEN 2 = 'ZrPTkOn9oPjLwGOofS4ndm0DctfNFVomc10LfeYuFUoA33KEPSZhznOPr4S'; 
const REPO_OWNER = 'hiringpastryfity-cell';         
const REPO_NAME = 'db_pastryfity'; 
const BASE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;

// =====================================================================
// STRUKTUR DATA SEMUA FITUR (DARI 9 GAMBAR ACCURATE)
// =====================================================================
const systemModules = [
    {
        id: "perusahaan", title: "Perusahaan & HR", icon: "fa-building",
        features: [
            { name: "Absensi (ESS)", icon: "fa-fingerprint", color: "var(--ios-blue)", action: "modal:modal-absensi" },
            { name: "Pajak", icon: "fa-file-invoice-dollar", color: "var(--ios-teal)" },
            { name: "Syarat Pembayaran", icon: "fa-handshake", color: "var(--ios-teal)" },
            { name: "Pengiriman", icon: "fa-truck", color: "var(--ios-teal)" },
            { name: "FOB", icon: "fa-anchor", color: "var(--ios-teal)" },
            { name: "Gaji / Tunjangan", icon: "fa-money-check", color: "var(--ios-teal)" },
            { name: "Karyawan", icon: "fa-users", color: "var(--ios-teal)" },
            { name: "Transaksi Berulang", icon: "fa-sync", color: "var(--ios-green)" },
            { name: "Proses Akhir Bulan", icon: "fa-calendar-check", color: "var(--ios-green)" },
            { name: "Kontak", icon: "fa-address-book", color: "var(--ios-purple)" },
            { name: "Transaksi Favorit", icon: "fa-star", color: "var(--ios-purple)" },
            { name: "Kalender", icon: "fa-calendar-alt", color: "var(--ios-purple)" },
            { name: "Log Aktifitas", icon: "fa-history", color: "var(--ios-purple)" }
        ]
    },
    {
        id: "persediaan", title: "Persediaan", icon: "fa-warehouse",
        features: [
            { name: "Permintaan Barang", icon: "fa-clipboard-list", color: "var(--ios-green)" },
            { name: "Pemindahan Barang", icon: "fa-truck-loading", color: "var(--ios-green)" },
            { name: "Penyesuaian (Waste)", icon: "fa-exclamation-triangle", color: "var(--ios-green)", action: "modal:modal-waste" },
            { name: "Pekerjaan Pesanan", icon: "fa-tasks", color: "var(--ios-green)" },
            { name: "Penambahan Bahan", icon: "fa-plus-circle", color: "var(--ios-green)" },
            { name: "Penyelesaian Pesanan", icon: "fa-check-circle", color: "var(--ios-green)" },
            { name: "Perintah Stok Opname", icon: "fa-clipboard-check", color: "var(--ios-green)" },
            { name: "Hasil Stok Opname", icon: "fa-check-square", color: "var(--ios-green)" },
            { name: "Barang & Jasa", icon: "fa-box", color: "var(--ios-blue)" },
            { name: "Gudang", icon: "fa-store-alt", color: "var(--ios-blue)" },
            { name: "Satuan Barang", icon: "fa-balance-scale", color: "var(--ios-blue)" },
            { name: "Kategori Barang", icon: "fa-tags", color: "var(--ios-blue)" },
            { name: "Merek Barang", icon: "fa-copyright", color: "var(--ios-blue)" },
            { name: "Pemenuhan Pesanan", icon: "fa-box-open", color: "var(--ios-purple)" },
            { name: "Barang per Gudang", icon: "fa-pallet", color: "var(--ios-purple)" },
            { name: "Stok Minimum", icon: "fa-battery-quarter", color: "var(--ios-purple)" }
        ]
    },
    {
        id: "bukubesar", title: "Buku Besar", icon: "fa-book",
        features: [
            { name: "Akun Perkiraan", icon: "fa-file-invoice", color: "var(--ios-blue)" },
            { name: "Pencatatan Beban", icon: "fa-receipt", color: "var(--ios-green)" },
            { name: "Pencatatan Gaji", icon: "fa-money-bill-wave", color: "var(--ios-green)" },
            { name: "Jurnal Umum", icon: "fa-book-open", color: "var(--ios-green)" },
            { name: "Monitor Anggaran", icon: "fa-chart-line", color: "var(--ios-purple)" },
            { name: "Transfer Anggaran", icon: "fa-exchange-alt", color: "var(--ios-green)" },
            { name: "Anggaran", icon: "fa-chart-pie", color: "var(--ios-orange)" },
            { name: "Histori Akun", icon: "fa-history", color: "var(--ios-purple)" },
            { name: "Log Aktifitas Jurnal", icon: "fa-list-ul", color: "var(--ios-purple)" }
        ]
    },
    {
        id: "pengaturan", title: "Pengaturan", icon: "fa-cog",
        features: [
            { name: "Preferensi", icon: "fa-cogs", color: "var(--ios-orange)" },
            { name: "Akses Grup", icon: "fa-users-cog", color: "var(--ios-orange)" },
            { name: "Pengguna", icon: "fa-user", color: "var(--ios-orange)" },
            { name: "Penomoran", icon: "fa-sort-numeric-up", color: "var(--ios-orange)" },
            { name: "Desain Cetakan", icon: "fa-print", color: "var(--ios-orange)" },
            { name: "Accurate Store", icon: "fa-store", color: "var(--ios-orange)" }
        ]
    },
    {
        id: "pembelian", title: "Pembelian", icon: "fa-shopping-cart",
        features: [
            { name: "Pesanan Pembelian", icon: "fa-file-contract", color: "var(--ios-green)" },
            { name: "Penerimaan Barang", icon: "fa-box-open", color: "var(--ios-green)" },
            { name: "Uang Muka", icon: "fa-money-bill", color: "var(--ios-green)" },
            { name: "Faktur Pembelian", icon: "fa-file-invoice", color: "var(--ios-green)" },
            { name: "Pembayaran", icon: "fa-wallet", color: "var(--ios-green)" },
            { name: "Retur Pembelian", icon: "fa-undo", color: "var(--ios-green)" },
            { name: "Harga Pemasok", icon: "fa-tags", color: "var(--ios-orange)" },
            { name: "Kategori Pemasok", icon: "fa-sitemap", color: "var(--ios-blue)" },
            { name: "Pemasok", icon: "fa-user-tie", color: "var(--ios-blue)" },
            { name: "Perintah Pembayaran", icon: "fa-file-signature", color: "var(--ios-green)" },
            { name: "Transfer Pemasok", icon: "fa-exchange-alt", color: "var(--ios-purple)" }
        ]
    },
    {
        id: "penjualan", title: "Penjualan", icon: "fa-cash-register",
        features: [
            { name: "Penawaran", icon: "fa-handshake", color: "var(--ios-green)" },
            { name: "Pesanan Penjualan", icon: "fa-shopping-basket", color: "var(--ios-green)" },
            { name: "Pengiriman", icon: "fa-truck", color: "var(--ios-green)" },
            { name: "Uang Muka", icon: "fa-money-bill", color: "var(--ios-green)" },
            { name: "Faktur (POS Terminal)", icon: "fa-receipt", color: "var(--ios-green)", action: "action:faktur-pos" },
            { name: "Penerimaan", icon: "fa-hand-holding-usd", color: "var(--ios-green)" },
            { name: "Retur Penjualan", icon: "fa-undo", color: "var(--ios-green)" },
            { name: "Kategori Pelanggan", icon: "fa-users", color: "var(--ios-blue)" },
            { name: "Kategori Penjualan", icon: "fa-tags", color: "var(--ios-blue)" },
            { name: "Pelanggan", icon: "fa-user-friends", color: "var(--ios-blue)" },
            { name: "Harga/Diskon", icon: "fa-percent", color: "var(--ios-orange)" },
            { name: "Komisi Penjual", icon: "fa-user-tag", color: "var(--ios-orange)" },
            { name: "Target Penjualan", icon: "fa-bullseye", color: "var(--ios-red)" },
            { name: "SmartLink e-Com", icon: "fa-store", color: "var(--ios-orange)" },
            { name: "Check In", icon: "fa-map-marker-alt", color: "var(--ios-purple)" }
        ]
    },
    {
        id: "aset", title: "Aset Tetap", icon: "fa-building",
        features: [
            { name: "Aset Tetap", icon: "fa-chair", color: "var(--ios-blue)" },
            { name: "Kategori Aset", icon: "fa-tags", color: "var(--ios-blue)" },
            { name: "Kategori Aset Pajak", icon: "fa-landmark", color: "var(--ios-blue)" },
            { name: "Perubahan Aset", icon: "fa-edit", color: "var(--ios-green)" },
            { name: "Disposisi Aset", icon: "fa-trash", color: "var(--ios-green)" },
            { name: "Pindah Aset", icon: "fa-dolly", color: "var(--ios-green)" },
            { name: "Aset per Lokasi", icon: "fa-map-marker-alt", color: "var(--ios-purple)" }
        ]
    },
    {
        id: "kasbank", title: "Kas & Bank", icon: "fa-wallet",
        features: [
            { name: "Pembayaran", icon: "fa-money-bill-wave", color: "var(--ios-green)" },
            { name: "Penerimaan", icon: "fa-hand-holding-usd", color: "var(--ios-green)" },
            { name: "Transfer Bank", icon: "fa-university", color: "var(--ios-green)" },
            { name: "SmartLink e-Banking", icon: "fa-laptop-house", color: "var(--ios-blue)" },
            { name: "Rekening Koran", icon: "fa-file-invoice", color: "var(--ios-blue)" },
            { name: "Histori Bank", icon: "fa-history", color: "var(--ios-purple)" },
            { name: "Rekonsiliasi Bank", icon: "fa-check-double", color: "var(--ios-purple)" },
            { name: "SmartLink VA", icon: "fa-credit-card", color: "var(--ios-purple)" },
            { name: "SmartLink e-Payment", icon: "fa-mobile-alt", color: "var(--ios-purple)" }
        ]
    },
    {
        id: "laporan", title: "Daftar Laporan", icon: "fa-chart-bar",
        features: [
            { name: "Daftar Laporan", icon: "fa-chart-line", color: "var(--ios-purple)" },
            { name: "SPT PPN / PPNBM", icon: "fa-file-alt", color: "var(--ios-purple)" },
            { name: "Analisa AI", icon: "fa-robot", color: "var(--ios-purple)" }
        ]
    }
];

// =====================================================================
// GENERATOR UI OTOMATIS (Membangun HTML via JS)
// =====================================================================
function buildUI() {
    const navContainer = document.getElementById('sidebar-nav');
    const moduleContainer = document.getElementById('module-container');

    systemModules.forEach((mod, index) => {
        // Buat Tombol Sidebar
        const btn = document.createElement('button');
        btn.className = `nav-item ${index === 0 ? 'active' : ''}`;
        btn.innerHTML = `<i class="fas ${mod.icon}"></i> ${mod.title}`;
        btn.onclick = (e) => openModule(mod.id, e.currentTarget);
        navContainer.appendChild(btn);

        // Buat Seksi Modul
        const section = document.createElement('div');
        section.id = `mod-${mod.id}`;
        section.className = `module-section ${index === 0 ? 'active' : ''}`;
        
        let gridHTML = `<h2 class="module-title">${mod.title}</h2><div class="ios-grid">`;
        
        // Buat Grid Fitur di dalam Modul
        mod.features.forEach(feat => {
            const actionStr = feat.action ? `onclick="handleAction('${feat.action}', '${feat.name}')"` : `onclick="showToast('Memuat modul ${feat.name}...', 'info')"`;
            gridHTML += `
                <div class="ios-widget" ${actionStr}>
                    <div class="widget-icon" style="background: ${feat.color};">
                        <i class="fas ${feat.icon}"></i>
                    </div>
                    <span>${feat.name}</span>
                </div>
            `;
        });
        
        gridHTML += `</div>`;
        section.innerHTML = gridHTML;
        moduleContainer.appendChild(section);
    });
}

// =====================================================================
// INTERAKSI UI (NAVIGASI & MODAL & TOAST)
// =====================================================================
function openModule(moduleId, btnElement) {
    document.querySelectorAll('.module-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`mod-${moduleId}`).classList.add('active');
    btnElement.classList.add('active');
}

function handleAction(actionCode, name) {
    if(actionCode.startsWith('modal:')) {
        const modalId = actionCode.split(':')[1];
        document.getElementById(modalId).classList.add('active');
    } else if (actionCode === 'action:faktur-pos') {
        showToast("POS Terminal: Menyimpan Faktur Dummy...", "info");
        // Simulasi hit API Faktur
        setTimeout(() => showToast("Faktur POS TR-001 Berhasil Dibuat!", "success"), 1500);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

let toastTimeout;
function showToast(message, type = 'info') {
    const toast = document.getElementById('ios-toast');
    const msg = document.getElementById('toast-msg');
    
    toast.className = `ios-toast toast-${type} show`;
    msg.innerText = message;
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// =====================================================================
// LOGIKA DATABASE GITHUB
// =====================================================================
async function writeToDB(path, payload, commitMessage) {
    try {
        const getRes = await fetch(`${BASE_URL}/${path}`, { headers: { 'Authorization': `Bearer ${TOKEN}` } });
        let sha = null, currentData = [];
        if (getRes.ok) {
            const fileData = await getRes.json();
            sha = fileData.sha;
            currentData = JSON.parse(decodeURIComponent(escape(atob(fileData.content))));
        }
        currentData.push(payload);
        
        const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(currentData, null, 2))));
        const body = { message: commitMessage, content: contentBase64, branch: 'main' };
        if (sha) body.sha = sha;

        const putRes = await fetch(`${BASE_URL}/${path}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return putRes.ok;
    } catch (error) {
        console.error(error); return false;
    }
}

// Fitur Fungsional
async function submitAbsensi() {
    const empId = document.getElementById('absen-id').value;
    if(!empId) return showToast("ID Karyawan wajib diisi!", "error");

    showToast("Merekam data...", "info");
    const data = { id: `ABS-${Date.now()}`, empId, type: document.getElementById('absen-tipe').value, date: new Date().toISOString() };
    
    const success = await writeToDB('database/hrm/absensi.json', data, `Absen ${empId}`);
    if(success) {
        showToast("Presensi berhasil direkam!", "success");
        closeModal('modal-absensi');
    } else {
        showToast("Gagal menyambung ke server.", "error");
    }
}

async function submitWaste() {
    const sku = document.getElementById('waste-sku').value;
    showToast("Memproses data...", "info");
    const data = { id: `WST-${Date.now()}`, sku, qty: document.getElementById('waste-qty').value, date: new Date().toISOString() };
    
    const success = await writeToDB('database/mrp/waste_log.json', data, `Waste ${sku}`);
    if(success) {
        showToast("Waste berhasil dicatat!", "success");
        closeModal('modal-waste');
    }
}

// Inisialisasi saat web dimuat
window.onload = buildUI;
