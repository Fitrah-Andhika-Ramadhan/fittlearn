const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const exp = await prisma.experience.findMany();
  console.log(JSON.stringify(exp, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
