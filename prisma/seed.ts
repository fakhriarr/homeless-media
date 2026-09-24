import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { promises as fs } from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function coverSvg(label: string): string {
  const palette = [
    ["#c8102e", "#7a0a1c"],
    ["#0f766e", "#083c38"],
    ["#1d4ed8", "#0b2568"],
    ["#b45309", "#5d2a05"],
    ["#7c3aed", "#3b1170"],
    ["#0d9488", "#065f56"],
  ];
  const [from, to] = palette[Math.floor(Math.random() * palette.length)];
  const title = label.length > 36 ? label.slice(0, 34) + "…" : label;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#g)"/>
  <circle cx="1100" cy="120" r="220" fill="#ffffff" opacity="0.08"/>
  <circle cx="140" cy="640" r="200" fill="#ffffff" opacity="0.06"/>
  <text x="64" y="600" font-family="Georgia, serif" font-size="52" font-weight="bold" fill="#ffffff">${title}</text>
  <text x="64" y="668" font-family="Arial, sans-serif" font-size="26" letter-spacing="4" fill="#ffffff" opacity="0.85">MEDIAKITA.ID</text>
</svg>`;
}

type SeedArticle = {
  category: string;
  title: string;
  views: number;
  daysAgo: number;
  status?: "PUBLISHED" | "DRAFT" | "HIDDEN";
  featured?: boolean;
  excerpt: string;
  paragraphs: string[];
};

const AUTHORS: Record<string, { name: string; bio: string }> = {
  admin: {
    name: "Dewi Lestari",
    bio: "Jurnalis dan pengelola konten MediaKita. Berpengalaman menulis isu nasional dan ekonomi.",
  },
  sport: {
    name: "Andi Pratama",
    bio: "Reporter olahraga yang mengikuti perkembangan sepak bola nasional dan internasional.",
  },
  tech: {
    name: "Rani Wijaya",
    bio: "Penulis teknologi yang membahas startup, gadget, dan perkembangan digital Indonesia.",
  },
};

const ARTICLES: SeedArticle[] = [
  {
    category: "Nasional",
    title: "Pemerintah Fokus Percepat Pembangunan Infrastruktur Digital di Daerah Terpencil",
    views: 4820,
    daysAgo: 0,
    featured: true,
    excerpt:
      "Program konektivitas digital menyasar lebih dari 500 desa di Indonesia Timur agar layanan publik dan pendidikan bisa menjangkau seluruh warga.",
    paragraphs: [
      "Pemerintah menegaskan komitmennya mempercepat pembangunan infrastruktur digital di daerah terpencil. Program ini menyasar lebih dari 500 desa di Indonesia Timur yang selama ini kesulitan mengakses layanan internet yang memadai.",
      "Menteri terkait menyebut akses internet bukan lagi sekadar kebutuhan hiburan, melainkan bagian dari layanan dasar seperti pendidikan, kesehatan, dan administrasi publik. \"Konektivitas adalah tangga menuju pemerataan,\" ujarnya dalam paparan di hadapan para kepala daerah.",
      "Tahap pertama pembangunan ditargetkan rampung pada akhir tahun ini, meliputi pemasangan menara telekomunikasi dan penyediaan perangkat pendukung di sekolah serta puskesmas setempat.",
      "Sejumlah akademisi menyambut baik kebijakan ini. Mereka berharap pembangunan tidak hanya berhenti pada infrastruktur fisik, tetapi juga diiringi pelatihan literasi digital bagi masyarakat setempat.",
    ],
  },
  {
    category: "Nasional",
    title: "Masyarakat Antusias Sambut Renovasi Pasar Tradisional di Sejumlah Kota",
    views: 2100,
    daysAgo: 1,
    excerpt:
      "Renovasi pasar tradisional bertujuan meningkatkan kenyamanan pedagang dan pembeli tanpa menghilangkan ciri khas ekonomi rakyat.",
    paragraphs: [
      "Renovasi pasar tradisional di sejumlah kota memasuki babak baru. Pemerintah daerah berkolaborasi dengan pedagang untuk menyulap bangunan tua menjadi lebih bersih, rapi, dan ramah pengunjung.",
      "Paguyuban pedagang menyatakan dukungannya, asalkan desain baru tetap mempertahankan karakter pasar rakyat dan biaya sewa tidak membebani pemilik kios.",
      "Gubernur setempat menargetkan sepuluh pasar rampung direnovasi dalam dua tahun. Ia berharap kebangkitan pasar tradisional turut menggerakkan usaha mikro di sekitarnya.",
    ],
  },
  {
    category: "Nasional",
    title: "Cuaca Ekstrem Melanda, Waspadai Hujan Lebat Disertai Angin Kencang",
    views: 3340,
    daysAgo: 2,
    excerpt:
      "Badan meteorologi mengimbau warga di pesisir dan daerah rawan longsor untuk meningkatkan kewaspadaan selama puncak musim hujan.",
    paragraphs: [
      "Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) mengeluarkan peringatan dini terkait potensi hujan lebat disertai angin kencang di sejumlah wilayah dalam sepekan ke depan.",
      "Wilayah yang perlu waspada antara lain pesisir utara Jawa, sebagian Sumatra Selatan, dan Kalimantan Barat. Cuaca ekstrem dipicu gelombang atmosfer yang aktif di sekitar wilayah Indonesia.",
      "Masyarakat diimbau menghindari berlindung di bawah pohon besar dan baliho saat hujan deras, serta memastikan saluran air di sekitar rumah tetap lancar.",
    ],
  },
  {
    category: "Ekonomi",
    title: "Rupiah Menguat di Tengah Optimisme Pemulihan Ekonomi Domestik",
    views: 4100,
    daysAgo: 0,
    featured: true,
    excerpt:
      "Penguatan nilai tukar didorong arus masuk modal asing dan data sektor manufaktur yang membaik.",
    paragraphs: [
      "Nilai tukar rupiah menguat pada perdagangan hari ini seiring masuknya aliran modal asing ke pasar obligasi dan saham domestik.",
      "Analis menilai optimisme pemulihan ekonomi dalam negeri menjadi katalis utama. Indeks manufaktur yang berada di zona ekspansi menunjukkan aktivitas industri mulai bergairah kembali.",
      "Bagi masyarakat, penguatan rupiah berpotensi menahan kenaikan harga barang impor. Pemerintah tetap mengimbau kewaspadaan terhadap gejolak ekonomi global.",
    ],
  },
  {
    category: "Ekonomi",
    title: "UMKM Dapat Keringanan Kredit, Begini Cara Mengaksesnya",
    views: 3650,
    daysAgo: 1,
    excerpt:
      "Program restrukturisasi kredit memberi ruang napas bagi pelaku usaha kecil menghadapi tekanan biaya produksi.",
    paragraphs: [
      "Pelaku usaha mikro, kecil, dan menengah (UMKM) kini dapat mengajukan keringanan kredit melalui program restrukturisasi yang diperpanjang pemerintah hingga akhir tahun.",
      "Keringanan berupa penundaan angsuran pokok dan penyesuaian bunga diharapkan memberi ruang napas di tengah tekanan biaya produksi.",
      "Pengusaha cukup datang ke bank penyalur dengan membawa dokumen usaha sederhana. Proses verifikasi dilakukan cepat agar bantuan tepat sasaran.",
    ],
  },
  {
    category: "Ekonomi",
    title: "Harga Pangan Stabil Jelang Akhir Pekan, Beras dan Minyak Goreng Terpantau Aman",
    views: 1980,
    daysAgo: 3,
    excerpt:
      "Pemerintah menggenjot pasokan dari daerah sentra produksi untuk menjaga stabilitas harga kebutuhan pokok.",
    paragraphs: [
      "Harga bahan pangan pokok terpantau stabil menjelang akhir pekan setelah pemerintah menggenjot pasokan dari daerah sentra produksi.",
      "Komoditas beras dan minyak goreng relatif aman, sementara cabai mengalami kenaikan tipis akibat cuaca di sentra produksi Jawa Barat.",
      "Kementerian Perdagangan memastikan stok nasional aman hingga beberapa bulan ke depan dan akan terus memantau distribusi ke pasar ritel modern maupun tradisional.",
    ],
  },
  {
    category: "Olahraga",
    title: "Timnas Siap Hadapi Laga Kualifikasi dengan Formasi Terbaik",
    views: 5280,
    daysAgo: 0,
    featured: true,
    excerpt:
      "Pelatih menegaskan seluruh pemain dalam kondisi prima dan siap merebut tiga poin di kandang.",
    paragraphs: [
      "Tim nasional melakukan sesi latihan tertutup terakhir menjelang laga kualifikasi pekan ini. Pelatih menegaskan seluruh pemain dalam kondisi prima dan siap tampil penuh.",
      "Strategi permainan disiapkan untuk mendominasi lini tengah dan memanfaatkan kecepatan pemain sayap. Dukungan suporter di stadion diperkirakan menjadi energi tambahan.",
      "Manajemen tim mengimbau para pendukung menjaga ketertiban selama pertandingan agar suasana tetap kondusif untuk seluruh penonton.",
    ],
  },
  {
    category: "Olahraga",
    title: "Liga Basket Nasional Bergulir Kembali, Sepuluh Tim Bertarung",
    views: 2750,
    daysAgo: 2,
    excerpt:
      "Musim baru dibuka dengan empat pertandingan seru yang mempertemukan tim-tim muda dan juara bertahan.",
    paragraphs: [
      "Liga basket nasional resmi kembali bergulir dengan sepuluh tim yang bertarung memperebutkan gelar juara musim ini.",
      "Seremoni pembukaan digelar meriah dengan pertunjukan musik dan pertandingan pembuka antara juara bertahan melawan finalis musim lalu.",
      "Manajemen liga memastikan sistem kompetisi penuh dengan format kandang-tandang dan jeda untuk agenda tim nasional.",
    ],
  },
  {
    category: "Olahraga",
    title: "Atlet Bulu Tangkis Melaju ke Perempat Final Usai Menang Dua Gim",
    views: 3100,
    daysAgo: 1,
    excerpt:
      "Tunggal putra Indonesia tampil percaya diri dan menekan lawan sejak gim pertama.",
    paragraphs: [
      "Tunggal putra Indonesia melaju ke perempat final turnamen internasional setelah menang dua gim langsung atas unggulan tuan rumah.",
      "Sejak gim pertama, permainan menyerang dan pengembalian keras yang rapi membuat lawan kesulitan mengembangkan pola serangan.",
      "Di babak berikutnya, wakil Indonesia akan menghadapi pemain unggulan dua yang sudah saling kenal dalam beberapa pertemuan sebelumnya.",
    ],
  },
  {
    category: "Teknologi",
    title: "Startup Lokal Kembangkan AI untuk Deteksi Dini Penyakit Tanaman",
    views: 4520,
    daysAgo: 0,
    featured: true,
    excerpt:
      "Model kecerdasan buatan yang dilatih ribuan citra tanaman mampu mengenali gejala penyakit dengan akurasi tinggi.",
    paragraphs: [
      "Sebuah startup pertanian berbasis teknologi meluncurkan aplikasi yang memanfaatkan kecerdasan buatan untuk mendeteksi dini penyakit tanaman padi dan jagung.",
      "Dengan kamera ponsel, petani cukup memotret daun tanaman untuk mendapatkan diagnosis dan rekomendasi penanganan dalam hitungan detik.",
      "Model AI dilatih menggunakan ribuan citra lapangan dan divalidasi bersama akademisi pertanian. Startup berencana memperluas cakupan ke komoditas hortikultura.",
    ],
  },
  {
    category: "Teknologi",
    title: "5 Tips Aman Berbelanja Online Menghindari Penipuan",
    views: 5980,
    daysAgo: 1,
    excerpt:
      "Kenali ciri-ciri penipuan daring dan lindungi data pribadi sebelum menekan tombol bayar.",
    paragraphs: [
      "Belanja online semakin mudah, namun risiko penipuan juga ikut meningkat. Pakar keamanan digital membagikan lima tips sederhana agar pengguna lebih aman.",
      "Pertama, pastikan nomor rekening penjual sesuai dengan nama toko. Kedua, hindari bertransaksi di luar platform resmi. Ketiga, jangan bagikan kode OTP kepada siapa pun.",
      "Keempat, cek ulasan dan reputasi toko sebelum membeli. Terakhir, simpan bukti transaksi sebagai dokumen jika terjadi sengketa.",
    ],
  },
  {
    category: "Teknologi",
    title: "Pemerintah Dorong Literasi Digital Bagi Generasi Muda",
    views: 2650,
    daysAgo: 4,
    excerpt:
      "Program pelatihan gratis diberikan untuk membekali pelajar dengan kemampuan berpikir kritis di ruang digital.",
    paragraphs: [
      "Pemerintah memperluas program literasi digital untuk pelajar dan mahasiswa di puluhan kota. Materi mencakup keamanan daring, etika bermedia sosial, dan deteksi informasi hoaks.",
      "Kepala lembaga terkait menegaskan literasi digital menjadi kebutuhan dasar di era komunikasi yang serba cepat.",
      "Program ini ditargetkan menjangkau sejuta peserta hingga akhir tahun melalui kerja sama dengan sekolah, kampus, dan komunitas lokal.",
    ],
  },
  {
    category: "Hiburan",
    title: "Film Lokal Pecahkan Rekor Penonton di Bioskop Selama Pekan Pertama",
    views: 6890,
    daysAgo: 0,
    featured: true,
    excerpt:
      "Karya sineas muda ini mendapat sambutan hangat berkat cerita yang dekat dengan kehidupan anak muda.",
    paragraphs: [
      "Sebuah film karya sineas muda berhasil memecahkan rekor jumlah penonton pada pekan pertama penayangannya. Cerita yang mengangkat kehidupan anak muda perkotaan dinilai relevan dengan keseharian audiens.",
      "Para kritikus memuji sinematografi dan dialog yang terasa jujur tanpa menghilangkan sisi menghibur. Distributor menambah jumlah layar untuk mengimbangi antusiasme penonton.",
      "Keberhasilan ini diharapkan mendorong produser lebih berani mendanai karya orisinal anak bangsa.",
    ],
  },
  {
    category: "Hiburan",
    title: "Festival Musik Akhir Pekan Ini Hadirkan Puluhan Musisi Lokal",
    views: 3420,
    daysAgo: 2,
    excerpt:
      "Gratis dan terbuka untuk umum, festival menampilkan beragam genre dari pop, rock, hingga elektronik.",
    paragraphs: [
      "Festival musik akhir pekan ini akan menghadirkan puluhan musisi lokal dari beragam genre. Penyelenggara menyiapkan dua panggung yang berjalan bergantian agar pengunjung tidak melewatkan aksi favorit mereka.",
      "Selain panggung utama, festival juga menghadirkan pasar kuliner dan area kreatif bagi pelaku usaha kecil.",
      "Tiket dibanderol terjangkau dan disediakan kuota gratis untuk pelajar. Para penonton diimbau memakai transportasi umum karena area parkir terbatas.",
    ],
  },
  {
    category: "Hiburan",
    title: "Serial Drama Remaja Indonesia Jadi Perbincangan Hangat",
    views: 2210,
    daysAgo: 3,
    excerpt:
      "Alur cerita yang segar dan pemeran pendatang baru membuat serial ini naik ke deretan terpopuler.",
    paragraphs: [
      "Serial drama remaja terbaru menjadi perbincangan hangat di media sosial. Cerita persahabatan dan konflik keluarga yang dikemas segar berhasil merebut perhatian penonton lintas generasi.",
      "Sejumlah pemeran pendatang baru menuai pujian atas akting natural mereka. Platform menayangkan dua episode baru setiap pekan.",
      "Produser menyebut musim kedua sudah dalam tahap pengembangan karena permintaan penonton yang tinggi.",
    ],
  },
  {
    category: "Gaya Hidup",
    title: "Pola Hidup Sehat: Mulai dari Sarapan Bergizi dan Olahraga Ringan",
    views: 4860,
    daysAgo: 0,
    excerpt:
      "Ahli gizi membagikan langkah sederhana membangun kebiasaan sehat yang bisa dimulai kapan saja.",
    paragraphs: [
      "Memulai pola hidup sehat tidak harus rumit. Ahli gizi menyarankan langkah sederhana: sarapan bergizi, cukup minum air, dan menyempatkan olahraga ringan tiga kali seminggu.",
      "Sarapan dengan kombinasi karbohidrat kompleks, protein, dan sayuran membuat energi terjaga hingga siang hari tanpa lonjakan gula darah.",
      "Konsistensi lebih penting daripada intensitas. Menjadwalkan jalan kaki 20 menit setelah makan siang adalah titik awal yang baik bagi pemula.",
    ],
  },
  {
    category: "Gaya Hidup",
    title: "Kuliner Nusantara Naik Kelas, Kini Diminati Wisatawan Asing",
    views: 3120,
    daysAgo: 2,
    excerpt:
      "Eksplorasi penyajian modern tanpa meninggalkan cita rasa tradisional membuat hidangan lokal semakin mendunia.",
    paragraphs: [
      "Kuliner Nusantara semakin dikenal wisatawan asing berkat eksplorasi penyajian modern oleh para koki muda.",
      "Bumbu tradisional dipertahankan, hanya cara menghidangkan yang ditata ulang agar menarik bagi penikmat kuliner internasional.",
      "Komunitas gastronomi berharap promosi kuliner daerah menjadi bagian dari strategi pariwisata nasional yang berkelanjutan.",
    ],
  },
  {
    category: "Gaya Hidup",
    title: "Tips Mengatur Keuangan Bulanan untuk Anak Muda",
    views: 5430,
    daysAgo: 1,
    excerpt:
      "Menerapkan aturan 50-30-20 membantu anak muda menabung tanpa merasa tertekan.",
    paragraphs: [
      "Perencana keuangan merekomendasikan aturan 50-30-20 untuk anak muda yang baru mulai mengelola penghasilan sendiri.",
      "Lima puluh persen pendapatan dialokasikan untuk kebutuhan pokok, tiga puluh persen untuk keinginan, dan dua puluh persen untuk tabungan serta investasi.",
      "Kuncinya adalah mencatat pengeluaran secara rutin dan meninjau ulang target setiap awal bulan agar tetap realistis.",
    ],
  },
  {
    category: "Teknologi",
    title: "Kecelakaan Digital: Pentingnya Cadangkan Data Secara Rutin",
    views: 940,
    daysAgo: 5,
    excerpt:
      "Kasus kehilangan data karena perangkat rusak menjadi pengingat pentingnya kebiasaan mencadangkan file.",
    paragraphs: [
      "Kasus kehilangan data akibat perangkat rusak atau terinfeksi virus kembali terjadi. Pengguna kehilangan foto, dokumen, hingga pekerjaan yang belum sempat disimpan.",
      "Pakar menyarankan kebiasaan mencadangkan data secara rutin ke penyimpanan awan atau perangkat eksternal.",
      "Cukup sorot folder penting lalu aktifkan sinkronisasi otomatis, risiko kehilangan data permanen dapat diminimalkan secara signifikan.",
    ],
  },
  {
    category: "Nasional",
    title: "Dunia Sepak Bola Sambut Kembalinya Kompetisi Usai Masa Kering",
    views: 1510,
    daysAgo: 6,
    status: "DRAFT",
    excerpt: "Kompetisi sepak bola tanah air bersiap menyapa kembali para pendukungnya.",
    paragraphs: [
      "Kompetisi sepak bola tanah air bersiap menyapa kembali para pendukungnya setelah masa jeda panjang.",
      "Klub-klub telah melakukan persiapan teknis dan non-teknis, termasuk verifikasi stadion dan perizinan pemain.",
      "Artikel ini masih disusun dan belum dirilis ke publik.",
    ],
  },
  {
    category: "Ekonomi",
    title: "Investasi Emas Kini Makin Digandrungi Generasi Muda",
    views: 640,
    daysAgo: 7,
    status: "HIDDEN",
    excerpt: "Data sementara menunjukkan tren pembelian emas digital meningkat pesat.",
    paragraphs: [
      "Data sementara menunjukkan tren pembelian emas digital meningkat pesat di kalangan generasi muda.",
      "Kemudahan akses lewat aplikasi dan nilai minimal yang rendah menjadi daya tarik utama.",
      "Artikel ini saat ini disembunyikan dari halaman publik untuk perbaikan lebih lanjut.",
    ],
  },
];

async function generateCovers(articles: SeedArticle[]): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "covers");
  await fs.mkdir(dir, { recursive: true });
  const urls: string[] = [];
  for (const a of articles) {
    const name = `${slugify(a.title).slice(0, 40)}.svg`;
    await fs.writeFile(path.join(dir, name), coverSvg(a.title));
    urls.push(`/covers/${name}`);
  }
  return urls;
}

async function main() {
  console.log("Seeding database…");

  await prisma.subscriber.deleteMany();
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categoriesData = [
    { name: "Nasional", slug: "nasional" },
    { name: "Ekonomi", slug: "ekonomi" },
    { name: "Olahraga", slug: "olahraga" },
    { name: "Teknologi", slug: "teknologi" },
    { name: "Hiburan", slug: "hiburan" },
    { name: "Gaya Hidup", slug: "gaya-hidup" },
  ];
  const categories = new Map<string, string>();
  for (const c of categoriesData) {
    const created = await prisma.category.create({ data: c });
    categories.set(c.name, created.id);
  }

  const admin = await prisma.user.create({
    data: {
      name: "Dewi Lestari",
      email: "admin@mediakita.id",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
      bio: AUTHORS.admin.bio,
    },
  });
  const sportAuthor = await prisma.user.create({
    data: {
      name: "Andi Pratama",
      email: "andi@mediakita.id",
      password: await bcrypt.hash("andi123", 10),
      role: "USER",
      bio: AUTHORS.sport.bio,
    },
  });
  const techAuthor = await prisma.user.create({
    data: {
      name: "Rani Wijaya",
      email: "rani@mediakita.id",
      password: await bcrypt.hash("rani123", 10),
      role: "USER",
      bio: AUTHORS.tech.bio,
    },
  });
  await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "reader@mediakita.id",
      password: await bcrypt.hash("reader123", 10),
      role: "USER",
    },
  });

  await prisma.subscriber.createMany({
    data: [
      { email: "sari@example.com" },
      { email: "joko@example.com" },
      { email: "maya@example.com" },
    ],
  });

  const covers = await generateCovers(ARTICLES);
  const now = Date.now();

  for (let i = 0; i < ARTICLES.length; i++) {
    const a = ARTICLES[i];
    const authorChoice = a.category === "Olahraga" ? sportAuthor : a.category === "Teknologi" ? techAuthor : admin;
    await prisma.article.create({
      data: {
        title: a.title,
        slug: slugify(a.title),
        excerpt: a.excerpt,
        content: a.paragraphs.join("\n\n"),
        coverImage: covers[i],
        status: a.status ?? "PUBLISHED",
        featured: a.featured ?? false,
        views: a.views,
        categoryId: categories.get(a.category),
        authorId: authorChoice.id,
        publishedAt: new Date(now - a.daysAgo * 86400000),
      },
    });
  }

  console.log(`Seeded ${ARTICLES.length} articles, ${categoriesData.length} categories, 4 users, 3 subscribers.`);
  console.log("Admin login  : admin@mediakita.id / admin123");
  console.log("Reader login : reader@mediakita.id / reader123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());