import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to your Aurum account. Instantly access your dashboard, transfers, cards, and analytics with secure OTP-based authentication.',
  alternates: {
    canonical: '/auth/login',
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
