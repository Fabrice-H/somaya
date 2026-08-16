import { Suspense } from 'react';
import { getSettings } from '@/features/admin/settings/actions';
import { getTestimonials } from '@/features/admin/testimonials/actions';
import { getInstagramPosts, getInstagramSettings } from '@/features/admin/instagram/actions';
import { getHeroBanner } from '@/features/admin/hero-banner/actions';
import { SettingsClient } from '@/features/admin/settings/SettingsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Réglages | Admin SO'MAYA",
};

async function SettingsData() {
  const [settings, testimonials, instagramPosts, instagramSettings, heroBanner] = await Promise.all([
    getSettings(),
    getTestimonials(),
    getInstagramPosts(),
    getInstagramSettings(),
    getHeroBanner(),
  ]);

  if (!settings) {
    return (
      <div style={{ padding: '32px 40px' }}>
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-6">
          <h2 className="font-semibold mb-2">Impossible de charger les paramètres</h2>
          <p className="text-sm">
            Vérifiez que la table store_settings existe dans la base de données
            ou que vous êtes bien connecté en tant qu&apos;administrateur.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SettingsClient
      settings={settings}
      testimonials={testimonials}
      instagramPosts={instagramPosts}
      instagramSettings={instagramSettings}
      heroBanner={heroBanner}
    />
  );
}

function SettingsSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div
        className="flex items-center justify-between gap-4 bg-[#faf6f1] border-b border-[#511F29]/10"
        style={{ padding: '24px 40px' }}
      >
        <div>
          <div className="h-6 w-24 bg-[#e8e0d8] animate-pulse mb-2" />
          <div className="h-4 w-48 bg-[#e8e0d8] animate-pulse" />
        </div>
        <div className="h-11 w-32 bg-[#e8e0d8] animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div style={{ padding: '32px 40px' }}>
        <div className="flex gap-8">
          {/* Sidebar skeleton */}
          <div className="w-56 shrink-0 space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 bg-[#faf6f1] animate-pulse"
              />
            ))}
          </div>

          {/* Form skeleton */}
          <div className="flex-1 max-w-2xl">
            <div
              className="bg-white"
              style={{
                border: '1px solid rgba(81, 31, 41, 0.1)',
                padding: 32,
              }}
            >
              <div className="h-6 w-48 bg-[#e8e0d8] animate-pulse mb-2" />
              <div className="h-4 w-64 bg-[#e8e0d8] animate-pulse mb-8" />

              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-32 bg-[#e8e0d8] animate-pulse mb-2" />
                    <div className="h-12 bg-[#faf6f1] animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsData />
    </Suspense>
  );
}
