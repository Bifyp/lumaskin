import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, apiValidationError } from '@/lib/api-response'
import { registerSchema } from '@/lib/validations'
import { hashPassword } from '@/auth'
import { createLogger } from '@/lib/logger'
import { ZodError } from 'zod'

const logger = createLogger('register-api')

async function checkUserExists(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

async function createUser(validatedData: any) {
  const hashedPassword = await hashPassword(validatedData.password);
  return await prisma.user.create({
    data: {
      email: validatedData.email,
      name: validatedData.name,
      password: hashedPassword,
      role: 'user'
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await checkUserExists(validatedData.email);
    if (existingUser) {
      logger.warn({ email: validatedData.email }, 'Registration attempt with existing email');
      return apiError('Email already registered', 400);
    }

    const user = await createUser(validatedData);
    logger.info({ userId: user.id }, 'User registered');
    return apiSuccess({ id: user.id, email: user.email, name: user.name }, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return apiValidationError(error);
    }
    logger.error(error, 'Registration failed');
    return apiError('Registration failed', 500);
  }
}