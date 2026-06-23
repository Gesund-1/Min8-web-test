// ============================================
// KONFIGURASI GOOGLE DRIVE
// ============================================

// Ganti dengan File ID dari Google Drive Anda
const DRIVE_CONFIG = {
    GAMBAR: {
        '1': '1g3MEATlhw2UiAKyGpedr3G1Jz1vX5tLE',  // ID gambar untuk berita 1
        '2': '',
        '3': '',
        '4': '',
        '5': ''
    },
    DOKUMEN: {
        '1': '1g8xyEc6BhgGavnJ47VHOSsh5SfJ3cVXW',  // Ganti dengan ID dokumen Anda
        '2': '',
        '3': '',
        '4': '',
        '5': ''
    }
};

// ============================================
// DATA BERITA (DENGAN FALLBACK KONTEN)
// ============================================

const daftarBerita = [
    {
        id: 1,
        judul: "Pengertian HTML",
        kategori: "Teknologi",
        tanggal: "22 Juni 2026",
        penulis: "Tim Ilmu Site",
        gambarId: DRIVE_CONFIG.GAMBAR['1'],
        dokumenId: DRIVE_CONFIG.DOKUMEN['1'],
        deskripsi: "Pengertian HTML dan Struktur Dasar",
        kontenCadangan: `
            <p><strong>22 Juni 2026</strong></p>
            <h3>Pengertian HTML</h3>
            <p>HTML (Hyper Text Markup Language) adalah bahasa markup standar dalam pembuatan halaman website. HTML berfungsi sebagai kerangka dasar sebuah website. HTML bukan bahasa pemrograman melainkan bahasa markup yang menggunakan tag-tag.</p>
            <h4>Struktur Dasar HTML</h4>
            <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;Judul Halaman&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;h1&gt;Hello World!&lt;/h1&gt;
    &lt;/body&gt;
&lt;/html&gt;</code></pre>
            <h4>Penjelasan Tag HTML</h4>
            <ul>
                <li><strong>&lt;!DOCTYPE html&gt;</strong> - Mendeklarasikan tipe dokumen HTML5</li>
                <li><strong>&lt;html&gt;</strong> - Elemen root dari halaman HTML</li>
                <li><strong>&lt;head&gt;</strong> - Berisi meta informasi tentang dokumen</li>
                <li><strong>&lt;title&gt;</strong> - Menentukan judul halaman di tab browser</li>
                <li><strong>&lt;body&gt;</strong> - Berisi konten utama yang ditampilkan</li>
                <li><strong>&lt;h1&gt;</strong> - Heading level 1 (paling besar)</li>
            </ul>
        `
    }
];

// ============================================
// FUNGSI UNTUK AKSES GOOGLE DRIVE
// ============================================

function getDriveImageUrl(fileId) {
    if (!fileId) {
        return 'https://via.placeholder.com/400x250/2d2d44/ffc107?text=Ilmu+Site';
    }
    // Format URL yang benar untuk menampilkan gambar dari Google Drive
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

async function getDriveContent(fileId, kontenCadangan) {
    if (!fileId) {
        return kontenCadangan || '<p>Konten tidak tersedia.</p>';
    }

    try {
        const url = `https://docs.google.com/document/d/${fileId}/export?format=html`;
        const response = await fetch(url);
        
        if (!response.ok) {
            console.warn(`Gagal mengambil dari Drive (${response.status}), menggunakan fallback`);
            return kontenCadangan || `<p>Konten tidak tersedia. (Error: ${response.status})</p>`;
        }
        
        const htmlContent = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const bodyContent = doc.body;
        
        if (!bodyContent || bodyContent.innerHTML.trim() === '') {
            return kontenCadangan || '<p>Konten kosong di Google Drive.</p>';
        }
        
        return bodyContent.innerHTML;
        
    } catch (error) {
        console.error('Error mengambil konten:', error);
        return kontenCadangan || `
            <div class="alert alert-warning">
                <h5><i class="fas fa-exclamation-triangle"></i> Gagal mengambil konten</h5>
                <p>Menggunakan konten cadangan.</p>
            </div>
            ${kontenCadangan || ''}
        `;
    }
}

// ============================================
// FUNGSI UTAMA
// ============================================

function tampilkanBerita(beritaArray) {
    const container = document.getElementById('beritaContainer');
    
    if (!container) {
        console.error('Element #beritaContainer tidak ditemukan!');
        return;
    }
    
    container.innerHTML = '';

    if (!beritaArray || beritaArray.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                <h4>Tidak ada berita ditemukan</h4>
                <p class="text-muted">Coba kata kunci lain</p>
            </div>
        `;
        return;
    }

    beritaArray.forEach(berita => {
        const gambarSrc = getDriveImageUrl(berita.gambarId);

        const warnaKategori = {
            'Nasional': 'kategori-nasional',
            'Internasional': 'kategori-internasional',
            'Teknologi': 'kategori-teknologi',
            'Olahraga': 'kategori-olahraga',
            'Hiburan': 'kategori-hiburan'
        };

        const kategoriClass = warnaKategori[berita.kategori] || 'kategori-nasional';

        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        card.innerHTML = `
            <div class="berita-card">
                <div class="img-container">
                    <img src="${gambarSrc}" 
                         alt="${berita.judul}" 
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x250/2d2d44/ffc107?text=Ilmu+Site'">
                    <span class="kategori-badge ${kategoriClass}">${berita.kategori}</span>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${berita.judul}</h5>
                    <p class="card-text">${berita.deskripsi}</p>
                    <div class="meta-info">
                        <span><i class="far fa-calendar-alt"></i> ${berita.tanggal}</span>
                        <span class="ms-3"><i class="far fa-user"></i> ${berita.penulis}</span>
                    </div>
                    <div class="text-center mt-3">
                        <button class="btn btn-baca" onclick="bukaBerita(${berita.id})">
                            <i class="fas fa-book-open"></i> Baca Selengkapnya
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

async function bukaBerita(id) {
    const berita = daftarBerita.find(b => b.id === id);
    if (!berita) {
        alert('Berita tidak ditemukan!');
        return;
    }

    const modalElement = document.getElementById('beritaModal');
    if (!modalElement) {
        console.error('Modal #beritaModal tidak ditemukan!');
        return;
    }

    const modal = new bootstrap.Modal(modalElement);
    const modalBody = document.getElementById('modalBody');
    const modalJudul = document.getElementById('beritaModalLabel');

    if (!modalBody || !modalJudul) {
        console.error('Element modal tidak ditemukan!');
        return;
    }

    modalJudul.textContent = berita.judul;

    modalBody.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Mengambil konten...</p>
        </div>
    `;

    modal.show();

    const kontenHTML = await getDriveContent(berita.dokumenId, berita.kontenCadangan);
    const gambarSrc = getDriveImageUrl(berita.gambarId);

    modalBody.innerHTML = `
        <div class="text-center mb-3">
            <img src="${gambarSrc}" 
                 class="img-fluid rounded" 
                 alt="${berita.judul}"
                 onerror="this.src='https://via.placeholder.com/800x400/2d2d44/ffc107?text=Ilmu+Site'">
        </div>
        
        <div class="mb-3">
            <span class="badge bg-warning text-dark">${berita.kategori}</span>
        </div>
        
        <div class="row mb-3">
            <div class="col-md-6">
                <p><i class="far fa-calendar-alt"></i> <strong>Tanggal:</strong> ${berita.tanggal}</p>
            </div>
            <div class="col-md-6">
                <p><i class="far fa-user"></i> <strong>Penulis:</strong> ${berita.penulis}</p>
            </div>
        </div>
        
        <hr>
        
        <div class="mb-4">
            <h5><i class="fas fa-align-left"></i> Deskripsi</h5>
            <p class="lead">${berita.deskripsi}</p>
        </div>
        
        <div class="mb-4">
            <h5><i class="fas fa-file-alt"></i> Konten Lengkap</h5>
            <div class="konten-berita">
                ${kontenHTML}
            </div>
        </div>
        
        ${berita.dokumenId ? `
        <div class="alert alert-info small">
            <i class="fas fa-info-circle"></i> 
            <strong>Konten dari Google Drive.</strong> 
            <a href="https://docs.google.com/document/d/${berita.dokumenId}/edit?usp=sharing" 
               target="_blank" class="alert-link">Buka di Google Docs</a>
        </div>
        ` : ''}
    `;
}

function searchNews() {
    const keyword = document.getElementById('searchInput').value.toLowerCase().trim();
    if (keyword === '') {
        tampilkanBerita(daftarBerita);
        return false;
    }

    const hasil = daftarBerita.filter(berita => 
        berita.judul.toLowerCase().includes(keyword) ||
        berita.deskripsi.toLowerCase().includes(keyword) ||
        berita.kategori.toLowerCase().includes(keyword)
    );

    tampilkanBerita(hasil);
    return false;
}

function refreshBerita() {
    const container = document.getElementById('beritaContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Memuat ulang berita...</p>
        </div>
    `;
    
    setTimeout(() => {
        tampilkanBerita(daftarBerita);
    }, 500);
}

// ============================================
// NAVIGASI KE HALAMAN TOOLS
// ============================================

function bukaTools() {
    window.location.href = 'tools.html';
}

// ============================================
// INIT / DOMContentLoaded
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Ilmu Site - Portal Berita');
    tampilkanBerita(daftarBerita);

    // Navigasi Kategori
    const kategoriLinks = document.querySelectorAll('[data-kategori]');
    kategoriLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const kategori = this.getAttribute('data-kategori');
            const hasil = daftarBerita.filter(b => b.kategori === kategori);
            tampilkanBerita(hasil);
            document.getElementById('berita-terbaru').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Search dengan Enter
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchNews();
            }
        });
    }
});

// ============================================
// EXPORT KE GLOBAL
// ============================================
window.tampilkanBerita = tampilkanBerita;
window.bukaBerita = bukaBerita;
window.searchNews = searchNews;
window.refreshBerita = refreshBerita;
window.bukaTools = bukaTools;
