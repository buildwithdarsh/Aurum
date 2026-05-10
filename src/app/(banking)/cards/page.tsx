'use client';

import { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { TZ } from '@/lib/tz';
import { useBankingStore } from '@/store/banking';
import { useUIStore } from '@/store/ui';
import {
  fadeUp,
  staggerContainer,
  buttonTap,
} from '@/lib/animations';
import { Skeleton } from '@/components/ui/Skeleton';
import { Toggle } from '@/components/ui/Toggle';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import {
  Shield,
  Globe,
  Wifi,
  Monitor,
  Lock,
  Unlock,
  CreditCard,
} from 'lucide-react';
import type { BankCard } from '@buildwithdarsh/sdk';

function CardsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-48 rounded-2xl" />
      <Skeleton.Card />
    </div>
  );
}

/* Card Chip SVG */
function CardChip() {
  return (
    <svg
      width="36"
      height="28"
      viewBox="0 0 36 28"
      fill="none"
      className="text-amber-300/80"
    >
      <rect
        x="0.5"
        y="0.5"
        width="35"
        height="27"
        rx="4.5"
        fill="currentColor"
        fillOpacity="0.3"
        stroke="currentColor"
        strokeOpacity="0.5"
      />
      <line x1="0" y1="10" x2="36" y2="10" stroke="currentColor" strokeOpacity="0.4" />
      <line x1="0" y1="18" x2="36" y2="18" stroke="currentColor" strokeOpacity="0.4" />
      <line x1="12" y1="0" x2="12" y2="28" stroke="currentColor" strokeOpacity="0.4" />
      <line x1="24" y1="0" x2="24" y2="28" stroke="currentColor" strokeOpacity="0.4" />
    </svg>
  );
}

/* NFC Waves SVG */
function NfcWaves() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="text-white/40 rotate-90"
    >
      <path d="M6 18.5C3.5 16 3.5 8 6 5.5" />
      <path d="M10 16c-1.5-1.5-1.5-6.5 0-8" />
      <path d="M14 13.5c-0.5-0.5-0.5-2.5 0-3" />
    </svg>
  );
}

export default function CardsPage() {
  const { cards, setCards } = useBankingStore();
  const addToast = useUIStore((s) => s.addToast);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TZ.storefront.banking.cards
      .list()
      .then(setCards)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [setCards]);

  const handleBlock = async (card: BankCard) => {
    try {
      if (card.status === 'blocked') {
        await TZ.storefront.banking.cards.unblock(card.id);
        addToast({ type: 'success', title: 'Card unblocked' });
      } else {
        await TZ.storefront.banking.cards.block(card.id);
        addToast({ type: 'warning', title: 'Card blocked' });
      }
      const updated = await TZ.storefront.banking.cards.list();
      setCards(updated);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Action failed',
        description: err instanceof Error ? err.message : '',
      });
    }
  };

  const handleToggle = async (
    cardId: string,
    feature: 'contactless' | 'online' | 'international',
    current: boolean,
  ) => {
    try {
      const toggle = { enabled: !current };
      if (feature === 'contactless')
        await TZ.storefront.banking.cards.toggleContactless(cardId, toggle);
      else if (feature === 'online')
        await TZ.storefront.banking.cards.toggleOnline(cardId, toggle);
      else
        await TZ.storefront.banking.cards.toggleInternational(cardId, toggle);
      const updated = await TZ.storefront.banking.cards.list();
      setCards(updated);
      addToast({
        type: 'success',
        title: `${feature.charAt(0).toUpperCase() + feature.slice(1)} ${!current ? 'enabled' : 'disabled'}`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Failed',
        description: err instanceof Error ? err.message : '',
      });
    }
  };

  if (loading) return <CardsSkeleton />;

  if (cards.length === 0) {
    return (
      <div className="space-y-4">
        <m.div initial="hidden" animate="show" variants={fadeUp}>
          <h1 className="text-lg font-semibold text-white">Cards</h1>
        </m.div>
        <EmptyState
          illustration={
            <div className="flex items-center justify-center w-full h-full">
              <CreditCard className="w-24 h-24 text-zinc-700" />
            </div>
          }
          title="No cards issued"
          description="Your debit and credit cards will appear here once issued."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <m.div initial="hidden" animate="show" variants={fadeUp}>
        <h1 className="text-lg font-semibold text-white">Cards</h1>
      </m.div>

      <m.div
        className="space-y-6"
        initial="hidden"
        animate="show"
        variants={staggerContainer}
      >
        {cards.map((card: BankCard) => {
          const isBlocked = card.status === 'blocked';

          return (
            <m.div key={card.id} variants={fadeUp} className="space-y-3">
              {/* Card Visual */}
              <m.div
                whileHover={{ rotateY: 5, rotateX: -3 }}
                style={{ perspective: 800 }}
                className="relative"
              >
                <div
                  className={`relative overflow-hidden rounded-2xl p-5 h-48 ${
                    isBlocked
                      ? 'bg-zinc-700 grayscale'
                      : 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900'
                  }`}
                >
                  {!isBlocked && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-blue-500/5" />
                  )}

                  {isBlocked && (
                    <div className="absolute inset-0 bg-red-900/20 z-10 flex items-center justify-center">
                      <Badge variant="error" className="text-xs px-3 py-1">
                        BLOCKED
                      </Badge>
                    </div>
                  )}

                  <div className="relative z-20 flex flex-col h-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                          {card.cardType} &middot; {card.variant}
                        </p>
                        <p className="text-sm font-semibold text-white/90 mt-0.5">
                          {card.cardNetwork.toUpperCase()}
                        </p>
                      </div>
                      <NfcWaves />
                    </div>

                    <div className="mt-auto">
                      <CardChip />

                      <p className="text-base tracking-[0.25em] font-mono text-white/90 mt-3">
                        &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;
                        &bull;&bull;&bull;&bull; {card.lastFourDigits}
                      </p>

                      <div className="flex justify-between mt-2.5">
                        <div>
                          <p className="text-[9px] text-zinc-500 uppercase tracking-wider">
                            Card Holder
                          </p>
                          <p className="text-xs text-white/80 font-medium">
                            {card.nameOnCard}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-zinc-500 uppercase tracking-wider">
                            Expires
                          </p>
                          <p className="text-xs text-white/80 font-medium">
                            {String(card.expiryMonth).padStart(2, '0')}/
                            {card.expiryYear}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>

              {/* Controls */}
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4 space-y-3">
                {/* Block/Unblock */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300 flex items-center gap-2 font-medium">
                    <Shield className="w-4 h-4 text-zinc-500" />
                    Card Status
                  </span>
                  <m.button
                    whileTap={buttonTap}
                    onClick={() => handleBlock(card)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      isBlocked
                        ? 'bg-emerald-400/10 text-emerald-400'
                        : 'bg-red-400/10 text-red-400'
                    }`}
                  >
                    {isBlocked ? (
                      <>
                        <Unlock className="w-3 h-3" />
                        Unblock
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        Block
                      </>
                    )}
                  </m.button>
                </div>

                <div className="h-px bg-white/[0.04]" />

                {/* Toggles */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-zinc-500" />
                    Contactless
                  </span>
                  <Toggle
                    enabled={card.contactlessEnabled}
                    onChange={() =>
                      handleToggle(
                        card.id,
                        'contactless',
                        card.contactlessEnabled,
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-zinc-500" />
                    Online Transactions
                  </span>
                  <Toggle
                    enabled={card.onlineEnabled}
                    onChange={() =>
                      handleToggle(card.id, 'online', card.onlineEnabled)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-zinc-500" />
                    International
                  </span>
                  <Toggle
                    enabled={card.internationalEnabled}
                    onChange={() =>
                      handleToggle(
                        card.id,
                        'international',
                        card.internationalEnabled,
                      )
                    }
                  />
                </div>
              </div>
            </m.div>
          );
        })}
      </m.div>
    </div>
  );
}
