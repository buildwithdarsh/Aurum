import type { Metadata } from 'next';
import KycForm from './KycForm';

export const metadata: Metadata = {
  title: 'KYC Verification',
  description:
    'Complete your Aurum KYC verification with Aadhaar, PAN, or Passport. Quick, secure identity verification to activate your banking account.',
  alternates: {
    canonical: '/auth/kyc',
  },
};

export default function KycPage() {
  return <KycForm />;
}
