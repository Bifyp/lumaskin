import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'
import { createLogger } from '../lib/logger'

const logger = createLogger('seed')

async function main() {
  // Перевірити чи адмін уже існує
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'admin' }
  })

  if (existingAdmin) {
    logger.info('Admin user already exists')
    return
  }

  // Створити першого адміна
  const adminPassword = await hash('Admin@12345', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@salon.local',
      name: 'Administrator',
      password: adminPassword,
      role: 'admin',
      emailVerified: new Date()
    }
  })

  logger.info({ adminId: admin.id }, 'Admin user created')
  console.log(`\n✅ Admin created:\nEmail: ${admin.email}\nPassword: Admin@12345\n⚠️  CHANGE THIS PASSWORD IMMEDIATELY!\n`)
}

main()
  .catch((e) => {
    logger.error(e, 'Seed failed')
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })