'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { m, AnimatePresence } from 'framer-motion';
import { TZ } from '@/lib/tz';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import { setAuthCookie } from '@/lib/auth-cookie';
import { fadeUp, EASE_EXPO } from '@/lib/animations';

type Step = 'phone' | 'otp' | 'details';

const STEPS: Step[] = ['phone', 'otp', 'details'];

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.indexOf(current);
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <m.div
            className="w-2 h-2 rounded-full"
            animate={{
              backgroundColor: i <= idx ? '#fbbf24' : '#3f3f46',
              scale: i === idx ? 1.2 : 1,
            }}
            transition={{ duration: 0.3, ease: EASE_EXPO }}
          />
          {i < STEPS.length - 1 && (
            <m.div
              className="w-8 h-0.5"
              animate={{ backgroundColor: i < idx ? '#fbbf24' : '#3f3f46' }}
              transition={{ duration: 0.3, ease: EASE_EXPO }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: '', color: 'bg-zinc-700', width: 'w-0' };
  if (pw.length < 6) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' };
  if (pw.length <= 8) return { label: 'Medium', color: 'bg-amber-400', width: 'w-2/3' };
  return { label: 'Strong', color: 'bg-emerald-400', width: 'w-full' };
}

export default function SignupForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const addToast = useUIStore((s) => s.addToast);

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await TZ.storefront.auth.startSignup({ phone });
      setStep('otp');
      addToast({ type: 'success', title: 'OTP sent to your phone' });
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to send OTP', description: err instanceof Error ? err.message : 'Try again' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) return;
    setLoading(true);
    try {
      await TZ.storefront.auth.verifySignupOtp({ phone, otp: otpString });
      setStep('details');
    } catch (err) {
      addToast({ type: 'error', title: 'Verification failed', description: err instanceof Error ? err.message : 'Invalid OTP' });
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await TZ.storefront.auth.completeSignup({ name, email, password });
      setUser(res.user);
      setAuthCookie(res.accessToken);
      router.push('/auth/kyc');
    } catch (err) {
      addToast({ type: 'error', title: 'Failed', description: err instanceof Error ? err.message : 'Try again' });
    } finally {
      setLoading(false);
    }
  };

  const LoadingDots = (
    <span className="flex items-center justify-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-bounce [animation-delay:300ms]" />
    </span>
  );

  const inputClass = "flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all";

  return (
    <AnimatePresence mode="wait">
      {step === 'phone' && (
        <m.div
          key="phone"
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
          variants={fadeUp}
          className="bg-zinc-900/70 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.06]"
        >
          <StepIndicator current="phone" />

          <h1 className="text-xl font-semibold text-white mb-1">Create Your Account</h1>
          <p className="text-zinc-400 text-sm mb-6">Enter your mobile number to get started</p>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Phone Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-zinc-700 bg-zinc-800/50 text-zinc-400 text-sm">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-r-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all"
                  required
                />
              </div>
            </div>
            <m.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 bg-amber-400 text-zinc-950 font-semibold rounded-xl hover:bg-amber-300 transition-all disabled:opacity-50 text-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
            >
              {loading ? LoadingDots : 'Send OTP'}
            </m.button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-amber-400 hover:underline">Sign in</Link>
          </p>
        </m.div>
      )}

      {step === 'otp' && (
        <m.div
          key="otp"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: EASE_EXPO }}
          className="bg-zinc-900/70 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.06]"
        >
          <StepIndicator current="otp" />

          <h2 className="text-xl font-semibold text-white mb-1">Verify OTP</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Enter the 6-digit code sent to{' '}
            <span className="text-zinc-300">{phone}</span>
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* OTP Boxes */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, i) => (
                <m.input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, ease: EASE_EXPO }}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-zinc-800/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all"
                />
              ))}
            </div>

            <m.button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 bg-amber-400 text-zinc-950 font-semibold rounded-xl hover:bg-amber-300 transition-all disabled:opacity-50 text-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
            >
              {loading ? LoadingDots : 'Verify'}
            </m.button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); }}
              className="text-sm text-amber-400 hover:underline"
            >
              Change phone number
            </button>
          </div>
        </m.div>
      )}

      {step === 'details' && (
        <m.div
          key="details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: EASE_EXPO }}
          className="bg-zinc-900/70 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.06]"
        >
          <StepIndicator current="details" />

          <h2 className="text-xl font-semibold text-white mb-1">Complete Your Profile</h2>
          <p className="text-zinc-400 text-sm mb-6">Just a few more details to set up your account</p>

          <form onSubmit={handleComplete} className="space-y-4">
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.4, ease: EASE_EXPO }}
            >
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className={inputClass + ' w-full rounded-xl'}
                required
              />
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4, ease: EASE_EXPO }}
            >
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className={inputClass + ' w-full rounded-xl'}
              />
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4, ease: EASE_EXPO }}
            >
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className={inputClass + ' w-full rounded-xl'}
                required
                minLength={6}
              />
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2"
                >
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <m.div
                      className={`h-full ${strength.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: strength.width === 'w-1/3' ? '33%' : strength.width === 'w-2/3' ? '66%' : '100%' }}
                      transition={{ duration: 0.3, ease: EASE_EXPO }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${
                    strength.label === 'Weak' ? 'text-red-400' :
                    strength.label === 'Medium' ? 'text-amber-400' :
                    'text-emerald-400'
                  }`}>
                    {strength.label}
                  </p>
                </m.div>
              )}
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: EASE_EXPO }}
            >
              <m.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 bg-amber-400 text-zinc-950 font-semibold rounded-xl hover:bg-amber-300 transition-all disabled:opacity-50 text-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
              >
                {loading ? LoadingDots : 'Create Account'}
              </m.button>
            </m.div>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-amber-400 hover:underline">Sign in</Link>
          </p>
        </m.div>
      )}
    </AnimatePresence>
  );
}
