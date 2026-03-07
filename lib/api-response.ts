import { NextResponse } from 'next/server'
import { createLogger } from './logger'
import { ZodError } from 'zod'

const logger = createLogger('api-response')

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: any
}

export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status })
}

export function apiError(
  message: string,
  status = 400,
  details?: any
): NextResponse<ApiResponse> {
  logger.error({ message, status, details }, 'API Error')
  return NextResponse.json(
    { success: false, error: message, ...(details && { details }) },
    { status }
  )
}

export function apiValidationError(error: ZodError): NextResponse<ApiResponse> {
  const formatted = error.flatten().fieldErrors as Record<string, string[]>
  const formattedErrors = Object.entries(formatted).map(([field, messages]) => ({
    field,
    message: messages.join(', '),
  }))
  return apiError('Validation failed', 400, formattedErrors)
}