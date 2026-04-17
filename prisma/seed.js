import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'bi.admin@bi.go.id' },
    update: {},
    create: {
      email: 'bi.admin@bi.go.id',
      password,
      role: 'BI',
      namaLengkap: 'Admin BI'
    }
  });

  await prisma.user.upsert({
    where: { email: 'pjp.lapangan@bank.id' },
    update: {},
    create: {
      email: 'pjp.lapangan@bank.id',
      password,
      role: 'PJP',
      namaLengkap: 'Petugas Lapangan PJP'
    }
  });

  console.log('Seed selesai. Login default: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
