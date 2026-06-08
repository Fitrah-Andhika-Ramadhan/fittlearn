import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient({});

async function main() {
  const projects = [
    {
      title: 'Fitt Desk',
      slug: 'fitt-desk',
      short_desc: 'Sistem Helpdesk & Ticketing terpadu untuk manajemen tiket dan pelaporan.',
      long_desc: 'Fitt Desk adalah platform manajemen helpdesk yang dibangun menggunakan Laravel dan Inertia.js. Menyediakan fitur lengkap untuk pelacakan tiket, manajemen knowledge base, live chat, analitik, dan pelaporan harian.',
      thumbnail_url: '/placeholder.svg?height=200&width=300&text=Fitt+Desk',
      gallery_urls: JSON.stringify([]),
      demo_url: 'https://fitt-desk.vercel.app/',
      status: 'published',
      is_featured: true,
      sort_order: 1
    },
    {
      title: "FitLearned - AI Document Processor",
      slug: "fitlearned",
      short_desc: "Platform untuk merangkum dokumen PDF dan Word menggunakan AI, membantu mahasiswa dan profesional menghemat waktu belajar.",
      long_desc: "FitLearned adalah platform AI-powered yang dirancang khusus untuk membantu mahasiswa dan profesional dalam memproses dokumen dengan lebih efisien. Aplikasi ini menggunakan teknologi AI canggih untuk mengekstrak informasi penting dari dokumen.",
      github_url: "https://github.com/Fitrah-Andhika-Ramadhan/fitlearned",
      demo_url: "/summarizer",
      thumbnail_url: "/placeholder.svg?height=200&width=300&text=FitLearned",
      gallery_urls: JSON.stringify([]),
      status: "published",
      is_featured: true,
      sort_order: 2
    },
    {
      title: "E-Learning Management System",
      slug: "elearning",
      short_desc: "Sistem manajemen pembelajaran online dengan fitur video streaming, quiz interaktif, dan tracking progress.",
      long_desc: "Sistem LMS lengkap yang dibangun dengan Laravel dan Vue.js, menyediakan platform pembelajaran online yang komprehensif.",
      github_url: "https://github.com/Fitrah-Andhika-Ramadhan/elearning-lms",
      demo_url: "https://elearning-lms-i3jk.vercel.app/",
      thumbnail_url: "/placeholder.svg?height=200&width=300&text=E-Learning",
      gallery_urls: JSON.stringify([]),
      status: "published",
      is_featured: true,
      sort_order: 3
    }
  ];

  for (const project of projects) {
    const existing = await prisma.project.findUnique({ where: { slug: project.slug } });
    if (!existing) {
      await prisma.project.create({ data: project });
      console.log(`Created ${project.title}`);
    } else {
      console.log(`Project ${project.title} already exists`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
