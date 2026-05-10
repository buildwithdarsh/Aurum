'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { m, AnimatePresence } from 'framer-motion';
import { Fingerprint, FileText, Globe, Vote, Car } from 'lucide-react';
import { TZ } from '@/lib/tz';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import { fadeUp, EASE_EXPO } from '@/lib/animations';
import type { KycDocumentType } from '@buildwithdarsh/sdk';

const documentTypes: { value: KycDocumentType; label: string; icon: typeof Fingerprint }[] = [
  { value: 'aadhaar', label: 'Aadhaar Card', icon: Fingerprint },
  { value: 'pan', label: 'PAN Card', icon: FileText },
  { value: 'passport', label: 'Passport', icon: Globe },
  { value: 'voter_id', label: 'Voter ID', icon: Vote },
  { value: 'driving_license', label: 'Driving License', icon: Car },
];

export default function KycForm() {
  const router = useRouter();
  const setKycStatus = useAuthStore((s) => s.setKycStatus);
  const addToast = useUIStore((s) => s.addToast);

  const [docType, setDocType] = useState<KycDocumentType>('aadhaar');
  const [docNumber, setDocNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await TZ.storefront.banking.kyc.submit({
        documentType: docType,
        documentNumber: docNumber,
      });
      const status = await TZ.storefront.banking.kyc.getStatus();
      setKycStatus(status);
      setSubmitted(true);
      addToast({ type: 'success', title: 'KYC submitted for verification' });
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

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <m.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE_EXPO }}
          className="bg-zinc-900/70 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.06] text-center"
        >
          {/* Animated checkmark */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            {/* Gold glow */}
            <m.div
              className="absolute inset-0 rounded-full bg-amber-400/20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.4, opacity: [0, 0.6, 0.2] }}
              transition={{ duration: 1, ease: EASE_EXPO }}
            />
            <m.div
              className="absolute inset-0 rounded-full bg-amber-400/10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: EASE_EXPO }}
            />
            <svg
              viewBox="0 0 80 80"
              className="relative w-full h-full"
              aria-hidden="true"
            >
              <m.circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="rgba(251,191,36,0.3)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: EASE_EXPO }}
              />
              <m.path
                d="M24 40 L35 51 L56 30"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.4, ease: EASE_EXPO }}
              />
            </svg>
          </div>

          <m.h2
            className="text-xl font-semibold text-white mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4, ease: EASE_EXPO }}
          >
            KYC Submitted
          </m.h2>
          <m.p
            className="text-zinc-400 text-sm mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4, ease: EASE_EXPO }}
          >
            Your documents are being verified. This usually takes 24-48 hours.
          </m.p>

          <m.button
            onClick={() => router.push('/dashboard')}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4, ease: EASE_EXPO }}
            className="px-8 py-3 bg-amber-400 text-zinc-950 font-semibold rounded-xl hover:bg-amber-300 transition-all text-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
          >
            Go to Dashboard
          </m.button>
        </m.div>
      ) : (
        <m.div
          key="form"
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
          variants={fadeUp}
          className="bg-zinc-900/70 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.06]"
        >
          <h1 className="text-xl font-semibold text-white mb-1">KYC Verification</h1>
          <p className="text-zinc-400 text-sm mb-6">
            Submit your identity document to activate your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Document type cards */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">Document Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {documentTypes.map((dt, i) => {
                  const Icon = dt.icon;
                  const isSelected = docType === dt.value;
                  return (
                    <m.button
                      key={dt.value}
                      type="button"
                      onClick={() => setDocType(dt.value)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3, ease: EASE_EXPO }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400/60 bg-amber-400/[0.08]'
                          : 'border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50'
                      }`}
                    >
                      {isSelected && (
                        <m.div
                          layoutId="kyc-doc-highlight"
                          className="absolute inset-0 rounded-xl border border-amber-400/60"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <Icon
                        className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-zinc-400'} transition-colors`}
                        strokeWidth={1.5}
                      />
                      <span className={`text-xs font-medium ${isSelected ? 'text-amber-400' : 'text-zinc-400'} transition-colors`}>
                        {dt.label}
                      </span>
                    </m.button>
                  );
                })}
              </div>
            </div>

            {/* Document number */}
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3, ease: EASE_EXPO }}
            >
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Document Number</label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder={
                  docType === 'aadhaar' ? '1234 5678 9012' :
                  docType === 'pan' ? 'ABCDE1234F' :
                  'Document number'
                }
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all"
                required
              />
            </m.div>

            {/* Submit button */}
            <m.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 bg-amber-400 text-zinc-950 font-semibold rounded-xl hover:bg-amber-300 transition-all disabled:opacity-50 text-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
            >
              {loading ? LoadingDots : 'Submit for Verification'}
            </m.button>
          </form>

          {/* Skip for now */}
          <div className="text-center mt-4">
            <Link
              href="/dashboard"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Skip for now
            </Link>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
