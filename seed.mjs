import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({});

async function main() {
  const email = 'fitrahramadhan310@gmail.com';
  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  if (!existingUser) {
    const password_hash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Fitrah Andhika Ramadhan',
        email,
        password_hash,
      }
    });
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
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
