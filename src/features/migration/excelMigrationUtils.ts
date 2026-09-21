import * as XLSX from 'xlsx';
import { Client, Transaction, TeamPayment, TeamMember, Project } from '../../types';

export type MigrationDataType = 'clients' | 'transactions' | 'team_payments' | 'all';

export interface ParseResult<T> {
  valid: T[];
  errors: { row: number; reason: string; data?: any }[];
  totalRows: number;
}

// Generate template workbook with sample data and column descriptions
export function generateExcelTemplate(type: MigrationDataType = 'all'): void {
  const wb = XLSX.utils.book_new();

  if (type === 'clients' || type === 'all') {
    const clientsData = [
      {
        'Nama Klien (Wajib)': 'Rian & Maya',
        'Email': 'rian.maya@gmail.com',
        'Nomor HP / WhatsApp (Wajib)': '081234567890',
        'Tanggal Acara (YYYY-MM-DD)': '2026-11-20',
        'Paket': 'Wedding Platinum Cinematic',
        'Lokasi Acara': 'Grand Ballroom Hotel Aston Serang',
        'Kota / Wilayah': 'Serang, Banten',
        'Total Biaya (IDR)': 15000000,
        'Sudah Dibayar (IDR)': 5000000,
        'Status (Active/Completed/Cancelled/Lead)': 'Active',
        'Status Pembayaran (Paid/Partial/Pending)': 'Partial',
        'Catatan Tambahan': 'Tema adat Sunda modern, butuh 2 videografer & 2 fotografer'
      },
      {
        'Nama Klien (Wajib)': 'Dimas & Anisa',
        'Email': 'dimas.anisa@yahoo.com',
        'Nomor HP / WhatsApp (Wajib)': '085712345678',
        'Tanggal Acara (YYYY-MM-DD)': '2026-12-15',
        'Paket': 'Prewedding Bronze',
        'Lokasi Acara': 'Pantai Anyer',
        'Kota / Wilayah': 'Anyer, Cilegon',
        'Total Biaya (IDR)': 4500000,
        'Sudah Dibayar (IDR)': 4500000,
        'Status (Active/Completed/Cancelled/Lead)': 'Active',
        'Status Pembayaran (Paid/Partial/Pending)': 'Paid',
        'Catatan Tambahan': 'Sesi outdoor sore hari (sunset)'
      }
    ];

    const wsClients = XLSX.utils.json_to_sheet(clientsData);
    // Set auto-width
    wsClients['!cols'] = [
      { wch: 22 }, { wch: 25 }, { wch: 24 }, { wch: 22 },
      { wch: 28 }, { wch: 32 }, { wch: 20 }, { wch: 18 },
      { wch: 18 }, { wch: 20 }, { wch: 22 }, { wch: 40 }
    ];
    XLSX.utils.book_append_sheet(wb, wsClients, 'Data Klien');
  }

  if (type === 'transactions' || type === 'all') {
    const transactionsData = [
      {
        'Tanggal (YYYY-MM-DD)': '2026-09-01',
        'Keterangan / Deskripsi (Wajib)': 'DP Pembayaran Pernikahan Rian & Maya',
        'Tipe (Pemasukan / Pengeluaran) (Wajib)': 'Pemasukan',
        'Nominal (IDR) (Wajib)': 5000000,
        'Kategori': 'Pembayaran Klien',
        'Akun / Rekening': 'BCA Bisnis',
        'Kantong / Pocket': 'Operasional',
        'Nama Klien / Vendor Terkait': 'Rian & Maya',
        'Catatan': 'Transfer via m-Banking BCA'
      },
      {
        'Tanggal (YYYY-MM-DD)': '2026-09-03',
        'Keterangan / Deskripsi (Wajib)': 'Sewa Lensa Sony 70-200mm GM',
        'Tipe (Pemasukan / Pengeluaran) (Wajib)': 'Pengeluaran',
        'Nominal (IDR) (Wajib)': 450000,
        'Kategori': 'Peralatan & Gear',
        'Akun / Rekening': 'Kas Tunai',
        'Kantong / Pocket': 'Gear & Alat',
        'Nama Klien / Vendor Terkait': 'Rental Gear Serang',
        'Catatan': 'Untuk job weekend'
      }
    ];

    const wsTx = XLSX.utils.json_to_sheet(transactionsData);
    wsTx['!cols'] = [
      { wch: 18 }, { wch: 35 }, { wch: 25 }, { wch: 18 },
      { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 25 }, { wch: 30 }
    ];
    XLSX.utils.book_append_sheet(wb, wsTx, 'Data Keuangan Transaksi');
  }

  if (type === 'team_payments' || type === 'all') {
    const teamData = [
      {
        'Nama Anggota Tim / Freelancer (Wajib)': 'Andi Pratama',
        'Peran / Posisi': 'Lead Photographer',
        'Nomor WhatsApp': '081299887766',
        'Nomor Rekening & Bank': 'BCA 1234567890 a.n Andi Pratama',
        'Nama Proyek / Acara': 'Wedding Rian & Maya',
        'Tanggal Tugas (YYYY-MM-DD)': '2026-11-20',
        'Honor / Fee (IDR) (Wajib)': 1200000,
        'Status Bayar (Paid / Unpaid)': 'Unpaid',
        'Tanggal Bayar (Jika Paid)': '',
        'Metode Bayar (Transfer/Cash)': 'Transfer',
        'Catatan': 'Shooting dari akad s.d resepsi'
      },
      {
        'Nama Anggota Tim / Freelancer (Wajib)': 'Budi Santoso',
        'Peran / Posisi': 'Videografer Drone',
        'Nomor WhatsApp': '081377889900',
        'Nomor Rekening & Bank': 'Mandiri 9876543210 a.n Budi S',
        'Nama Proyek / Acara': 'Prewedding Dimas & Anisa',
        'Tanggal Tugas (YYYY-MM-DD)': '2026-12-15',
        'Honor / Fee (IDR) (Wajib)': 750000,
        'Status Bayar (Paid / Unpaid)': 'Paid',
        'Tanggal Bayar (Jika Paid)': '2026-12-16',
        'Metode Bayar (Transfer/Cash)': 'Transfer',
        'Catatan': 'Lunas setelah file drone diserahkan'
      }
    ];

    const wsTeam = XLSX.utils.json_to_sheet(teamData);
    wsTeam['!cols'] = [
      { wch: 28 }, { wch: 20 }, { wch: 20 }, { wch: 30 },
      { wch: 26 }, { wch: 20 }, { wch: 18 }, { wch: 18 },
      { wch: 20 }, { wch: 20 }, { wch: 30 }
    ];
    XLSX.utils.book_append_sheet(wb, wsTeam, 'Keuangan Tim & Honor');
  }

  // Petunjuk Pengisian Sheet
  const guideData = [
    { 'PANDUAN': 'PETUNJUK MIGRASI DARI EXCEL KE SISTEM VENA PICTURES' },
    { 'PANDUAN': '1. Sheet "Data Klien": Digunakan untuk memindahkan daftar klien lama atau calon klien Anda.' },
    { 'PANDUAN': '   - Kolom "Nama Klien" dan "Nomor HP" wajib diisi.' },
    { 'PANDUAN': '   - Kolom Total Biaya & Sudah Dibayar diisi angka tanpa titik/koma simbol mata uang.' },
    { 'PANDUAN': '2. Sheet "Data Keuangan Transaksi": Digunakan untuk mencatat riwayat pemasukan atau pengeluaran kas.' },
    { 'PANDUAN': '   - Kolom "Tipe" isi dengan "Pemasukan" atau "Pengeluaran" (atau Income / Expense).' },
    { 'PANDUAN': '   - Kolom "Nominal" isi hanya angka murni (contoh: 5000000).' },
    { 'PANDUAN': '3. Sheet "Keuangan Tim & Honor": Digunakan untuk mencatat honor freelancer/tim per acara atau proyek.' },
    { 'PANDUAN': '   - Jika anggota tim belum ada di sistem, sistem akan otomatis mendaftarkannya sebagai tim baru.' },
    { 'PANDUAN': '4. Simpan file sebagai .xlsx atau .xls, lalu unggah kembali melalui menu Import Excel di aplikasi.' }
  ];
  const wsGuide = XLSX.utils.json_to_sheet(guideData, { header: ['PANDUAN'] });
  wsGuide['!cols'] = [{ wch: 90 }];
  XLSX.utils.book_append_sheet(wb, wsGuide, 'Petunjuk Pengisian');

  const fileName = type === 'all' ? 'Template_Migrasi_VenaPictures.xlsx' : `Template_${type}_VenaPictures.xlsx`;
  XLSX.writeFile(wb, fileName);
}

// Parse Raw Number or Currency
export function parseRawNumber(val: any): number {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = String(val).replace(/[^\d.-]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

// Standardize Date String to YYYY-MM-DD
export function parseRawDate(val: any): string {
  if (!val) return new Date().toISOString().split('T')[0];
  
  // If Excel serial number date
  if (typeof val === 'number') {
    const d = XLSX.SSF.parse_date_code(val);
    if (d) {
      const month = String(d.m).padStart(2, '0');
      const day = String(d.d).padStart(2, '0');
      return `${d.y}-${month}-${day}`;
    }
  }

  const str = String(val).trim();
  // Check if already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

  // Check DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyyy = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (ddmmyyyy) {
    const day = ddmmyyyy[1].padStart(2, '0');
    const month = ddmmyyyy[2].padStart(2, '0');
    const year = ddmmyyyy[3];
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return new Date().toISOString().split('T')[0];
}

// Parse Clients Sheet
export function parseClientsFromSheet(rows: any[]): ParseResult<Partial<Client>> {
  const valid: Partial<Client>[] = [];
  const errors: { row: number; reason: string; data?: any }[] = [];

  rows.forEach((row, idx) => {
    const rowNum = idx + 2; // considering 1-based index + header
    // Normalize keys (trim and case insensitive matching)
    const normalized: Record<string, any> = {};
    for (const key of Object.keys(row)) {
      normalized[key.trim().toLowerCase()] = row[key];
    }

    const name = 
      normalized['nama klien (wajib)'] || 
      normalized['nama klien'] || 
      normalized['nama'] || 
      normalized['client name'] || 
      normalized['name'];

    if (!name || String(name).trim() === '') {
      errors.push({ row: rowNum, reason: 'Nama Klien kosong atau tidak ditemukan', data: row });
      return;
    }

    const phone = 
      normalized['nomor hp / whatsapp (wajib)'] || 
      normalized['nomor hp'] || 
      normalized['no hp'] || 
      normalized['no whatsapp'] || 
      normalized['whatsapp'] || 
      normalized['phone'] || '';

    const email = normalized['email'] || normalized['alamat email'] || '';
    const weddingDate = parseRawDate(
      normalized['tanggal acara (yyyy-mm-dd)'] || 
      normalized['tanggal acara'] || 
      normalized['tanggal pernikahan'] || 
      normalized['wedding date'] || 
      normalized['tanggal']
    );

    const packageName = normalized['paket'] || normalized['package'] || normalized['nama paket'] || 'Paket Custom';
    const venue = normalized['lokasi acara'] || normalized['lokasi'] || normalized['venue'] || '';
    const city = normalized['kota / wilayah'] || normalized['kota'] || normalized['wilayah'] || normalized['city'] || '';
    
    const totalAmount = parseRawNumber(
      normalized['total biaya (idr)'] || 
      normalized['total biaya'] || 
      normalized['total'] || 
      normalized['harga'] || 
      normalized['amount']
    );

    const paidAmount = parseRawNumber(
      normalized['sudah dibayar (idr)'] || 
      normalized['sudah dibayar'] || 
      normalized['terbayar'] || 
      normalized['paid'] || 0
    );

    let statusRaw = String(normalized['status (active/completed/cancelled/lead)'] || normalized['status'] || 'Active').toLowerCase();
    let status: Client['status'] = 'Active';
    if (statusRaw.includes('complete') || statusRaw.includes('selesai')) status = 'Completed';
    else if (statusRaw.includes('cancel') || statusRaw.includes('batal')) status = 'Cancelled';
    else if (statusRaw.includes('lead') || statusRaw.includes('calon')) status = 'Lead';
    else status = 'Active';

    let paymentStatusRaw = String(normalized['status pembayaran (paid/partial/pending)'] || normalized['status pembayaran'] || '').toLowerCase();
    let paymentStatus: Client['paymentStatus'] = 'Pending';
    if (paymentStatusRaw.includes('paid') || paymentStatusRaw.includes('lunas')) paymentStatus = 'Paid';
    else if (paymentStatusRaw.includes('partial') || paymentStatusRaw.includes('dp') || paidAmount > 0) paymentStatus = (paidAmount >= totalAmount && totalAmount > 0) ? 'Paid' : 'Partial';
    else paymentStatus = 'Pending';

    const notes = normalized['catatan tambahan'] || normalized['catatan'] || normalized['notes'] || '';

    const clientItem: Partial<Client> = {
      id: crypto.randomUUID(),
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      weddingDate,
      packageName: String(packageName).trim(),
      location: venue ? (city ? `${venue}, ${city}` : venue) : (city || ''),
      totalAmount: totalAmount > 0 ? totalAmount : 5000000,
      paidAmount: paidAmount,
      status,
      paymentStatus,
      notes: String(notes).trim(),
      createdAt: new Date().toISOString()
    };

    valid.push(clientItem);
  });

  return { valid, errors, totalRows: rows.length };
}

// Parse Transactions Sheet
export function parseTransactionsFromSheet(rows: any[]): ParseResult<Partial<Transaction>> {
  const valid: Partial<Transaction>[] = [];
  const errors: { row: number; reason: string; data?: any }[] = [];

  rows.forEach((row, idx) => {
    const rowNum = idx + 2;
    const normalized: Record<string, any> = {};
    for (const key of Object.keys(row)) {
      normalized[key.trim().toLowerCase()] = row[key];
    }

    const description = 
      normalized['keterangan / deskripsi (wajib)'] || 
      normalized['keterangan'] || 
      normalized['deskripsi'] || 
      normalized['description'] || 
      normalized['nama transaksi'];

    if (!description || String(description).trim() === '') {
      errors.push({ row: rowNum, reason: 'Keterangan transaksi kosong', data: row });
      return;
    }

    const amount = parseRawNumber(
      normalized['nominal (idr) (wajib)'] || 
      normalized['nominal'] || 
      normalized['jumlah'] || 
      normalized['amount'] || 
      normalized['total']
    );

    if (amount <= 0) {
      errors.push({ row: rowNum, reason: 'Nominal transaksi harus lebih dari 0', data: row });
      return;
    }

    const typeRaw = String(
      normalized['tipe (pemasukan / pengeluaran) (wajib)'] || 
      normalized['tipe'] || 
      normalized['jenis'] || 
      normalized['type'] || 'Pemasukan'
    ).toLowerCase();

    const isExpense = typeRaw.includes('keluar') || typeRaw.includes('expense') || typeRaw.includes('out');
    const type: 'Income' | 'Expense' = isExpense ? 'Expense' : 'Income';

    const date = parseRawDate(
      normalized['tanggal (yyyy-mm-dd)'] || 
      normalized['tanggal'] || 
      normalized['date']
    );

    const category = 
      normalized['kategori'] || 
      normalized['category'] || 
      (isExpense ? 'Operasional' : 'Pembayaran Klien');

    const card = 
      normalized['akun / rekening'] || 
      normalized['rekening'] || 
      normalized['akun'] || 
      normalized['metode'] || 'BCA Bisnis';

    const pocket = 
      normalized['kantong / pocket'] || 
      normalized['kantong'] || 
      normalized['pocket'] || 'Operasional';

    const relatedClient = normalized['nama klien / vendor terkait'] || normalized['klien'] || normalized['vendor'] || '';
    const notes = normalized['catatan'] || normalized['notes'] || '';

    const fullNotes = [relatedClient ? `Pihak Terkait: ${relatedClient}` : '', notes].filter(Boolean).join(' | ');

    const txItem: Partial<Transaction> = {
      id: crypto.randomUUID(),
      date,
      description: String(description).trim(),
      amount,
      type,
      category: String(category).trim(),
      card: String(card).trim(),
      pocket: String(pocket).trim(),
      notes: fullNotes,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    valid.push(txItem);
  });

  return { valid, errors, totalRows: rows.length };
}

// Parse Team Payments Sheet
export interface ParsedTeamPaymentItem {
  teamMemberName: string;
  role: string;
  phone?: string;
  bankAccount?: string;
  projectName?: string;
  eventDate?: string;
  amount: number;
  status: 'Paid' | 'Unpaid';
  paidAt?: string;
  paymentMethod?: string;
  notes?: string;
}

export function parseTeamPaymentsFromSheet(rows: any[]): ParseResult<ParsedTeamPaymentItem> {
  const valid: ParsedTeamPaymentItem[] = [];
  const errors: { row: number; reason: string; data?: any }[] = [];

  rows.forEach((row, idx) => {
    const rowNum = idx + 2;
    const normalized: Record<string, any> = {};
    for (const key of Object.keys(row)) {
      normalized[key.trim().toLowerCase()] = row[key];
    }

    const name = 
      normalized['nama anggota tim / freelancer (wajib)'] || 
      normalized['nama anggota tim'] || 
      normalized['nama tim'] || 
      normalized['nama freelancer'] || 
      normalized['nama'] || 
      normalized['name'];

    if (!name || String(name).trim() === '') {
      errors.push({ row: rowNum, reason: 'Nama Anggota Tim/Freelancer kosong', data: row });
      return;
    }

    const amount = parseRawNumber(
      normalized['honor / fee (idr) (wajib)'] || 
      normalized['honor'] || 
      normalized['fee'] || 
      normalized['nominal'] || 
      normalized['jumlah'] || 
      normalized['amount']
    );

    if (amount <= 0) {
      errors.push({ row: rowNum, reason: 'Honor / Fee harus lebih dari 0', data: row });
      return;
    }

    const role = normalized['peran / posisi'] || normalized['peran'] || normalized['posisi'] || normalized['role'] || 'Photographer';
    const phone = normalized['nomor whatsapp'] || normalized['no whatsapp'] || normalized['hp'] || normalized['phone'] || '';
    const bankAccount = normalized['nomor rekening & bank'] || normalized['rekening'] || normalized['bank'] || '';
    const projectName = normalized['nama proyek / acara'] || normalized['proyek'] || normalized['acara'] || normalized['project'] || 'Event';
    const eventDate = parseRawDate(normalized['tanggal tugas (yyyy-mm-dd)'] || normalized['tanggal tugas'] || normalized['tanggal']);
    
    const statusRaw = String(normalized['status bayar (paid / unpaid)'] || normalized['status bayar'] || normalized['status'] || 'Unpaid').toLowerCase();
    const isPaid = statusRaw.includes('paid') || statusRaw.includes('lunas') || statusRaw.includes('sudah');
    const status: 'Paid' | 'Unpaid' = isPaid ? 'Paid' : 'Unpaid';
    
    const rawPaidAt = normalized['tanggal bayar (jika paid)'] || normalized['tanggal bayar'];
    const paidAt = isPaid ? (rawPaidAt ? parseRawDate(rawPaidAt) : eventDate) : undefined;
    const paymentMethod = normalized['metode bayar (transfer/cash)'] || normalized['metode bayar'] || 'Transfer';
    const notes = normalized['catatan'] || normalized['notes'] || '';

    valid.push({
      teamMemberName: String(name).trim(),
      role: String(role).trim(),
      phone: String(phone).trim(),
      bankAccount: String(bankAccount).trim(),
      projectName: String(projectName).trim(),
      eventDate,
      amount,
      status,
      paidAt,
      paymentMethod: String(paymentMethod).trim(),
      notes: String(notes).trim()
    });
  });

  return { valid, errors, totalRows: rows.length };
}

// Convert an uploaded File (Excel or CSV) to sheet json
export async function readExcelFile(file: File): Promise<{ [sheetName: string]: any[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const result: { [sheetName: string]: any[] } = {};

        workbook.SheetNames.forEach((name) => {
          const sheet = workbook.Sheets[name];
          const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
          result[name] = json;
        });

        resolve(result);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
