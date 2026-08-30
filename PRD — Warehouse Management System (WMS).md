# PRD — Warehouse Management System (WMS)

**Versi:** 1.0 (Draft untuk review) · **Tanggal:** 22 November 2026 · **Pemilik:** Product Management · **Status:** In Review

> Catatan: angka baseline dan target dalam dokumen ini adalah hipotesis awal untuk bahan diskusi. Seluruhnya harus divalidasi dengan data operasional aktual sebelum PRD dikunci.

## 1. Ringkasan Eksekutif

Warehouse Management System (WMS) adalah platform terpusat untuk mengelola seluruh aktivitas gudang: penerimaan barang (inbound), penyimpanan, manajemen stok, pengambilan dan pengemasan pesanan (outbound), pengiriman, hingga retur. WMS memberikan visibilitas stok real-time sampai level lokasi, lot, dan serial, mengarahkan pekerjaan operator lewat perangkat mobile berbasis scan barcode, serta terintegrasi dengan ERP, OMS, marketplace, dan kurir.

Produk ini ditujukan bagi perusahaan ritel/e-commerce, distributor, manufaktur, dan penyedia jasa logistik pihak ketiga (3PL) di Indonesia yang memiliki satu atau lebih gudang dan saat ini masih mengandalkan spreadsheet, dokumen kertas, atau modul inventori ERP yang tidak cukup granular.

| Aspek | Ringkasan |
| --- | --- |
| Visi | Setiap barang di gudang selalu diketahui keberadaan, kondisi, dan statusnya; setiap pesanan keluar tepat, cepat, dan akurat. |
| Pengguna utama | Operator gudang, supervisor, manajer gudang, inventory controller, planner, admin master data, dan klien 3PL |
| Platform | Web app (back-office dan dashboard), aplikasi mobile Android untuk scanning/RF (handheld dan smartphone), REST API dan webhook |
| Model | Multi-gudang, multi-perusahaan (multi-tenant), multi-bahasa (ID/EN), multi-UoM |
| Rilis | Fase 1 (MVP), Fase 2 (optimasi dan perluasan), Fase 3 (otomasi dan kecerdasan) |

## 2. Latar Belakang dan Problem Statement

Pertumbuhan e-commerce, ekspektasi pengiriman same-day/next-day, serta tekanan margin membuat gudang menjadi titik kritis rantai pasok. Proses manual tidak lagi mampu mengimbangi volume, variasi SKU, dan SLA marketplace.

| # | Masalah saat ini | Dampak bisnis |
| --- | --- | --- |
| 1 | Stok dicatat di spreadsheet/ERP tanpa level lokasi dan lot; selisih stok sering terjadi | Overselling, stock-out, penjualan hilang, kepercayaan pelanggan turun |
| 2 | Picking dan packing berbasis kertas atau ingatan operator | Salah ambil, salah kirim, retur tinggi, waktu proses lama |
| 3 | Putaway tanpa aturan; barang diletakkan di lokasi kosong terdekat | Barang sulit dicari, ruang tidak optimal, waktu cari barang tinggi |
| 4 | Tidak ada kontrol FEFO, batch, dan expiry | Barang kedaluwarsa, write-off, risiko kepatuhan (makanan, farmasi, kosmetik) |
| 5 | Lonjakan pesanan (11.11, 12.12, Ramadan, Harbolnas) tidak tertangani | SLA marketplace terlewat, penalti, rating toko turun |
| 6 | Tidak ada visibilitas lintas gudang dan lintas channel | Alokasi stok tidak optimal, transfer antar gudang terlambat |
| 7 | Proses retur manual dan tidak terlacak | Barang layak jual tertahan, refund lambat, risiko fraud retur |
| 8 | Tidak ada data produktivitas dan audit trail | Kinerja sulit dikelola, kehilangan/fraud sulit dilacak |

**Peluang:** WMS yang mudah dipakai operator (minim pelatihan), cepat diimplementasikan, dan terhubung dengan ekosistem lokal (marketplace, kurir, ERP) dapat menurunkan biaya operasional gudang secara signifikan sekaligus meningkatkan kepuasan pelanggan akhir.

## 3. Tujuan dan Success Metrics

### 3.1 Tujuan Produk

1. Akurasi dan visibilitas stok real-time sampai level lokasi, lot, dan serial.
2. Mempercepat dan menyederhanakan proses inbound, outbound, dan retur melalui kerja terarah (directed work) berbasis scan.
3. Mengurangi kesalahan manusia dan kebutuhan pelatihan lewat validasi, aturan bisnis, dan UX yang jelas.
4. Skalabel menghadapi peak season tanpa penambahan proporsional tenaga kerja.
5. Terintegrasi mulus dengan ERP, OMS, marketplace, kurir, dan perangkat keras gudang.
6. Traceability penuh dan audit trail untuk kepatuhan dan investigasi.

### 3.2 Key Performance Indicators

| KPI | Definisi | Baseline (hipotesis) | Target 6 bulan | Target 12 bulan |
| --- | --- | --- | --- | --- |
| Inventory Record Accuracy | Persentase lokasi/SKU yang cocok antara sistem dan fisik | 92–95% | ≥ 98,5% | ≥ 99,5% |
| Order Accuracy | Pesanan terkirim tanpa kesalahan item/qty | 97% | ≥ 99,5% | ≥ 99,8% |
| Dock-to-Stock Time | Waktu dari barang tiba sampai siap dijual | 24 jam | ≤ 8 jam | ≤ 4 jam |
| Order Cycle Time | Waktu dari order dirilis ke gudang sampai siap kirim | 6 jam | ≤ 3 jam | ≤ 2 jam |
| Pick Productivity | Order line per jam per picker | Diukur saat discovery | +30% | +45% |
| On-Time Shipping | Pesanan diserahkan ke kurir sebelum cut-off | 90% | ≥ 97% | ≥ 99% |
| Expired/Obsolete Write-off | Nilai barang kedaluwarsa/usang per bulan | Diukur saat discovery | −40% | −60% |
| Scan Adoption | Transaksi gudang yang dilakukan via scan | 0–30% | ≥ 90% | ≥ 98% |
| Space Utilization | Persentase kapasitas lokasi terpakai | 60–65% | ≥ 75% | ≥ 80% |
| Cycle Count Coverage | SKU kelas A yang dihitung minimal 1x per bulan | Tidak ada | 100% | 100% |
| Waktu Onboarding Operator | Waktu operator baru sampai produktif | 2 minggu | ≤ 3 hari | ≤ 2 hari |

### 3.3 Guardrail Metrics

- Ketersediaan sistem ≥ 99,9% per bulan (jam operasional gudang).
- Respons scan di mobile: p95 < 1 detik.
- Tingkat error transaksi sistem < 0,1%.
- Skor kepuasan operator (survei internal) ≥ 40 NPS.
- Tidak ada peningkatan insiden keselamatan kerja akibat perubahan alur kerja.

## 4. Non-Goals (Di Luar Cakupan)

- Bukan ERP atau sistem akuntansi penuh (general ledger, AP/AR, perpajakan). WMS hanya mengirim data transaksi dan valuasi dasar.
- Bukan TMS penuh (optimasi rute last-mile, manajemen armada). Cakupan terbatas pada integrasi kurir, manifest, dan resi.
- Bukan modul procurement/purchasing dan perencanaan produksi (MRP).
- Kendali langsung peralatan otomasi (WCS untuk AS/RS, sorter, AMR) tidak dibangun pada Fase 1 dan 2; disediakan API-ready pada Fase 3.
- Marketplace/storefront dan manajemen katalog penjualan tidak termasuk.

## 5. Persona Pengguna

| Persona | Peran | Kebutuhan utama | Pain point | Perangkat |
| --- | --- | --- | --- | --- |
| Warehouse Manager | Bertanggung jawab atas seluruh operasi gudang | Dashboard KPI, kontrol SLA, visibilitas kapasitas dan tenaga kerja | Data terlambat, sulit memprediksi beban kerja | Web, tablet |
| Supervisor / Team Leader | Mengatur shift dan tugas harian | Assignment tugas, pemantauan progres real-time, penanganan eksepsi | Distribusi kerja tidak merata, eksepsi terlambat diketahui | Web, tablet |
| Receiving Clerk | Menerima dan memeriksa barang masuk | Panduan receiving, scan cepat, pencatatan selisih | Dokumen tidak cocok, input manual | Handheld |
| Picker / Putaway Operator | Mengambil dan menyimpan barang | Instruksi jelas, rute efisien, validasi scan | Salah ambil, jalan bolak-balik | Handheld, wearable |
| Packer | Mengemas dan memberi label | Verifikasi item, saran kemasan, cetak label otomatis | Salah label, proses lambat | Desktop + scanner |
| Inventory Controller | Menjaga akurasi stok | Cycle count, investigasi selisih, adjustment dengan approval | Selisih sulit dilacak | Web, handheld |
| QC Inspector | Memeriksa kualitas | Checklist, sampling, foto bukti, hold/release | Pencatatan manual | Handheld, tablet |
| Admin Master Data | Mengelola data item, lokasi, aturan | Impor massal, validasi, riwayat perubahan | Data tidak konsisten | Web |
| Planner / Logistics | Merencanakan stok dan replenishment | Visibilitas stok multi-gudang, demand vs supply | Data tersebar | Web |
| Customer Service | Menangani pertanyaan order | Status order dan tracking real-time | Harus bertanya ke gudang | Web |
| Klien 3PL (eksternal) | Pemilik barang di gudang 3PL | Portal stok, order, laporan, tagihan transparan | Tidak ada visibilitas | Web portal |
| IT / System Admin | Mengelola akses dan integrasi | RBAC, SSO, monitoring integrasi, log | Integrasi rapuh | Web |

## 6. Asumsi, Batasan, dan Dependensi

**Asumsi**

- Gudang memiliki jaringan Wi-Fi memadai; area blind spot ditangani lewat mode offline terbatas.
- Operator menggunakan handheld Android (scanner terintegrasi) atau smartphone dengan kamera.
- ERP/OMS menyediakan API atau file integrasi (CSV/XML/EDI) untuk dokumen PO, SO, dan master data.
- Barcode standar (EAN-13, UPC, Code 128, GS1-128, QR) sudah dipakai atau dapat dicetak oleh WMS.

**Batasan**

- Patuh pada UU Pelindungan Data Pribadi (UU No. 27 Tahun 2022) dan kebijakan keamanan perusahaan.
- Data dihosting di region yang memenuhi kebutuhan residensi data (disarankan region Indonesia).
- Antarmuka mendukung Bahasa Indonesia dan Inggris; format tanggal, angka, dan mata uang menyesuaikan lokal (IDR, zona waktu WIB/WITA/WIT).

**Dependensi**

- Integrasi ERP (mis. SAP Business One, Odoo, Accurate, Jurnal, atau ERP internal).
- Integrasi marketplace dan OMS (mis. Shopee, Tokopedia/TikTok Shop, Lazada, Blibli) serta kurir (mis. JNE, J&T, SiCepat, Anteraja, Ninja Xpress, SAP Express, kurir instan).
- Perangkat keras: handheld scanner, printer label (ZPL/TSC), timbangan, dan printer A4/thermal.
- Tim operasional gudang untuk discovery proses, UAT, dan pelatihan.

## 7. Peta Modul dan Fase Rilis

| Kode | Modul | Fase |
| --- | --- | --- |
| MD | Master Data (item, partner, aturan) | 1 |
| WH | Struktur Gudang dan Lokasi | 1 |
| IN | Inbound (receiving, QC, putaway) | 1 |
| INV | Manajemen Inventori | 1 |
| OUT | Outbound (alokasi, picking, packing, shipping) | 1 |
| RET | Retur (reverse logistics) | 1 (dasar), 2 (lanjutan) |
| TSK | Task dan Labor Management | 1 (dasar), 2 (lanjutan) |
| MOB | Aplikasi Mobile/RF | 1 |
| INT | Integrasi (API, webhook, konektor) | 1 |
| SEC | Pengguna, Peran, dan Audit | 1 |
| NTF | Notifikasi dan Alert | 1 |
| RPT | Pelaporan dan Analitik | 1 (dasar), 2 (lanjutan) |
| CFG | Konfigurasi Sistem | 1 |
| XD | Cross-docking | 2 |
| VAS | Value-Added Services (kitting, relabel, repack) | 2 |
| YRD | Yard dan Dock Management | 2 |
| 3PL | Multi-client dan Billing 3PL | 2 |
| OPT | Slotting, Replenishment, dan Optimasi | 2–3 |
| AUT | Otomasi dan AI (WCS-ready, forecasting, anomali) | 3 |

## 8. Alur Proses End-to-End

**Inbound:** PO/ASN diterima → penjadwalan dan gate-in → unloading dan receiving (scan) → QC (opsional) → pembuatan LPN/pallet → putaway terarah → stok tersedia → GRN dikirim ke ERP.

**Outbound:** Order masuk (OMS/marketplace/ERP) → validasi dan alokasi stok → release (wave/batch) → picking → konsolidasi/sortir → packing dan penimbangan → cetak label kurir → staging → loading dan serah terima → konfirmasi pengiriman ke OMS/ERP.

**Retur:** RMA dibuat/diterima → penerimaan retur → inspeksi dan grading → disposisi (restock, refurbish, karantina, scrap, retur ke vendor) → update stok dan pemicu refund ke sistem pesanan.

**Pengelolaan stok:** Replenishment → transfer internal/antar gudang → cycle count → penyesuaian (adjustment) dengan approval.

**Status Order Outbound:** Draft → Created → Allocated (atau Backorder/Short) → Released → Picking → Picked → Packing → Packed → Staged → Shipped → Delivered (opsional dari kurir). Status tambahan: On Hold, Cancelled.

**Status Stok:** Available, Allocated, Picked, Packed, In-Transit, Quarantine/Hold, Damaged, Expired, Blocked.

## 9. Kebutuhan Fungsional

Legenda prioritas: **P0** = wajib untuk MVP (Fase 1); **P1** = Fase 2; **P2** = Fase 3 / nice-to-have. Setiap kebutuhan memiliki ID unik untuk keperluan pelacakan ke backlog dan pengujian.

### 9.1 Master Data (MD)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| MD-01 | CRUD item/SKU dengan atribut: kode, nama, deskripsi, kategori, brand, dimensi, berat, volume, gambar, dan banyak barcode per item (EAN/UPC/Code 128/QR) | P0 |
| MD-02 | Multi-UoM dan konversi (pcs, inner pack, carton, pallet) dengan UoM dasar, UoM beli, dan UoM jual | P0 |
| MD-03 | Atribut kontrol inventori per item: lot/batch, serial number, tanggal produksi, tanggal kedaluwarsa, shelf life, suhu simpan, flag hazmat dan fragile | P0 |
| MD-04 | Aturan minimum sisa shelf life per customer/channel (mis. 70% saat dikirim) | P0 |
| MD-05 | Master supplier, customer, carrier, dan klien (3PL) beserta alamat dan kontak | P0 |
| MD-06 | Aturan per item/kategori: putaway, picking (FIFO/FEFO/LIFO), replenishment (min/max), dan strategi alokasi | P0 |
| MD-07 | Impor/ekspor massal CSV/XLSX dengan template, validasi baris, dan log error yang dapat diunduh | P0 |
| MD-08 | Pembuatan dan cetak label barcode (item, lokasi, LPN, pallet) dalam format ZPL dan PDF dengan template yang dapat dikustomisasi | P0 |
| MD-09 | Master reason code (adjustment, damage, retur, hold, short pick, dsb.) | P0 |
| MD-10 | Item varian (ukuran/warna) dan hubungan parent-child | P1 |
| MD-11 | Master tipe kemasan: ukuran kardus, bahan packing, berat kosong | P1 |
| MD-12 | Kalender kerja gudang, hari libur, shift, dan cut-off time per kurir | P1 |
| MD-13 | Workflow persetujuan dan riwayat perubahan untuk master data sensitif | P1 |
| MD-14 | Bill of Material (BOM) untuk bundle dan kitting | P1 |
| MD-15 | Deteksi duplikat item/barcode dan saran penggabungan | P2 |

### 9.2 Struktur Gudang dan Lokasi (WH)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| WH-01 | Hierarki: Perusahaan › Site/Gudang › Zona › Aisle › Rak › Level › Bin | P0 |
| WH-02 | Tipe lokasi: receiving, staging, storage (pallet/shelf/bulk), pick face, pack station, shipping dock, quarantine, damage, return, cross-dock, dan lokasi virtual (in-transit) | P0 |
| WH-03 | Atribut lokasi: kapasitas (berat, volume, jumlah pallet), dimensi, zona suhu, kelas (A/B/C), status (aktif/blokir), dan restriksi (hazmat, single-SKU, single-lot) | P0 |
| WH-04 | Dukungan LPN (license plate number): pallet, karton, tote, dan container sebagai unit lacak | P0 |
| WH-05 | Pembuatan lokasi massal dengan generator rentang (mis. A-01-01 sampai A-20-04) | P0 |
| WH-06 | Multi-gudang dengan konfigurasi dan aturan independen per gudang | P0 |
| WH-07 | Koordinat lokasi dan urutan jalur (pick path) untuk optimasi rute picking | P1 |
| WH-08 | Kontrol kompatibilitas zona suhu dan barang berbahaya | P1 |
| WH-09 | Peta layout gudang 2D dengan heatmap okupansi dan aktivitas | P1 |
| WH-10 | Dukungan lokasi sementara dan overflow dengan aturan otomatis | P1 |

### 9.3 Inbound: Receiving, QC, dan Putaway (IN)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| IN-01 | Ekspektasi penerimaan dari PO (ERP), ASN, transfer antar gudang, retur, atau pembuatan manual | P0 |
| IN-02 | Receiving via scan di mobile: scan PO/item, input qty, lot, expiry, dan serial; validasi terhadap ekspektasi | P0 |
| IN-03 | Penerimaan parsial dan multi-kedatangan per PO; penutupan PO manual atau otomatis | P0 |
| IN-04 | Penanganan selisih (over/short/damaged) dengan toleransi persen, reason code, foto, dan approval bila melewati batas | P0 |
| IN-05 | Pembuatan LPN/pallet dan cetak label otomatis saat receiving | P0 |
| IN-06 | Validasi minimum sisa shelf life saat receiving; tolak atau tahan (hold) bila di bawah ambang | P0 |
| IN-07 | Putaway terarah: sistem menyarankan lokasi berdasarkan zona, kelas, kapasitas, suhu, konsolidasi item, FEFO, dan aturan master | P0 |
| IN-08 | Override lokasi putaway oleh operator dengan alasan dan pencatatan audit | P0 |
| IN-09 | Pengiriman Goods Receipt Note (GRN) ke ERP secara real-time atau terjadwal | P0 |
| IN-10 | Cetak dan simpan GRN beserta lampiran foto/dokumen (surat jalan, packing list) | P0 |
| IN-11 | Blind receiving dan guided receiving (qty ekspektasi disembunyikan atau ditampilkan) per supplier | P1 |
| IN-12 | Penjadwalan kedatangan (appointment) dan penugasan dock door | P1 |
| IN-13 | Gate-in kendaraan: data sopir, plat nomor, nomor segel, jam masuk dan keluar | P1 |
| IN-14 | QC inbound: rencana sampling, checklist, foto, hasil lulus/gagal/hold, dan disposisi | P1 |
| IN-15 | Putaway task dengan prioritas dan task interleaving (putaway digabung dengan picking/replenishment untuk mengurangi perjalanan kosong) | P1 |
| IN-16 | Scorecard supplier: akurasi pengiriman, kualitas, ketepatan waktu | P1 |
| IN-17 | Penerimaan per container impor dengan referensi dokumen kepabeanan (PIB/BC) dan dukungan gudang berikat | P2 |

### 9.4 Manajemen Inventori (INV)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| INV-01 | Stok real-time per item, lokasi, LPN, lot, serial, status, dan pemilik (client) | P0 |
| INV-02 | Ledger pergerakan stok yang tidak dapat diubah (immutable): setiap perubahan mencatat waktu, pengguna, dokumen referensi, serta qty sebelum dan sesudah | P0 |
| INV-03 | Status stok (Available, Allocated, Hold/Quarantine, Damaged, Expired, In-Transit, Blocked) dan perpindahan antar status dengan reason code | P0 |
| INV-04 | Strategi pengeluaran FIFO, FEFO, LIFO, dan lot spesifik; dikonfigurasi per item atau per customer | P0 |
| INV-05 | Pindah stok internal (move) antar lokasi via scan, termasuk pindah LPN penuh | P0 |
| INV-06 | Transfer antar gudang dengan status in-transit, dokumen pengiriman, dan penerimaan di gudang tujuan | P0 |
| INV-07 | Cycle count terjadwal (berbasis klasifikasi ABC), berbasis event (zero-stock saat picking, selisih berulang), dan ad hoc; mendukung blind count dan recount otomatis bila selisih melewati toleransi | P0 |
| INV-08 | Stock adjustment dengan reason code, lampiran, dan approval berjenjang berdasarkan nilai/qty | P0 |
| INV-09 | Stock opname penuh (wall-to-wall): freeze lokasi, pembagian tim hitung, rekonsiliasi, dan laporan selisih | P0 |
| INV-10 | Reservasi/soft allocation stok per channel, customer, atau order | P0 |
| INV-11 | Hold dan release stok (QC, recall, sengketa) dengan alasan; hold massal per lot | P0 |
| INV-12 | Pencarian cepat stok dan lokasi berdasarkan item, barcode, lot, serial, atau LPN | P0 |
| INV-13 | Traceability maju dan mundur berdasarkan lot/serial (dari supplier hingga customer) | P0 |
| INV-14 | Manajemen kedaluwarsa: dashboard, alert near-expiry (mis. 30/60/90 hari), dan saran tindakan (promosi, retur, scrap) | P0 |
| INV-15 | Replenishment pick face berbasis min/max: task otomatis dari lokasi reserve ke forward pick, serta pemicu manual | P0 |
| INV-16 | Replenishment berbasis permintaan (demand-driven) dan terintegrasi dengan prioritas wave | P1 |
| INV-17 | Manajemen recall: temukan semua lot terdampak, lokasi saat ini, dan order terkirim; blokir stok otomatis | P1 |
| INV-18 | Konversi UoM dan break-case (pecah karton menjadi pcs) dengan pencatatan otomatis | P1 |
| INV-19 | Konsolidasi (merge) dan pemecahan (split) LPN/pallet | P1 |
| INV-20 | Multi-owner dalam satu lokasi dengan pemisahan logis per pemilik barang | P1 |
| INV-21 | Analisis stock aging, slow-moving, dan dead stock | P1 |
| INV-22 | Valuasi dasar (biaya rata-rata/FIFO) untuk pelaporan dan sinkronisasi ke ERP | P1 |
| INV-23 | Siklus hidup nomor serial: terima, simpan, jual, retur, dan garansi | P1 |
| INV-24 | Rekomendasi SKU berisiko tinggi untuk cycle count berdasarkan riwayat selisih dan pergerakan | P2 |
| INV-25 | Integrasi sensor suhu/IoT dengan alert penyimpangan suhu (temperature excursion) | P2 |

### 9.5 Outbound: Alokasi, Picking, Packing, dan Pengiriman (OUT)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| OUT-01 | Penerimaan order dari OMS, marketplace, ERP, API, atau input/impor manual | P0 |
| OUT-02 | Validasi order: SKU valid, alamat lengkap, layanan kurir tersedia, dan cut-off; penandaan order bermasalah untuk ditindaklanjuti | P0 |
| OUT-03 | Alokasi stok otomatis berdasarkan aturan (FEFO/FIFO, lot, lokasi, gudang, prioritas customer) | P0 |
| OUT-04 | Penanganan stok kurang: backorder, partial shipment, atau pembatalan line sesuai aturan customer | P0 |
| OUT-05 | Prioritas order dan SLA (cut-off kurir, deadline marketplace, layanan express) | P0 |
| OUT-06 | Release order manual atau otomatis | P0 |
| OUT-07 | Wave planning: pengelompokan per kurir, cut-off, zona, SKU, prioritas, atau jumlah order; wave dapat dijadwalkan atau dipicu event | P0 |
| OUT-08 | Strategi picking discrete (satu order) dan batch (banyak order, satu SKU) | P0 |
| OUT-09 | Strategi picking zone, cluster (multi-order dengan tote), dan sortir lewat put wall | P1 |
| OUT-10 | Picking via mobile: scan lokasi, lalu item (dan lot/serial bila perlu), konfirmasi qty, dengan urutan rute yang dioptimalkan | P0 |
| OUT-11 | Penanganan short pick: operator melapor, sistem mencari lokasi/lot alternatif, re-allocate, dan memicu cycle count lokasi | P0 |
| OUT-12 | Substitusi lot atau lokasi yang diizinkan saat picking dengan pencatatan | P1 |
| OUT-13 | Packing station: scan item untuk verifikasi, saran ukuran karton, input berat/dimensi, dan multi-parcel per order | P0 |
| OUT-14 | Pembuatan resi (AWB) dan label dari kurir secara otomatis; cetak label, packing list, dan invoice | P0 |
| OUT-15 | Verifikasi berat aktual vs teoritis dengan flag untuk selisih di atas toleransi | P1 |
| OUT-16 | Foto/video bukti packing (opsional per order atau per customer) | P1 |
| OUT-17 | Staging dan loading: lane/dock per kurir, scan paket saat loading, deteksi paket salah kurir | P0 |
| OUT-18 | Manifest dan serah terima kurir (handover) dengan tanda tangan digital dan penghitungan jumlah paket | P0 |
| OUT-19 | Konfirmasi pengiriman (ship confirm) ke OMS/ERP/marketplace beserta nomor resi; stok dikurangi otomatis | P0 |
| OUT-20 | Pembatalan order pada setiap tahap (sebelum/sesudah picking) dengan penanganan stok (un-pick dan put-back) | P0 |
| OUT-21 | Dokumen pengiriman (surat jalan, packing list, invoice) dengan template yang dapat dikustomisasi | P0 |
| OUT-22 | Perubahan order (alamat, qty, kurir) sebelum cut-off dengan kontrol status | P1 |
| OUT-23 | Order bundling, hadiah, sample, dan insert (brosur) otomatis berdasarkan aturan | P1 |
| OUT-24 | Pre-order dan fulfillment backorder otomatis saat stok masuk | P1 |
| OUT-25 | Penanganan COD, nilai deklarasi, dan asuransi pengiriman | P1 |
| OUT-26 | Sinkronisasi status tracking dari kurir (in transit, delivered, gagal kirim) | P1 |
| OUT-27 | Rate shopping: pemilihan kurir optimal berdasarkan biaya, SLA, dan cakupan wilayah | P2 |
| OUT-28 | Dispatch kurir instan/same-day dengan penugasan otomatis | P2 |

### 9.6 Retur (RET)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| RET-01 | Pembuatan RMA (dari OMS/marketplace/manual) dengan alasan retur | P0 |
| RET-02 | Penerimaan retur via scan dan verifikasi terhadap RMA/order asal | P0 |
| RET-03 | Inspeksi dan grading (A/B/C/rusak) dengan checklist dan foto | P0 |
| RET-04 | Disposisi: restock ke Available, refurbish, quarantine, scrap, atau retur ke vendor (RTV) | P0 |
| RET-05 | Pembaruan stok otomatis sesuai disposisi dan notifikasi ke OMS/ERP untuk proses refund/kredit | P0 |
| RET-06 | Dokumen dan pengiriman RTV serta pelacakan klaim ke vendor | P1 |
| RET-07 | Deteksi retur mencurigakan (serial tidak cocok, barang tidak sesuai) dan flag fraud | P1 |
| RET-08 | Penanganan retur tanpa RMA (unexpected return) | P1 |
| RET-09 | Analitik retur: alasan, SKU, supplier, dan kurir | P1 |
| RET-10 | Alur refurbish: repack, relabel, dan QC ulang | P2 |

### 9.7 Task dan Labor Management (TSK)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| TSK-01 | Mesin tugas terpusat: semua pekerjaan (receive, putaway, pick, replenish, move, count, pack) berupa task dengan status, prioritas, dan penerima | P0 |
| TSK-02 | Penugasan manual oleh supervisor dan penugasan otomatis (berdasarkan zona, skill, lokasi terdekat) | P0 |
| TSK-03 | Self-assignment oleh operator dari antrean task (pull) dengan aturan prioritas | P0 |
| TSK-04 | Dashboard progres real-time: task terbuka, berjalan, selesai, terlambat; per shift, zona, dan operator | P0 |
| TSK-05 | Reassign, pause, dan cancel task serta penanganan eksepsi | P0 |
| TSK-06 | Pelacakan produktivitas: lines/jam, unit/jam, akurasi, dan idle time per operator/tim/shift | P1 |
| TSK-07 | Skill dan sertifikasi operator (mis. forklift, hazmat) sebagai syarat task tertentu | P1 |
| TSK-08 | Labor planning: perkiraan beban kerja dari order dan kebutuhan headcount per shift | P1 |
| TSK-09 | Task interleaving dan prioritisasi dinamis berdasarkan mendekatnya cut-off | P1 |
| TSK-10 | Gamifikasi dan insentif: target, leaderboard, dan pencapaian | P2 |
| TSK-11 | Engineered labor standards dan benchmarking | P2 |

### 9.8 Aplikasi Mobile / RF (MOB)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| MOB-01 | Aplikasi Android yang berjalan di handheld (Zebra, Honeywell, dsb.) maupun smartphone | P0 |
| MOB-02 | Scan barcode lewat scanner hardware dan kamera (1D/2D, GS1) | P0 |
| MOB-03 | Alur layar terpandu per proses (receiving, putaway, picking, move, count, pack) dengan konfirmasi scan di setiap langkah | P0 |
| MOB-04 | Umpan balik yang jelas lewat suara, getar, dan warna untuk sukses atau error | P0 |
| MOB-05 | Mode offline terbatas untuk picking, putaway, dan move: antrean transaksi lokal dan sinkronisasi otomatis dengan penanganan konflik | P0 |
| MOB-06 | Mode offline untuk receiving dan cycle count | P1 |
| MOB-07 | Login cepat via PIN, scan badge, atau SSO; sesi per shift dan auto-lock | P0 |
| MOB-08 | Antarmuka tombol besar dan kontras tinggi, dapat dioperasikan satu tangan, mode terang/gelap | P0 |
| MOB-09 | Dukungan Bahasa Indonesia dan Inggris | P0 |
| MOB-10 | Pengambilan foto untuk dokumentasi (rusak, selisih, QC) | P0 |
| MOB-11 | Cetak label dari mobile ke printer Bluetooth/jaringan | P1 |
| MOB-12 | Pembaruan aplikasi otomatis dan kompatibilitas dengan MDM | P1 |
| MOB-13 | Voice picking dan dukungan ring scanner/wearable | P2 |
| MOB-14 | Pick-to-light, put-to-light, dan panduan berbasis AR | P2 |

### 9.9 Cross-Docking (XD)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| XD-01 | Identifikasi otomatis barang inbound yang sudah dialokasikan ke order outbound (flow-through) | P1 |
| XD-02 | Pengalihan langsung dari receiving ke staging/outbound tanpa putaway | P1 |
| XD-03 | Cross-dock terencana dan oportunistik | P2 |
| XD-04 | Konsolidasi multi-supplier ke satu pengiriman per customer/toko | P2 |

### 9.10 Value-Added Services (VAS)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| VAS-01 | Work order untuk kitting, bundling, repack, relabel, dan inspeksi tambahan | P1 |
| VAS-02 | Konsumsi komponen berdasarkan BOM dan penambahan stok produk jadi | P1 |
| VAS-03 | Pencatatan waktu dan biaya VAS per order/klien | P1 |
| VAS-04 | Instruksi kerja digital dengan foto dan checklist | P1 |
| VAS-05 | Personalisasi produk: cetak/laser, insert, gift wrap | P2 |

### 9.11 Yard dan Dock Management (YRD)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| YRD-01 | Penjadwalan dock door dan slot waktu per kendaraan/supplier | P1 |
| YRD-02 | Antrean kendaraan dengan status (menunggu, unloading, selesai) dan estimasi waktu tunggu | P1 |
| YRD-03 | Notifikasi ke supplier/kurir terkait slot dan keterlambatan | P1 |
| YRD-04 | Pelacakan trailer/kontainer di area yard | P2 |
| YRD-05 | Pelacakan detention/demurrage | P2 |

### 9.12 Multi-Client dan Billing 3PL (3PL)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| 3PL-01 | Multi-tenant: pemisahan data, stok, aturan, dan branding per klien | P1 |
| 3PL-02 | Portal klien: stok, order inbound/outbound, status, laporan, dan unduhan dokumen | P1 |
| 3PL-03 | Rate card per klien: biaya penyimpanan (per pallet/lokasi/hari), handling in/out, picking per line/unit, packing, VAS, dan retur | P1 |
| 3PL-04 | Perhitungan biaya otomatis (snapshot penyimpanan harian dan aktivitas) serta draft invoice | P1 |
| 3PL-05 | Ekspor tagihan ke sistem akuntansi dengan review dan approval sebelum terbit | P1 |
| 3PL-06 | SLA per klien dan laporan kepatuhan SLA | P1 |
| 3PL-07 | API dan webhook per klien | P1 |
| 3PL-08 | Slotting khusus klien (ruang dedicated vs shared) | P2 |

### 9.13 Pelaporan dan Analitik (RPT)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| RPT-01 | Dashboard operasional real-time: order masuk/terproses/terlambat, backlog per tahap, SLA at risk, dan throughput per jam | P0 |
| RPT-02 | Laporan stok: stock on hand, per lokasi, per lot, stock card/ledger, stok minimum, dan near-expiry | P0 |
| RPT-03 | Laporan inbound: penerimaan vs PO, selisih, dan dock-to-stock time | P0 |
| RPT-04 | Laporan outbound: order fulfillment, on-time shipping, short pick, dan order cycle time | P0 |
| RPT-05 | Laporan akurasi: hasil cycle count, selisih, dan adjustment per alasan | P0 |
| RPT-06 | Filter, pengurutan, dan ekspor CSV/XLSX/PDF pada semua laporan | P0 |
| RPT-07 | Penjadwalan laporan otomatis via email | P1 |
| RPT-08 | Laporan produktivitas tenaga kerja dan task | P1 |
| RPT-09 | Dashboard eksekutif: tren KPI dan perbandingan antar gudang | P1 |
| RPT-10 | Laporan kapasitas, okupansi, dan utilisasi ruang | P1 |
| RPT-11 | Analisis ABC/XYZ, velocity SKU, dan co-occurrence item dalam order | P1 |
| RPT-12 | Pembangun laporan kustom (self-service) dan dashboard yang dapat dikonfigurasi | P2 |
| RPT-13 | Ekspor data ke data warehouse/BI lewat konektor dan API analitik | P2 |

### 9.14 Integrasi (INT)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| INT-01 | REST API lengkap (dokumentasi OpenAPI) untuk entitas inti: item, PO/ASN, order, stok, task, dan pengiriman | P0 |
| INT-02 | Webhook/event (order.allocated, receipt.completed, shipment.confirmed, stock.adjusted, dsb.) dengan retry, tanda tangan (signature), dan dead-letter queue | P0 |
| INT-03 | Konektor ERP: sinkronisasi master item, PO, SO, GRN, pengiriman, adjustment, dan stok | P0 |
| INT-04 | Konektor marketplace/OMS: tarik order, dorong stok, dan perbarui status serta resi | P0 |
| INT-05 | Konektor kurir: cek tarif, buat AWB, cetak label, tracking, dan manifest | P0 |
| INT-06 | Impor/ekspor file terjadwal (CSV/XML/SFTP/EDI) sebagai alternatif API | P0 |
| INT-07 | Autentikasi API (OAuth2/API key), rate limiting, dan versioning | P0 |
| INT-08 | Monitoring integrasi: log pesan, status, retry manual, dan alert kegagalan | P0 |
| INT-09 | Integrasi printer (ZPL/TSC/IPP), timbangan, dan scanner | P0 |
| INT-10 | Sinkronisasi stok ke channel (available-to-promise) dengan buffer/safety stock per channel | P0 |
| INT-11 | Mapping dan transformasi field yang dapat dikonfigurasi tanpa kode | P1 |
| INT-12 | Integrasi e-invoice/e-Faktur dan sistem akuntansi | P1 |
| INT-13 | Integrasi SSO (SAML/OIDC) dan direktori pengguna | P1 |
| INT-14 | Integrasi WCS/otomasi (AS/RS, sorter, AMR) melalui API | P2 |
| INT-15 | Integrasi IoT/telematika (sensor suhu, GPS) | P2 |
| INT-16 | Direktori konektor/aplikasi pihak ketiga (app marketplace) | P2 |

### 9.15 Pengguna, Peran, dan Keamanan (SEC)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| SEC-01 | Manajemen pengguna: pembuatan, penonaktifan, reset sandi, dan pembatasan akses per gudang/klien | P0 |
| SEC-02 | RBAC dengan peran bawaan (admin, manajer, supervisor, operator, QC, auditor, klien) dan peran kustom dengan izin granular | P0 |
| SEC-03 | Autentikasi: kebijakan sandi kuat, MFA untuk pengguna back-office, lockout, dan session timeout | P0 |
| SEC-04 | Audit trail lengkap (siapa, kapan, apa, nilai sebelum dan sesudah) yang tidak dapat diubah, dapat dicari, dan dapat diekspor | P0 |
| SEC-05 | Enkripsi data in transit (TLS) dan at rest; manajemen rahasia (secrets) | P0 |
| SEC-06 | Isolasi data antar tenant dan antar klien | P0 |
| SEC-07 | Workflow approval yang dapat dikonfigurasi (adjustment, perubahan master data, override) | P0 |
| SEC-08 | Masking data pribadi penerima (nama, alamat, telepon) sesuai peran dan kebijakan retensi data sesuai UU PDP | P0 |
| SEC-09 | Segregation of duties, mis. pembuat adjustment tidak boleh menyetujuinya sendiri | P1 |
| SEC-10 | Dukungan permintaan hak subjek data (akses/penghapusan) dan pencatatan consent bila berlaku | P1 |
| SEC-11 | Kebijakan tingkat organisasi: IP allowlist, SSO wajib, dan aturan sandi | P1 |
| SEC-12 | Deteksi anomali perilaku pengguna (mis. adjustment berulang oleh satu akun) | P2 |

### 9.16 Notifikasi dan Alert (NTF)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| NTF-01 | Notifikasi in-app dan email untuk event penting (order terlambat, selisih, approval pending, stok minimum) | P0 |
| NTF-02 | Preferensi notifikasi per pengguna dan per peran | P0 |
| NTF-03 | Alert SLA at risk (mis. 60 menit sebelum cut-off kurir) dengan eskalasi ke supervisor | P0 |
| NTF-04 | Push notification ke mobile untuk task prioritas | P1 |
| NTF-05 | Integrasi WhatsApp/Slack/Teams untuk alert operasional | P1 |
| NTF-06 | Aturan alert kustom (kondisi, ambang, penerima) | P2 |

### 9.17 Konfigurasi Sistem (CFG)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| CFG-01 | Pengaturan per gudang: strategi alokasi, aturan putaway, strategi wave, toleransi, dan cut-off | P0 |
| CFG-02 | Template dokumen dan label (surat jalan, packing list, label barcode) dengan editor dan placeholder | P0 |
| CFG-03 | Penomoran dokumen otomatis dengan format yang dapat dikonfigurasi | P0 |
| CFG-04 | Field kustom pada entitas utama (item, order, lokasi) | P1 |
| CFG-05 | Rule engine tanpa kode untuk aturan putaway, alokasi, dan routing | P1 |
| CFG-06 | Feature flag per tenant/gudang | P1 |
| CFG-07 | Lingkungan sandbox/staging untuk menguji konfigurasi sebelum produksi | P1 |

### 9.18 Slotting dan Optimasi (OPT)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| OPT-01 | Slotting berbasis velocity dan klasifikasi ABC: saran penempatan SKU cepat bergerak di dekat area packing/dock | P1 |
| OPT-02 | Rekomendasi relokasi (re-slotting) dengan estimasi penghematan jarak dan waktu | P1 |
| OPT-03 | Optimasi rute picking (heuristik/TSP) berdasarkan koordinat lokasi | P1 |
| OPT-04 | Optimasi batch/wave berdasarkan kemiripan SKU dan zona | P2 |
| OPT-05 | Cartonization: optimasi pemilihan ukuran dan jumlah karton | P2 |
| OPT-06 | Simulasi what-if untuk layout dan kapasitas | P2 |
| OPT-07 | Penyeimbangan beban kerja antar zona | P2 |

### 9.19 Otomasi dan AI (AUT)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| AUT-01 | Forecasting volume order dan kebutuhan tenaga kerja per shift untuk peak season | P2 |
| AUT-02 | Prediksi risiko keterlambatan SLA dan rekomendasi tindakan | P2 |
| AUT-03 | Deteksi anomali stok dan transaksi (selisih tidak wajar) | P2 |
| AUT-04 | Asisten operasional berbahasa alami untuk bertanya ke data dan laporan | P2 |
| AUT-05 | Kesiapan integrasi robotik (AMR/AGV, sorter) dan dispatch task otomatis | P2 |
| AUT-06 | Computer vision untuk verifikasi isi paket dan pencocokan label | P2 |

## 10. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan | Target |
| --- | --- | --- |
| Kinerja | Respons cepat untuk transaksi scan dan pencarian | p95 API < 500 ms; scan di mobile < 1 detik; halaman web dimuat < 2 detik |
| Skalabilitas | Mendukung pertumbuhan dan peak season tanpa degradasi | ≥ 50.000 order/hari per tenant; ≥ 500 pengguna konkuren per gudang; skala horizontal hingga 10x beban normal |
| Ketersediaan | Layanan tersedia selama jam operasi gudang (termasuk shift malam) | Uptime ≥ 99,9%; maintenance di luar jam operasional |
| Backup dan DR | Pemulihan data dan layanan | RPO ≤ 5 menit; RTO ≤ 1 jam; backup harian plus point-in-time recovery; uji pemulihan tiap kuartal |
| Integritas data | Konsistensi stok dan idempotensi transaksi | Concurrency control pada alokasi; tidak ada stok negatif tanpa aturan eksplisit; transaksi idempoten dengan idempotency key |
| Keamanan | Perlindungan aplikasi dan data | Mengacu OWASP ASVS Level 2; enkripsi TLS dan at rest; pentest tahunan; pemindaian kerentanan berkala; kesiapan sertifikasi ISO 27001 |
| Privasi dan kepatuhan | Perlindungan data pribadi | Sesuai UU PDP; masking, retensi, dan jejak akses; retensi data transaksi dapat dikonfigurasi (disarankan konfirmasi periode dengan Legal/Finance) |
| Usability | Mudah dipelajari oleh operator | Operator baru produktif ≤ 3 hari; langkah rutin maksimal 1 scan dan 1 tap per langkah; web memenuhi WCAG 2.1 AA |
| Kompatibilitas | Perangkat dan peramban | Chrome/Edge/Safari versi terbaru; Android 10+; layar handheld 4–6 inci; printer label ZPL |
| Lokalisasi | Bahasa dan format lokal | Bahasa Indonesia dan Inggris; zona waktu WIB/WITA/WIT; format tanggal, angka, dan mata uang IDR |
| Observabilitas | Pemantauan dan diagnosis | Logging terstruktur, metrics, distributed tracing, dashboard kesehatan, dan alert on-call |
| Maintainability | Pemeliharaan dan evolusi | CI/CD otomatis; API versioning dengan dukungan backward compatibility ≥ 12 bulan; cakupan tes otomatis pada alur kritis |

## 11. Model Data Tingkat Tinggi

| Entitas | Deskripsi | Relasi utama |
| --- | --- | --- |
| Tenant / Client | Perusahaan atau klien pemilik barang | Memiliki banyak gudang, item, dan pengguna |
| Warehouse / Zone / Location | Hierarki fisik gudang dan lokasi simpan | Location memiliki tipe, kapasitas, dan status |
| Item / UoM / Barcode | Master produk, satuan, dan kode pindai | Item memiliki banyak UoM dan banyak barcode |
| Lot / Serial | Atribut pelacakan batch dan nomor seri | Terkait Item dan Inventory |
| LPN | License plate (pallet/karton/tote) | Berisi banyak Inventory; berada di satu Location |
| Inventory | Posisi stok (item, lokasi, LPN, lot, status, qty) | Diubah hanya lewat Inventory Transaction |
| Inventory Transaction | Ledger pergerakan stok yang immutable | Mengacu ke dokumen dan pengguna |
| Inbound Order / ASN / Receipt | Ekspektasi dan realisasi penerimaan | Terkait Supplier, Item, dan Task putaway |
| QC Inspection | Hasil pemeriksaan kualitas | Terkait Receipt atau Inventory |
| Outbound Order / Line | Pesanan keluar dan baris item | Terkait Customer, Channel, dan Carrier |
| Allocation / Wave | Pengikatan stok ke order dan pengelompokan kerja | Menghasilkan Task Pick |
| Task | Unit pekerjaan operator (pick, putaway, replenish, count, dsb.) | Terkait User, Location, dan dokumen sumber |
| Package / Shipment / Manifest | Paket, pengiriman, dan serah terima kurir | Terkait Order dan Carrier |
| RMA / Return Receipt | Permintaan dan penerimaan retur beserta disposisi | Terkait Outbound Order asal |
| Count / Adjustment | Cycle count dan penyesuaian stok | Menghasilkan Inventory Transaction |
| Transfer Order | Pemindahan antar gudang | Memiliki status in-transit |
| Work Order (VAS) | Pekerjaan kitting/repack/relabel | Mengonsumsi komponen sesuai BOM |
| User / Role / Permission | Identitas dan hak akses | Terkait Tenant dan Warehouse |
| Audit Log | Catatan seluruh perubahan penting | Mengacu ke entitas dan pengguna |

## 12. Aturan Bisnis Kunci

1. Setiap perubahan stok wajib melalui transaksi yang tercatat di ledger; kuantitas tidak boleh diubah langsung.
2. Stok tidak boleh negatif kecuali dikonfigurasi secara eksplisit per gudang dengan alasan bisnis.
3. Alokasi hanya dari stok berstatus Available dan tidak berstatus Hold, Expired, atau Damaged, serta memenuhi minimum sisa shelf life customer.
4. Item ber-expiry dialokasikan dengan FEFO; lot berbeda tidak boleh dicampur dalam satu LPN kecuali diizinkan konfigurasi.
5. Adjustment di atas ambang nilai atau qty wajib mendapat approval; pembuat dan penyetuju tidak boleh orang yang sama.
6. Lokasi yang sedang dihitung (counting) dibekukan untuk pergerakan lain sampai hitungan selesai.
7. Over-receipt di atas toleransi memerlukan approval; barang di bawah shelf life minimum otomatis masuk status Hold.
8. Setiap pergerakan fisik wajib dikonfirmasi dengan scan lokasi dan item, kecuali dikonfigurasi lain dan dicatat.
9. Barang hazmat dan berkontrol suhu hanya boleh disimpan di lokasi yang kompatibel.
10. Order tidak dapat dibatalkan setelah ship confirm; pembatalan setelah packing memerlukan proses un-pack dan put-back yang terkontrol.
11. Stok yang dipublikasikan ke channel (ATP) = stok Available − stok Allocated − safety stock channel.
12. Cut-off kurir yang terlewati memicu alert dan eskalasi otomatis, dan order dialihkan ke jadwal pickup berikutnya sesuai aturan.

## 13. Prinsip UX dan Layar Utama

**Prinsip desain**

- Scan-first: setiap langkah dimulai dengan scan, bukan mengetik.
- Satu layar, satu tugas: operator selalu tahu apa langkah berikutnya.
- Error yang dapat ditindaklanjuti: pesan menjelaskan penyebab dan apa yang harus dilakukan.
- Minim pelatihan: istilah sederhana, ikon konsisten, dan panduan kontekstual.
- Kontras tinggi, tombol besar, dan dapat dipakai satu tangan di lingkungan gudang.
- Progressive disclosure: detail lanjutan hanya untuk supervisor dan admin.

| Platform | Layar utama | Tujuan |
| --- | --- | --- |
| Mobile | Login dan Home (daftar tugas) | Masuk cepat dan melihat task yang tersedia |
| Mobile | Receiving dan Putaway | Menerima barang dan menyimpannya ke lokasi yang disarankan |
| Mobile | Picking dan Sortir | Mengambil barang berdasarkan rute dan memilah ke tote/put wall |
| Mobile | Move, Replenish, dan Cycle Count | Memindahkan stok, mengisi pick face, dan menghitung stok |
| Mobile | Inspeksi Retur dan QC | Memeriksa kondisi barang dan mencatat foto |
| Desktop | Packing Station | Verifikasi item, penimbangan, dan cetak label |
| Web | Dashboard Operasional | Memantau SLA, backlog, dan throughput real-time |
| Web | Inbound, Outbound, dan Retur | Mengelola dokumen, wave, dan pengiriman |
| Web | Inventory Explorer dan Ledger | Mencari stok, melihat riwayat, dan investigasi selisih |
| Web | Task Board | Menugaskan, memprioritaskan, dan memantau pekerjaan |
| Web | Master Data dan Konfigurasi | Mengelola item, lokasi, aturan, dan template |
| Web | Monitor Integrasi | Memantau pesan, error, dan retry |
| Web | Admin (Pengguna dan Peran) | Mengatur akses, approval, dan audit |
| Web | Portal Klien (3PL) | Visibilitas stok dan order bagi klien |

## 14. Roadmap dan Fase Rilis

Jangka waktu bersifat indikatif dan akan dikonfirmasi setelah estimasi engineering dan discovery.

| Fase | Estimasi | Cakupan | Kriteria selesai (exit criteria) |
| --- | --- | --- | --- |
| Fase 0: Discovery dan Desain | 6–8 minggu | Pemetaan proses gudang, validasi baseline KPI, desain arsitektur dan UX, pemilihan gudang pilot | Baseline KPI tervalidasi; desain disetujui; rencana integrasi dan migrasi disepakati |
| Fase 1: MVP | ± 5–6 bulan | Seluruh kebutuhan P0: MD, WH, IN, INV, OUT, RET dasar, TSK dasar, MOB, INT inti, SEC, NTF, RPT dasar, CFG | Pilot satu gudang berjalan 8 minggu; akurasi stok ≥ 98%; adopsi scan ≥ 85%; uptime ≥ 99,5% |
| Fase 2: Optimasi dan Perluasan | ± 4–6 bulan | Kebutuhan P1: QC, yard, cross-dock, VAS, 3PL, labor management, slotting, offline lanjutan, analitik lanjutan | Rollout multi-gudang; seluruh target KPI 6 bulan tercapai |
| Fase 3: Otomasi dan Kecerdasan | ± 6 bulan atau lebih | Kebutuhan P2: AI/forecasting, WCS, voice/AR, IoT, dan ekosistem konektor | Target KPI 12 bulan tercapai; integrasi otomasi terbukti di minimal satu gudang |

**Milestone internal Fase 1**

1. M1 Fondasi: master data, struktur lokasi, pengguna/peran, konfigurasi, dan kerangka integrasi.
2. M2 Inbound dan Inventori: receiving, putaway, ledger stok, move, dan cycle count.
3. M3 Outbound dan Integrasi: alokasi, wave, picking, packing, pengiriman, serta konektor ERP, marketplace, dan kurir.
4. M4 Mobile, Pelaporan, dan UAT: penyempurnaan mobile, dashboard, laporan inti, uji beban, dan UAT.
5. M5 Pilot dan Hypercare: go-live di gudang pilot dan stabilisasi.

## 15. Rencana Peluncuran dan Adopsi

| Tahap | Aktivitas |
| --- | --- |
| Persiapan | Site survey Wi-Fi dan perangkat, daftar kebutuhan hardware, penunjukan champion per shift, penyusunan rencana komunikasi |
| Migrasi data | Impor master item dan lokasi; stock opname sebelum cutover untuk saldo awal; dry-run migrasi minimal dua kali; rekonsiliasi dengan ERP |
| Integrasi dan UAT | Uji end-to-end (PO sampai kirim, retur), uji beban dengan simulasi 10x volume normal, UAT bersama operator nyata |
| Pelatihan | Train-the-trainer, kartu panduan singkat (quick reference), video pendek, dan lingkungan sandbox untuk latihan |
| Pilot | Satu gudang atau satu channel; paralel run selektif untuk proses berisiko; keputusan go/no-go berdasarkan exit criteria |
| Go-live | Cutover terjadwal di luar masa peak; rencana rollback tertulis; command center selama 1 minggu pertama |
| Hypercare | 2–4 minggu dukungan intensif di lokasi; triase isu harian; peninjauan KPI mingguan |
| Rollout | Replikasi ke gudang berikutnya dengan paket konfigurasi dan checklist standar |

## 16. Instrumentasi dan Analitik Produk

| Area | Event / Metrik | Tujuan |
| --- | --- | --- |
| Adopsi | Pengguna aktif mingguan, persentase transaksi via scan, login per shift | Mengukur penerimaan produk oleh operator |
| Efisiensi | Waktu per task, lines/jam, idle time, task terlambat | Menemukan hambatan alur kerja |
| Kualitas | Scan error per layar, short pick, selisih cycle count, override putaway | Mengidentifikasi layar atau aturan yang membingungkan |
| Keandalan | Latensi API dan scan, error rate, kegagalan integrasi, crash aplikasi | Menjaga guardrail kinerja |
| Bisnis | On-time shipping, order accuracy, dock-to-stock, write-off expired | Mengukur pencapaian KPI di Bagian 3 |
| Kepuasan | Survei operator singkat, tiket dukungan per 100 pengguna | Memantau pengalaman pengguna |

Peninjauan metrik dilakukan mingguan selama hypercare dan bulanan setelahnya, dengan pemilik tindakan yang jelas untuk setiap temuan.

## 17. Risiko dan Mitigasi

| Risiko | Dampak | Kemungkinan | Mitigasi |
| --- | --- | --- | --- |
| Resistensi operator dan adopsi rendah | Tinggi | Sedang | Libatkan operator sejak desain, UX sederhana, champion per shift, pelatihan langsung, dan umpan balik cepat |
| Master data dan saldo awal tidak akurat saat migrasi | Tinggi | Tinggi | Stock opname sebelum cutover, validasi impor, dry-run berulang, dan freeze transaksi saat cutover |
| Integrasi ERP/marketplace/kurir tidak stabil atau API berubah | Tinggi | Sedang | Lapisan abstraksi konektor, retry dan dead-letter queue, contract test, monitoring, dan fallback file |
| Konektivitas Wi-Fi buruk | Sedang | Sedang | Site survey, mode offline terbatas, rekomendasi perbaikan infrastruktur |
| Downtime saat peak season | Tinggi | Rendah | Arsitektur high availability, uji beban 10x, code freeze menjelang peak, runbook insiden |
| Kinerja alokasi/wave pada volume tinggi | Tinggi | Sedang | Pemrosesan asinkron, indexing dan partisi data, uji beban sejak dini |
| Scope creep akibat kustomisasi per klien | Sedang | Tinggi | Rule engine dan konfigurasi, tata kelola roadmap, kriteria prioritas yang transparan |
| Pelanggaran privasi atau kebocoran data | Tinggi | Rendah | Masking, RBAC, enkripsi, audit trail, pentest, dan kepatuhan UU PDP |
| Ketergantungan pada perangkat keras tertentu | Sedang | Sedang | Daftar perangkat yang disertifikasi dan pengujian kompatibilitas |
| MVP terlambat karena cakupan terlalu luas | Sedang | Sedang | Disiplin pada P0, rilis per milestone, dan pilot dengan ruang lingkup sempit |

## 18. Pertanyaan Terbuka dan Langkah Berikutnya

| # | Pertanyaan | Pemilik | Dibutuhkan sebelum |
| --- | --- | --- | --- |
| 1 | Segmen awal: gudang internal (ritel/e-commerce/distributor) atau 3PL? Ini menentukan prioritas multi-tenant dan billing | Product dan Bisnis | Akhir discovery |
| 2 | ERP, marketplace, dan kurir mana yang wajib didukung pada MVP? | Bisnis dan IT | Discovery |
| 3 | Jumlah gudang, SKU, dan volume order harian pada pilot dan setelah 12 bulan? | Operasi | Discovery |
| 4 | Apakah handheld dan printer sudah tersedia atau perlu pengadaan? | Operasi dan Procurement | Desain |
| 5 | Apakah ada kebutuhan regulasi khusus (farmasi/BPOM, pangan, halal, hazmat, kepabeanan/gudang berikat)? | Legal dan QA | Desain |
| 6 | Model deployment: SaaS multi-tenant, single-tenant, atau on-premise? | IT dan Security | Arsitektur |
| 7 | Kebijakan retensi dan residensi data? | Legal | Arsitektur |
| 8 | Metode valuasi stok dan sumber kebenaran stok (WMS atau ERP)? | Finance | Desain |
| 9 | Model harga: per gudang, per pengguna, atau per transaksi? | Product dan Bisnis | Sebelum rilis umum |
| 10 | Adakah otomasi eksisting (conveyor, sorter) yang perlu diintegrasikan? | Operasi | Desain |

**Langkah berikutnya:** (1) review PRD bersama stakeholder utama, (2) discovery dan shadowing di gudang untuk memvalidasi baseline, (3) workshop prioritisasi P0 dengan Engineering, (4) penyusunan estimasi, arsitektur, dan prototipe UX mobile, (5) pemilihan gudang pilot dan rencana migrasi.

## 19. User Stories dan Kriteria Penerimaan (Contoh Alur Kritis)

| Cerita pengguna | Kriteria penerimaan |
| --- | --- |
| Sebagai Receiving Clerk, saya ingin menerima barang dengan scan agar selisih langsung tercatat (IN-02, IN-04) | Diberikan PO terbuka, saat item di-scan dan qty dimasukkan, sistem memvalidasi terhadap sisa qty PO; qty di atas toleransi ditolak dan meminta approval; LPN dan label tercetak otomatis; GRN terkirim ke ERP dalam ≤ 60 detik |
| Sebagai Putaway Operator, saya ingin disarankan lokasi simpan agar tidak perlu mencari tempat kosong (IN-07, IN-08) | Saat LPN di-scan, sistem menyarankan lokasi sesuai suhu, kapasitas, dan konsolidasi; scan lokasi yang salah ditolak; override mewajibkan reason code dan tercatat di audit trail |
| Sebagai Planner, saya ingin barang berkedaluwarsa lebih dekat keluar lebih dulu (OUT-03, INV-04) | Untuk item ber-expiry dengan beberapa lot, alokasi memilih lot dengan expiry terdekat yang masih memenuhi minimum shelf life customer; lot berstatus Hold tidak pernah dialokasikan |
| Sebagai Picker, saya ingin dipandu rute dan divalidasi saat mengambil barang (OUT-10, OUT-11) | Scan lokasi dan item yang benar mengonfirmasi qty dan mengarahkan ke lokasi berikutnya; jika barang tidak ada, picker melapor short pick, sistem menawarkan lokasi alternatif dalam ≤ 2 detik dan membuat task cycle count |
| Sebagai Packer, saya ingin sistem memastikan isi paket sesuai order (OUT-13, OUT-14) | Item salah atau berlebih memicu peringatan dan menghentikan proses; label kurir tercetak otomatis hanya setelah seluruh item terverifikasi |
| Sebagai Inventory Controller, saya ingin selisih stok ditangani terkontrol (INV-07, INV-08) | Hitungan di luar toleransi memicu recount otomatis; jika tetap berbeda, adjustment berstatus menunggu approval; setelah disetujui orang lain, stok dan ledger diperbarui dan ERP tersinkron |
| Sebagai Petugas Retur, saya ingin menentukan disposisi barang retur (RET-03, RET-04, RET-05) | Setelah inspeksi dan pemilihan disposisi, barang ditempatkan ke lokasi dan status yang sesuai (mis. restock ke Available atau Damaged) dan notifikasi dikirim ke OMS untuk memproses refund |
| Sebagai Supervisor, saya ingin tahu order yang berisiko melewati cut-off (NTF-03, RPT-01) | Dashboard menampilkan order berisiko beserta tahap yang tertahan; alert dikirim 60 menit sebelum cut-off dan tereskalasi bila tidak ditangani |
| Sebagai Channel Manager, saya ingin stok di marketplace selalu akurat (INT-10) | Perubahan stok dipublikasikan ke channel dalam ≤ 60 detik dengan memperhitungkan stok teralokasi dan safety stock |

## 20. Glosarium

| Istilah | Arti |
| --- | --- |
| 3PL | Third-Party Logistics, penyedia jasa logistik pihak ketiga |
| ASN | Advance Shipping Notice, pemberitahuan pengiriman dari supplier sebelum barang tiba |
| ATP | Available-to-Promise, stok yang dapat dijanjikan ke channel penjualan |
| BOM | Bill of Materials, daftar komponen penyusun suatu produk/kit |
| Cross-docking | Memindahkan barang dari penerimaan langsung ke pengiriman tanpa disimpan lama |
| Cycle count | Penghitungan stok berkala pada sebagian lokasi/SKU tanpa menutup gudang |
| Dock-to-stock | Waktu dari barang tiba di dock sampai tersedia untuk dijual |
| FEFO / FIFO / LIFO | First-Expired-First-Out / First-In-First-Out / Last-In-First-Out |
| GRN | Goods Receipt Note, dokumen bukti penerimaan barang |
| LPN | License Plate Number, identitas unik untuk pallet, karton, atau tote |
| OMS | Order Management System, sistem pengelola pesanan |
| Pick face | Lokasi simpan yang dipakai khusus untuk pengambilan cepat |
| Putaway | Proses menyimpan barang yang diterima ke lokasi simpan |
| RMA | Return Merchandise Authorization, otorisasi retur |
| RTV | Return to Vendor, retur barang ke pemasok |
| Short pick | Kondisi barang di lokasi kurang dari yang diminta saat picking |
| SLA | Service Level Agreement, target tingkat layanan |
| Staging | Area penempatan sementara barang sebelum dimuat atau disimpan |
| UoM | Unit of Measure, satuan ukuran (pcs, karton, pallet) |
| VAS | Value-Added Services, layanan tambahan seperti kitting dan relabel |
| Wave | Kelompok order yang dirilis bersamaan untuk diproses di gudang |
| WCS | Warehouse Control System, sistem kendali peralatan otomasi gudang |

## 21. Stakeholder

| Tim | Peran dalam proyek | Keputusan yang dimiliki |
| --- | --- | --- |
| Product Management | Pemilik PRD, prioritas, dan roadmap | Cakupan dan urutan rilis |
| Operasi Gudang | Sumber kebutuhan proses, UAT, dan adopsi | Validasi alur kerja dan kesiapan go-live |
| Engineering | Arsitektur, pengembangan, dan kualitas | Pendekatan teknis dan estimasi |
| Desain (UX) | Riset pengguna dan desain antarmuka | Pola interaksi dan usability |
| IT / Security | Infrastruktur, integrasi, dan keamanan | Kebijakan keamanan dan deployment |
| Finance | Valuasi stok, biaya, dan billing | Aturan valuasi dan tagihan |
| Legal / Compliance | Kepatuhan regulasi dan data pribadi | Kebijakan retensi dan privasi |
| Customer Success / Support | Onboarding, pelatihan, dan dukungan | Proses dukungan dan hypercare |

## 22. Riwayat Revisi

| Versi | Tanggal | Perubahan | Penulis |
| --- | --- | --- | --- |
| 1.0 | 22 November 2026 | Draft awal untuk review stakeholder | Product Management |
