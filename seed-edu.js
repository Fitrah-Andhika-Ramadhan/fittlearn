const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.experience.create({
    data: {
      type: "education",
      title: "Sarjana Sistem Informasi",
      organization: "Telkom University",
      description: "3.64/4.00",
      key_points: JSON.stringify([
        "Currently studying Data Analytics & Software Development with AI",
        "Active in student organizations and technical workshops",
        "Relevant coursework: Database Systems, Enterprise Architecture, Web Development"
      ]),
      start_date: new Date("2021-08-01"),
      end_date: new Date("2025-08-01"),
      sort_order: 1
    }
  });
  console.log("Education added!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
