'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TZ } from '@/lib/tz';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import { clearAuthCookie } from '@/lib/auth-cookie';
import { fadeUp, staggerContainer, buttonTap } from '@/lib/animations';
import { Toggle } from '@/components/ui/Toggle';
import { Badge } from '@/components/ui/Badge';
import {
  User,
  Shield,
  Bell,
  Smartphone,
  Globe,
  Lock,
  LogOut,
  ChevronRight,
  Fingerprint,
  Eye,
  Moon,
  HelpCircle,
  FileText,
  Mail,
  Phone,
} from 'lucide-react';

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

function SettingRow({ icon, label, description, action, onClick, danger }: SettingRowProps) {
  return (
    <m.div
      variants={fadeUp}
      onClick={onClick}
      className={`flex items-center gap-3 py-3.5 border-b border-white/[0.04] last:border-0 ${onClick ? 'cursor-pointer active:bg-white/[0.02] -mx-4 px-4 rounded-lg' : ''}`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-red-400/10 text-red-400' : 'bg-white/[0.06] text-zinc-400'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${danger ? 'text-red-400' : 'text-white'}`}>{label}</p>
        {description && <p className="text-[11px] text-zinc-500 mt-0.5">{description}</p>}
      </div>
      {action ?? (onClick && <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />)}
    </m.div>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1 px-1">{title}</p>
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4">
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const kycStatus = useAuthStore((s) => s.kycStatus);
  const logout = useAuthStore((s) => s.logout);
  const addToast = useUIStore((s) => s.addToast);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    TZ.client.clearEndUserTokens();
    clearAuthCookie();
    logout();
    router.push('/auth/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AU';

  return (
    <m.div
      initial="hidden"
      animate="show"
      variants={staggerContainer}
      className="space-y-5 max-w-lg mx-auto"
    >
      {/* Profile Header */}
      <m.div variants={fadeUp} className="flex flex-col items-center py-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 text-2xl font-bold mb-3">
          {initials}
        </div>
        <p className="text-lg font-semibold text-white">{user?.name ?? 'User'}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{user?.phone ?? user?.email ?? ''}</p>
        <div className="flex gap-2 mt-2">
          {kycStatus?.isFullyVerified ? (
            <Badge variant="success">KYC Verified</Badge>
          ) : (
            <Badge variant="warning">KYC Pending</Badge>
          )}
        </div>
      </m.div>

      {/* Account */}
      <m.div variants={fadeUp}>
        <SettingSection title="Account">
          <SettingRow
            icon={<User className="w-4 h-4" />}
            label="Edit Profile"
            description="Name, email, phone"
            onClick={() => addToast({ type: 'info', title: 'Coming soon' })}
          />
          <SettingRow
            icon={<Mail className="w-4 h-4" />}
            label="Email"
            action={<span className="text-xs text-zinc-500 truncate max-w-[140px]">{user?.email ?? 'Not set'}</span>}
          />
          <SettingRow
            icon={<Phone className="w-4 h-4" />}
            label="Phone"
            action={<span className="text-xs text-zinc-500">{user?.phone ?? 'Not set'}</span>}
          />
        </SettingSection>
      </m.div>

      {/* Security */}
      <m.div variants={fadeUp}>
        <SettingSection title="Security">
          <SettingRow
            icon={<Lock className="w-4 h-4" />}
            label="Change Password"
            onClick={() => addToast({ type: 'info', title: 'Coming soon' })}
          />
          <SettingRow
            icon={<Fingerprint className="w-4 h-4" />}
            label="Biometric Login"
            description="Use fingerprint or Face ID"
            action={<Toggle enabled={biometricEnabled} onChange={() => setBiometricEnabled(!biometricEnabled)} />}
          />
          <SettingRow
            icon={<Shield className="w-4 h-4" />}
            label="Two-Factor Auth"
            description="OTP on every login"
            action={<Badge variant="success">Enabled</Badge>}
          />
          <SettingRow
            icon={<Eye className="w-4 h-4" />}
            label="Login Activity"
            description="View recent sessions"
            onClick={() => addToast({ type: 'info', title: 'Coming soon' })}
          />
        </SettingSection>
      </m.div>

      {/* Notifications */}
      <m.div variants={fadeUp}>
        <SettingSection title="Notifications">
          <SettingRow
            icon={<Bell className="w-4 h-4" />}
            label="Push Notifications"
            description="Transaction alerts, offers"
            action={<Toggle enabled={pushEnabled} onChange={() => setPushEnabled(!pushEnabled)} />}
          />
          <SettingRow
            icon={<Mail className="w-4 h-4" />}
            label="Email Notifications"
            description="Statements, reports"
            action={<Toggle enabled={emailEnabled} onChange={() => setEmailEnabled(!emailEnabled)} />}
          />
          <SettingRow
            icon={<Smartphone className="w-4 h-4" />}
            label="SMS Alerts"
            description="OTPs, transaction alerts"
            action={<Toggle enabled={smsEnabled} onChange={() => setSmsEnabled(!smsEnabled)} />}
          />
        </SettingSection>
      </m.div>

      {/* Preferences */}
      <m.div variants={fadeUp}>
        <SettingSection title="Preferences">
          <SettingRow
            icon={<Moon className="w-4 h-4" />}
            label="Dark Mode"
            action={<Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />}
          />
          <SettingRow
            icon={<Globe className="w-4 h-4" />}
            label="Language"
            action={<span className="text-xs text-zinc-500">English</span>}
            onClick={() => addToast({ type: 'info', title: 'Coming soon' })}
          />
        </SettingSection>
      </m.div>

      {/* Support */}
      <m.div variants={fadeUp}>
        <SettingSection title="Support">
          <SettingRow
            icon={<HelpCircle className="w-4 h-4" />}
            label="Help & FAQ"
            onClick={() => addToast({ type: 'info', title: 'Coming soon' })}
          />
          <SettingRow
            icon={<FileText className="w-4 h-4" />}
            label="Terms & Privacy"
            onClick={() => addToast({ type: 'info', title: 'Coming soon' })}
          />
        </SettingSection>
      </m.div>

      {/* Logout */}
      <m.div variants={fadeUp}>
        <m.button
          whileTap={buttonTap}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 bg-red-400/10 border border-red-400/20 text-red-400 font-semibold rounded-2xl text-sm"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </m.button>
      </m.div>

      {/* App version */}
      <m.div variants={fadeUp} className="text-center pb-4">
        <p className="text-[10px] text-zinc-600">Aurum v1.0.0</p>
      </m.div>
    </m.div>
  );
}
