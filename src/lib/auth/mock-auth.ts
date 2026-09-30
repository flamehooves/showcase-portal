import { ALLOWED_EMAIL_DOMAIN, MOCK_OTP, OTP_EXPIRY_SECONDS } from '@/lib/constants'
import { MOCK_USERS } from '@/mock/data/users'
import type { User } from '@/types'

interface OTPSession {
  email: string
  otp: string
  expiresAt: number
  attempts: number
}

const OTP_STORE = new Map<string, OTPSession>()

export function isValidOfficeDomain(email: string): boolean {
  return email.toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN)
}

export async function requestOTP(email: string): Promise<{ success: boolean; error?: string }> {
  await delay(800)

  if (!isValidOfficeDomain(email)) {
    return { success: false, error: `Only ${ALLOWED_EMAIL_DOMAIN} email addresses are allowed.` }
  }

  const session: OTPSession = {
    email: email.toLowerCase(),
    otp: MOCK_OTP,
    expiresAt: Date.now() + OTP_EXPIRY_SECONDS * 1000,
    attempts: 0,
  }

  OTP_STORE.set(email.toLowerCase(), session)

  if (process.env.NODE_ENV === 'development') {
    console.info(`[MockAuth] OTP for ${email}: ${MOCK_OTP}`)
  }

  return { success: true }
}

export async function verifyOTP(
  email: string,
  otp: string
): Promise<{ success: boolean; user?: User; error?: string; expired?: boolean }> {
  await delay(1000)

  const session = OTP_STORE.get(email.toLowerCase())

  if (!session) {
    return { success: false, error: 'No OTP was requested for this email.' }
  }

  if (Date.now() > session.expiresAt) {
    OTP_STORE.delete(email.toLowerCase())
    return { success: false, expired: true, error: 'This code has expired. Please request a new one.' }
  }

  session.attempts++

  if (session.otp !== otp) {
    if (session.attempts >= 5) {
      OTP_STORE.delete(email.toLowerCase())
      return { success: false, error: 'Too many incorrect attempts. Please request a new code.' }
    }
    return { success: false, error: 'Incorrect code. Please try again.' }
  }

  OTP_STORE.delete(email.toLowerCase())

  const user = resolveUser(email.toLowerCase())
  return { success: true, user }
}

function resolveUser(email: string): User {
  const existing = MOCK_USERS.find((u) => u.email.toLowerCase() === email)
  if (existing) return existing

  return {
    id: `guest-${Date.now()}`,
    name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    email,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=0f172a&color=fff`,
    role: 'employee',
    team: 'Zoho',
    bio: '',
    isWorkshopParticipant: false,
    createdAt: new Date().toISOString(),
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface AuthService {
  requestOTP: typeof requestOTP
  verifyOTP: typeof verifyOTP
  isValidOfficeDomain: typeof isValidOfficeDomain
}
