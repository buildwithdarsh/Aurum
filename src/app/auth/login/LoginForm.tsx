'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { m, AnimatePresence } from 'framer-motion';
import { TZ } from '@/lib/tz';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import { setAuthCookie } from '@/lib/auth-cookie';
import { fadeUp, EASE_EXPO } from '@/lib/animations';

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const addToast = useUIStore((s) => s.addToast);

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await TZ.storefront.auth.sendOtp({ identifier: phone, type: 'login' });
      setStep('otp');
      addToast({ type: 'success', title: 'OTP sent to your phone' });
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to send OTP', description: err instanceof Error ? err.message : 'Try again' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const res = await TZ.storefront.auth.demoLogin();
      setUser(res.user);
      setAuthCookie(res.accessToken);
      router.push('/dashboard');
    } catch (err) {
      addToast({ type: 'error', title: 'Demo login failed', description: err instanceof Error ? err.message : 'Try again' });
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
      const res = await TZ.storefront.auth.verifyOtp({ identifier: phone, otp: otpString, type: 'login' });
      setUser(res.user);
      setAuthCookie(res.accessToken);
      router.push('/dashboard');
    } catch (err) {
      addToast({ type: 'error', title: 'Verification failed', description: err instanceof Error ? err.message : 'Invalid OTP' });
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'phone' ? (
        <m.div
          key="phone"
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
          variants={fadeUp}
          className="bg-zinc-900/70 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.06]"
        >
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-8 h-0.5 bg-zinc-700" />
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
          </div>

          <h1 className="text-xl font-semibold text-white mb-1">Sign In to Your Account</h1>
          <p className="text-zinc-400 text-sm mb-6">Enter your phone number to sign in</p>

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
              {loading ? (
                <span className="flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-bounce [animation-delay:300ms]" />
                </span>
              ) : 'Send OTP'}
            </m.button>
          </form>

          <div className="mt-5">
            <div className="relative flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-zinc-700" />
              <span className="text-xs text-zinc-500">or</span>
              <div className="flex-1 h-px bg-zinc-700" />
            </div>
            <m.button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 border border-amber-400/30 bg-amber-400/5 text-amber-400 font-semibold rounded-xl hover:bg-amber-400/10 transition-all disabled:opacity-50 text-sm"
            >
              Try Demo Account
            </m.button>
            <p className="text-center text-[11px] text-zinc-600 mt-1.5">Explore with a pre-configured demo account</p>
          </div>

          <p className="text-center text-sm text-zinc-500 mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-amber-400 hover:underline">Create one</Link>
          </p>
        </m.div>
      ) : (
        <m.div
          key="otp"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: EASE_EXPO }}
          className="bg-zinc-900/70 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.06]"
        >
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-8 h-0.5 bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
          </div>

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
              {loading ? (
                <span className="flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-bounce [animation-delay:300ms]" />
                </span>
              ) : 'Verify & Sign In'}
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
    </AnimatePresence>
  );
}
