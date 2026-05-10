import type { Metadata } from 'next';
import SignupForm from './SignupForm';

export const metadata: Metadata = {
  title: 'Create Your Free Account',
  description:
    'Open a free Aurum digital banking account in minutes. No paperwork, no branch visits — just your phone and Aadhaar for quick, secure verification.',
  alternates: {
    canonical: '/auth/signup',
  },
};

export default function SignupPage() {
  return <SignupForm />;
}
