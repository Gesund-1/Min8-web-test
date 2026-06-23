// script.js — untuk repositori belajarweb/minimal-cdn
(function() {
  'use strict';

  // Ambil elemen yang dibutuhkan
  const tombol = document.getElementById('action-btn');
  const teksDisplay = document.getElementById('display-text');
  const countEl = document.getElementById('count-lines');

  // Hitung jumlah baris di index.html (perkiraan)
  function hitungBaris() {
    // Karena kita tidak bisa membaca file HTML langsung dari client,
    // kita pakai pendekatan: ambil <html> outerHTML lalu hitung barisnya
    try {
      const html = document.documentElement.outerHTML;
      const lines = html.split('\n').length;
      if (countEl) {
        countEl.textContent = lines;
      }
    } catch (e) {
      if (countEl) countEl.textContent = '~25';
    }
  }

  // Fungsi ubah teks dengan animasi
  function ubahPesan() {
    const pesan = [
      '👋 Halo! JS dari GitHub berhasil!',
      '⚡ Kode minimal, dampak maksimal',
      '🎯 CSS & JS terpusat di repo',
      '🚀 Update tanpa sentuh index.html',
      '✨ Keren, kan?'
    ];
    // Pilih pesan acak
    const acak = pesan[Math.floor(Math.random() * pesan.length)];
    teksDisplay.textContent = acak;
    
    // Efek animasi kecil
    teksDisplay.classList.remove('pop');
    // Trigger reflow agar animasi berulang
    void teksDisplay.offsetWidth;
    teksDisplay.classList.add('pop');
    
    // Hapus efek setelah 600ms
    setTimeout(() => {
      teksDisplay.classList.remove('pop');
    }, 600);
  }

  // Tambahkan event listener ke tombol
  if (tombol) {
    tombol.addEventListener('click', ubahPesan);
  }

  // Inisialisasi: tampilkan pesan awal & hitung baris
  if (teksDisplay) {
    teksDisplay.textContent = '💡 Klik tombol untuk pesan dari JS';
  }

  // Hitung jumlah baris di HTML
  hitungBaris();

  // Log ke console sebagai bukti JS berjalan
  console.log('✅ script.js dari GitHub (via jsDelivr) berhasil dimuat!');
  console.log('📦 Repo: belajarweb/minimal-cdn');

})();
