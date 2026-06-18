import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({});

async function main() {
  const email = 'fitrahramadhan310@gmail.com';
  const password_hash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email },
    update: { password_hash },
    create: { email, name: 'Admin', password_hash }
  });
  console.log('Password reset to admin123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
