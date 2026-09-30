'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, EnvelopeSimple, CircleNotch } from '@phosphor-icons/react'
import { requestOTP, verifyOTP } from '@/lib/auth/mock-auth'
import { useAuthStore } from '@/stores/auth-store'
import { ALLOWED_EMAIL_DOMAIN, OTP_EXPIRY_SECONDS } from '@/lib/constants'

type Step = 'email' | 'otp'

const slideVariants = {
  enterFromRight: { x: 40, opacity: 0 },
  enterFromLeft: { x: -40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitToLeft: { x: -40, opacity: 0 },
  exitToRight: { x: 40, opacity: 0 },
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function SignInPage() {
  const router = useRouter()
  const signIn = useAuthStore((s) => s.signIn)

  const [step, setStep] = useState<Step>('email')
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  // Email step
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)

  // OTP step
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [otpExpired, setOtpExpired] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [countdown, setCountdown] = useState(OTP_EXPIRY_SECONDS)
  const [resendLoading, setResendLoading] = useState(false)

  const digitRefs = useRef<Array<HTMLInputElement | null>>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    setCountdown(OTP_EXPIRY_SECONDS)
    setOtpExpired(false)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setOtpExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEmailError('')

    const trimmed = email.trim().toLowerCase()
    if (!trimmed.endsWith(ALLOWED_EMAIL_DOMAIN)) {
      setEmailError(`Please use your ${ALLOWED_EMAIL_DOMAIN} address.`)
      return
    }

    setEmailLoading(true)
    const result = await requestOTP(trimmed)
    setEmailLoading(false)

    if (!result.success) {
      setEmailError(result.error ?? 'Something went wrong. Please try again.')
      return
    }

    setDigits(['', '', '', '', '', ''])
    setOtpError('')
    setDirection('forward')
    setStep('otp')
    startTimer()
    setTimeout(() => digitRefs.current[0]?.focus(), 150)
  }

  function handleDigitChange(index: number, value: string) {
    // Handle paste
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6)
      const next = [...digits]
      for (let i = 0; i < pasted.length; i++) {
        if (index + i < 6) next[index + i] = pasted[i]
      }
      setDigits(next)
      const focusIndex = Math.min(index + pasted.length, 5)
      digitRefs.current[focusIndex]?.focus()
      return
    }

    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    setDigits(next)
    setOtpError('')

    if (digit && index < 5) {
      digitRefs.current[index + 1]?.focus()
    }
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits]
        next[index] = ''
        setDigits(next)
      } else if (index > 0) {
        digitRefs.current[index - 1]?.focus()
      }
    }
  }

  async function handleOTPSubmit(e: React.FormEvent) {
    e.preventDefault()
    const otp = digits.join('')
    if (otp.length < 6) {
      setOtpError('Please enter all 6 digits.')
      return
    }

    setOtpLoading(true)
    const result = await verifyOTP(email.trim().toLowerCase(), otp)
    setOtpLoading(false)

    if (!result.success) {
      if (result.expired) {
        setOtpExpired(true)
        setOtpError(result.error ?? 'Code expired. Please request a new one.')
      } else {
        setOtpError(result.error ?? 'Invalid code. Please try again.')
        setDigits(['', '', '', '', '', ''])
        setTimeout(() => digitRefs.current[0]?.focus(), 50)
      }
      return
    }

    if (result.user) {
      signIn(result.user)
      router.push('/')
    }
  }

  async function handleResend() {
    setResendLoading(true)
    const result = await requestOTP(email.trim().toLowerCase())
    setResendLoading(false)
    if (result.success) {
      setDigits(['', '', '', '', '', ''])
      setOtpError('')
      startTimer()
      setTimeout(() => digitRefs.current[0]?.focus(), 50)
    } else {
      setOtpError(result.error ?? 'Failed to resend. Please try again.')
    }
  }

  function handleChangeEmail() {
    setDirection('back')
    setStep('email')
    setOtpError('')
    setDigits(['', '', '', '', '', ''])
    if (timerRef.current) clearInterval(timerRef.current)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      {/* Subtle background pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 20%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(circle at 75% 80%, rgba(16,185,129,0.06) 0%, transparent 50%)',
        }}
      />

      <div className="relative w-full max-w-sm px-4">
        {/* Logo / Wordmark */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Showcase
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Discover what we&apos;re building.
          </p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <AnimatePresence mode="wait" initial={false}>
            {step === 'email' ? (
              <motion.div
                key="email"
                initial={direction === 'forward' ? slideVariants.enterFromLeft : slideVariants.enterFromRight}
                animate={slideVariants.center}
                exit={direction === 'forward' ? slideVariants.exitToLeft : slideVariants.exitToRight}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
              >
                <form onSubmit={handleEmailSubmit} className="p-8 space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                      Sign in
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Use your{' '}
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">
                        {ALLOWED_EMAIL_DOMAIN}
                      </span>{' '}
                      address to continue.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                    >
                      Work email
                    </label>
                    <div className="relative">
                      <EnvelopeSimple
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                        size={16}
                        weight="regular"
                      />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setEmailError('')
                        }}
                        placeholder={`you${ALLOWED_EMAIL_DOMAIN}`}
                        autoComplete="email"
                        autoFocus
                        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
                      />
                    </div>
                    {emailError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500"
                      >
                        {emailError}
                      </motion.p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={emailLoading || !email.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
                  >
                    {emailLoading ? (
                      <CircleNotch className="animate-spin" size={16} />
                    ) : null}
                    {emailLoading ? 'Sending code…' : 'Continue'}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={direction === 'forward' ? slideVariants.enterFromRight : slideVariants.enterFromLeft}
                animate={slideVariants.center}
                exit={direction === 'forward' ? slideVariants.exitToRight : slideVariants.exitToLeft}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
              >
                <form onSubmit={handleOTPSubmit} className="p-8 space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                      Check your email
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      We sent a 6-digit code to{' '}
                      <span className="font-medium text-neutral-700 dark:text-neutral-300 break-all">
                        {email}
                      </span>
                    </p>
                  </div>

                  {/* Digit inputs */}
                  <div className="flex gap-2 justify-between">
                    {digits.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => { digitRefs.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={d}
                        onChange={(e) => handleDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleDigitKeyDown(i, e)}
                        onPaste={(e) => {
                          e.preventDefault()
                          handleDigitChange(i, e.clipboardData.getData('text'))
                        }}
                        className="h-12 w-12 rounded-lg border border-neutral-200 bg-neutral-50 text-center text-lg font-semibold text-neutral-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
                        aria-label={`Digit ${i + 1}`}
                      />
                    ))}
                  </div>

                  {/* Error */}
                  {otpError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500"
                    >
                      {otpError}
                    </motion.p>
                  )}

                  {/* Timer / Resend */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                    {countdown > 0 && !otpExpired ? (
                      <span>
                        Code expires in{' '}
                        <span className="font-medium tabular-nums text-neutral-700 dark:text-neutral-300">
                          {formatCountdown(countdown)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400">Code expired</span>
                    )}

                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={countdown > 0 && !otpExpired || resendLoading}
                      className="font-medium text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      {resendLoading ? 'Sending…' : 'Resend code'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading || digits.join('').length < 6 || otpExpired}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
                  >
                    {otpLoading ? (
                      <CircleNotch className="animate-spin" size={16} />
                    ) : null}
                    {otpLoading ? 'Verifying…' : 'Sign in'}
                  </button>

                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="flex w-full items-center justify-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  >
                    <ArrowLeft size={12} />
                    Change email
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dev hint */}
        {process.env.NODE_ENV === 'development' && (
          <p className="mt-4 text-center text-xs text-neutral-400">
            Dev hint: use code{' '}
            <span className="font-mono font-medium text-neutral-600 dark:text-neutral-300">
              847291
            </span>
          </p>
        )}
      </div>
    </div>
  )
}
