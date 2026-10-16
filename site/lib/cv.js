// Content taken from the CV. Keep it in sync with the CV, do not add claims that are not there.
// Only items relevant to QA/QC are shown here; the full CV has more (see the CV itself).
export const OWNER = "Lailatul Badriyah";

export const contacts = [
  ["Email", "lailatulbadriyah654@gmail.com", "mailto:lailatulbadriyah654@gmail.com"],
  ["LinkedIn", "linkedin.com/in/lailatulbadriyah", "https://www.linkedin.com/in/lailatulbadriyah/"],
  ["Linktree", "linktr.ee/lailaszh", "https://linktr.ee/lailaszh"],
];

export const skillGroups = [
  {
    title: "Testing & quality",
    lead: true,
    items: [
      "API testing",
      "Performance testing",
      "Functional validation",
      "Defect investigation",
      "Bug fix verification",
      "UAT",
    ],
  },
  {
    title: "Tools",
    items: ["Postman", "k6", "Swagger", "Scalar", "Newman"],
  },
  {
    title: "Teknis",
    items: ["REST API", "WebSocket", "JavaScript", "SQL", "Git"],
  },
];

export const education = {
  school: "Politeknik Negeri Malang",
  degree: "Sarjana Terapan, Teknik Informatika",
  period: "2021 – 2025",
  gpa: "IPK 3,95 / 4,00",
  achievements: [
    "5 kali juara lomba software development tingkat nasional",
    "Mahasiswa Berprestasi Jurusan Teknologi Informasi 2024 dan 2025",
    "Juara 3 bidang IoT, KMIPN 2024",
  ],
};

// Testing work comes first in each entry; the rest is development work.
export const jobs = [
  {
    role: "Application Developer",
    company: "PT Intelix Global Crossing, Malang",
    period: "Mar 2025 – sekarang",
    testing: [
      "Menguji performa 95 API dengan k6 (smoke, load, stress, spike, soak).",
      "Memakai Postman, Swagger, dan Scalar untuk memeriksa request dan response API serta menyelidiki masalah integrasi.",
      "Melakukan functional validation fitur aplikasi CMS dan Scoring selama pengembangan dan penyelesaian issue.",
      "Menyelidiki defect, melaporkannya lewat bug-tracking tool dan komunikasi tim, lalu memverifikasi perbaikannya.",
    ],
    dev: [
      "Membangun dan mengintegrasikan aplikasi web dengan React.js dan Next.js, memakai ±200 REST API dan ±15 koneksi WebSocket.",
      "Bekerja dengan tim lintas fungsi, melakukan code review, dan mengoordinasi tugas anak magang dalam sprint agile.",
    ],
  },
  {
    role: "Application Developer (magang)",
    company: "PT Intelix Global Crossing, Malang",
    period: "Jul 2024 – Des 2024",
    testing: ["Menyelidiki masalah terkait API saat mengintegrasikan ±95 REST API."],
    dev: [
      "Membangun fitur web dengan React.js, Vite, dan Tailwind CSS.",
      "Memimpin tim 3 orang, serta menulis dokumentasi teknis dan panduan pengguna.",
    ],
  },
  {
    role: "Full Stack Developer (magang)",
    company: "PT Amerta Indah Otsuka, Pasuruan",
    period: "Feb 2024 – Jul 2024",
    testing: [
      "Melakukan functional testing dan evaluasi pengguna untuk pengenalan gestur, pengambilan foto, dan pembuatan QR code.",
    ],
    dev: [
      "Membangun aplikasi photobooth hand gesture dengan Python, Flask, dan computer vision.",
      "Ikut memperbaiki UI/UX berdasarkan masukan pengguna. Aplikasi ini dipakai lebih dari 1.000 pengunjung.",
    ],
  },
];

export const projects = [
  {
    role: "Aplikasi Manajemen Proyek berbasis Kanban",
    company: "PT Intelix Global Crossing",
    period: "Okt 2024 – Mei 2025",
    testing: [
      "Functional validation dan scenario-based testing untuk manajemen workflow, penugasan, pelaporan, dan monitoring proyek.",
      "Mendukung User Acceptance Testing (UAT) dengan hasil evaluasi 96,25% dari 6 responden.",
    ],
    dev: ["Membangun aplikasinya dengan framework Kanban dan metode Agile Prototyping."],
  },
];
