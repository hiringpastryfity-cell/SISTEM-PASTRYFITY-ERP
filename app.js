// =====================================================================
// ⚙️ KONFIGURASI DATABASE GITHUB API
// PERINGATAN: Dalam Javascript Vanilla (Browser), token ini dapat dilihat 
// melalui Developer Tools. Pastikan repo db_pastryfity Anda bersifat PRIVATE.
// =====================================================================
const TOKEN_PART_1 = 'github_pat_11CNG6K6A0NJorHn7YfOVg_'; 
const TOKEN_PART_2 = 'BjR5e9e6mS4QBiLBLbckBsPRileloUvB79pgv8NTarVC25UZPW3UbfDyix5'; 
const GITHUB_TOKEN = TOKEN_PART_1 + TOKEN_PART_2; 
const REPO_OWNER = 'hiringpastryfity-cell';         
const REPO_NAME = 'db_pastryfity'; 
const BASE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;

// =====================================================================
// 1. MESIN DATABASE & API WRAPPER
// =====================================================================
async function readFromDB(path) {
    try {
        const response = await fetch(`${BASE_URL}/${path}`, {
            headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' }
        });
        if (response.status === 404) return { data: [], sha: null };
        if (!response.ok) throw new Error(response.statusText);
        
        const fileData = await response.json();
        const content = decodeURIComponent(escape(atob(fileData.content)));
        return { data: JSON.parse(content), sha: fileData.sha };
    } catch (error) {
        console.error("DB Read Error:", error);
        return { data: [], sha: null };
    }
}

async function writeToDB(path, payload, commitMessage, sha) {
    try {
        const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2))));
        const body = { message: commitMessage, content: contentBase64, branch: 'main' };
        if (sha) body.sha = sha;

        const response = await fetch(`${BASE_URL}/${path}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return response.ok;
    } catch (error) {
        console.error("DB Write Error:", error);
        return false;
    }
}

// =====================================================================
// 2. NAVIGASI UI (TABS)
// =====================================================================
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// =====================================================================
// 3. LOGIKA POS TERMINAL KASIR
// =====================================================================
const PRODUCTS = [
    { sku: 'B001', name: 'Butter Croissant', price: 25000 },
    { sku: 'B002', name: 'Almond Danish', price: 30000 },
    { sku: 'C001', name: 'Signature Tiramisu', price: 45000 }
];
let cart = [];

// Render Produk ke Grid
const productGrid = document.getElementById('product-list');
PRODUCTS.forEach(prod => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `<h4>${prod.name}</h4><p>Rp ${prod.price.toLocaleString('id-ID')}</p>`;
    div.onclick = () => addToCart(prod);
    productGrid.appendChild(div);
});

function addToCart(product) {
    const existing = cart.find(item => item.sku === product.sku);
    if (existing) existing.qty++;
    else cart.push({ ...product, qty: 1 });
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        cartList.innerHTML += `<li class="cart-item"><span>${item.name} x${item.qty}</span><span>Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span></li>`;
    });
    document.getElementById('total-price').innerText = total.toLocaleString('id-ID');
}

async function processCheckout() {
    if (cart.length === 0) return alert("Keranjang kosong!");
    
    const transactionData = {
        id: `TRX-${Date.now()}`,
        date: new Date().toISOString(),
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
    };

    alert("Memproses transaksi dan menyimpan ke GitHub...");
    const { data: sales, sha } = await readFromDB('database/transactions/daily_sales.json');
    sales.push(transactionData);
    
    const success = await writeToDB('database/transactions/daily_sales.json', sales, `New POS TRX ${transactionData.id}`, sha);
    if (success) {
        alert("Transaksi Berhasil Disimpan!");
        cart = []; renderCart();
    } else {
        alert("Gagal menyimpan ke database.");
    }
}

// =====================================================================
// 4. LOGIKA KITCHEN & MRP (WASTE)
// =====================================================================
async function submitWaste() {
    const sku = document.getElementById('waste-sku').value;
    const qty = parseInt(document.getElementById('waste-qty').value);
    const reason = document.getElementById('waste-reason').value;

    const wasteData = { id: `WST-${Date.now()}`, date: new Date().toISOString(), sku, qty, reason };

    const { data: logs, sha } = await readFromDB('database/mrp/waste_log.json');
    logs.push(wasteData);
    
    const success = await writeToDB('database/mrp/waste_log.json', logs, `Record Waste ${sku}`, sha);
    alert(success ? "Laporan Waste Berhasil Dicatat!" : "Gagal mencatat waste.");
}

// =====================================================================
// 5. LOGIKA MOBILE ESS
// =====================================================================
async function submitEssReport() {
    const empId = document.getElementById('ess-id').value;
    const tasks = parseInt(document.getElementById('ess-tasks').value);
    const isClean = document.getElementById('ess-clean').checked;

    if(!empId) return alert("Masukkan ID Karyawan!");

    const report = { id: `ESS-${Date.now()}`, date: new Date().toISOString(), empId, tasks, isClean };

    const { data: reports, sha } = await readFromDB('database/hrm/daily_reports.json');
    reports.push(report);
    
    const success = await writeToDB('database/hrm/daily_reports.json', reports, `ESS Report by ${empId}`, sha);
    alert(success ? "Absen & Laporan Shift Berhasil Dikirim!" : "Gagal mengirim laporan.");
}

// =====================================================================
// 6. LOGIKA ACCOUNTING (JURNAL)
// =====================================================================
async function loadJournal() {
    const tbody = document.getElementById('journal-table-body');
    tbody.innerHTML = '<tr><td colspan="5">Memuat data dari GitHub...</td></tr>';
    
    const { data } = await readFromDB('database/finance/journal.json');
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Belum ada jurnal transaksi.</td></tr>';
        return;
    }

    data.forEach(jurnal => {
        tbody.innerHTML += `
            <tr>
                <td>${new Date(jurnal.date || Date.now()).toLocaleDateString('id-ID')}</td>
                <td>${jurnal.accountCode || '-'}</td>
                <td>${jurnal.description || '-'}</td>
                <td>${jurnal.debit ? jurnal.debit.toLocaleString('id-ID') : '-'}</td>
                <td>${jurnal.credit ? jurnal.credit.toLocaleString('id-ID') : '-'}</td>
            </tr>
        `;
    });
}
