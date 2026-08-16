'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Store,
  Phone,
  Truck,
  Palette,
  Save,
  Loader2,
  X,
  Check,
  Star,
  Camera,
  ImageIcon,
} from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import {
  type StoreSettings,
  type SettingsInput,
  updateSettings,
} from './actions';
import type { TestimonialData } from '../testimonials/actions';
import type { InstagramPostData, InstagramSettings } from '../instagram/actions';
import type { HeroBannerData } from '../hero-banner/actions';
import { TestimonialsManager } from '../testimonials/TestimonialsManager';
import { InstagramManager } from '../instagram/InstagramManager';
import { HeroBannerForm } from '../hero-banner/HeroBannerForm';

// ============================================================
// TYPES
// ============================================================

type Tab = 'boutique' | 'contact' | 'livraison' | 'apparence' | 'hero' | 'temoignages' | 'instagram';

const TABS: { id: Tab; label: string; icon: typeof Store }[] = [
  { id: 'boutique', label: 'Boutique', icon: Store },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'livraison', label: 'Livraison', icon: Truck },
  { id: 'apparence', label: 'Apparence', icon: Palette },
  { id: 'hero', label: 'Hero Banner', icon: ImageIcon },
  { id: 'temoignages', label: 'Témoignages', icon: Star },
  { id: 'instagram', label: 'Instagram', icon: Camera },
];

interface SettingsClientProps {
  settings: StoreSettings;
  testimonials: TestimonialData[];
  instagramPosts: InstagramPostData[];
  instagramSettings: InstagramSettings;
  heroBanner: HeroBannerData | null;
}

// ============================================================
// COMPONENT
// ============================================================

export function SettingsClient({
  settings,
  testimonials,
  instagramPosts,
  instagramSettings,
  heroBanner,
}: SettingsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<Tab>('boutique');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [form, setForm] = useState<SettingsInput>({
    store_name: settings.store_name,
    tagline: settings.tagline || '',
    logo_url: settings.logo_url || '',
    whatsapp_number: settings.whatsapp_number || '',
    phone_number: settings.phone_number || '',
    email: settings.email || '',
    address: settings.address || '',
    instagram_handle: settings.instagram_handle || '',
    facebook_url: settings.facebook_url || '',
    tiktok_handle: settings.tiktok_handle || '',
    delivery_fee: settings.delivery_fee,
    delivery_hours: settings.delivery_hours || '',
    primary_color: settings.primary_color,
    secondary_color: settings.secondary_color,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateSettings(form);
      if (result.success) {
        setMessage({ type: 'success', text: 'Paramètres enregistrés' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error || 'Erreur' });
      }
    });
  };

  const updateField = <K extends keyof SettingsInput>(
    key: K,
    value: SettingsInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Styles
  const inputClass =
    'w-full h-12 px-4 bg-[#faf6f1] border border-[#511F29]/15 text-[#2a181d] text-sm outline-none transition-colors focus:border-[#511F29]/40';
  const labelClass = 'block text-sm font-medium text-[#2a181d] mb-2';
  const hintClass = 'text-xs text-[#94786b] mt-1.5';

  // Check if current tab needs the form wrapper (settings tabs vs standalone components)
  const isSettingsTab = ['boutique', 'contact', 'livraison', 'apparence'].includes(activeTab);

  return (
    <div>
      {/* Header */}
      <div
        className="flex items-center justify-between gap-4 flex-wrap bg-[#faf6f1] border-b border-[#511F29]/10"
        style={{ padding: '24px 40px' }}
      >
        <div>
          <h1 className="text-xl font-semibold text-[#2a181d]">Réglages</h1>
          <p className="text-sm text-[#94786b] mt-0.5">
            Configurez les paramètres de votre boutique
          </p>
        </div>

        {isSettingsTab && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="inline-flex items-center gap-2 h-11 px-6 bg-[#511F29] text-[#fcd3b4] text-sm font-semibold transition-colors hover:bg-[#3d171f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isPending ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div
          className="mx-10 mt-6"
          style={{
            padding: 16,
            background:
              message.type === 'success'
                ? 'rgba(34, 197, 94, 0.1)'
                : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${
              message.type === 'success'
                ? 'rgba(34, 197, 94, 0.3)'
                : 'rgba(239, 68, 68, 0.3)'
            }`,
            color: message.type === 'success' ? '#15803d' : '#dc2626',
          }}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <Check size={16} />
            ) : (
              <X size={16} />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '32px 40px' }}>
        <div className="flex gap-8">
          {/* Sidebar Tabs */}
          <div className="w-56 shrink-0">
            <nav className="space-y-1 sticky top-8">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      background: isActive ? '#511F29' : 'transparent',
                      color: isActive ? '#fcd3b4' : '#94786b',
                    }}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Settings Tabs */}
            {isSettingsTab && (
              <div
                className="bg-white max-w-2xl"
                style={{
                  border: '1px solid rgba(81, 31, 41, 0.1)',
                  padding: 32,
                }}
              >
                {/* Boutique Tab */}
                {activeTab === 'boutique' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-[#2a181d] mb-1">
                        Informations de la boutique
                      </h2>
                      <p className="text-sm text-[#94786b]">
                        Nom et identité visuelle de votre boutique
                      </p>
                    </div>

                    <div className="space-y-5 pt-4">
                      {/* Store name */}
                      <div>
                        <label className={labelClass}>Nom de la boutique *</label>
                        <input
                          type="text"
                          value={form.store_name}
                          onChange={(e) =>
                            updateField('store_name', e.target.value)
                          }
                          placeholder="SO'MAYA"
                          className={inputClass}
                        />
                      </div>

                      {/* Tagline */}
                      <div>
                        <label className={labelClass}>Slogan</label>
                        <input
                          type="text"
                          value={form.tagline || ''}
                          onChange={(e) => updateField('tagline', e.target.value)}
                          placeholder="La Qualité, Notre Référence"
                          className={inputClass}
                        />
                      </div>

                      {/* Logo */}
                      <div>
                        <label className={labelClass}>Logo de la boutique</label>
                        <p className={hintClass} style={{ marginBottom: 12, marginTop: 0 }}>
                          Uploadez une image ou laissez vide pour afficher le nom en texte
                        </p>

                        {form.logo_url ? (
                          <div className="flex items-start gap-4">
                            <div
                              className="relative shrink-0"
                              style={{
                                width: 200,
                                height: 80,
                                border: '1px solid rgba(81, 31, 41, 0.15)',
                                background: '#faf6f1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                              }}
                            >
                              <Image
                                src={form.logo_url}
                                alt="Logo"
                                fill
                                className="object-contain p-2"
                                sizes="200px"
                              />
                              <button
                                type="button"
                                onClick={() => updateField('logo_url', '')}
                                className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-red-600 text-white rounded-full"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-[#94786b] mb-2">
                                Logo actuel
                              </p>
                            </div>
                          </div>
                        ) : (
                          <ImageUpload
                            images={[]}
                            onChange={(urls) =>
                              updateField('logo_url', urls[0] || '')
                            }
                            bucket="store"
                            maxImages={1}
                          />
                        )}
                      </div>

                      {/* Address */}
                      <div>
                        <label className={labelClass}>Adresse</label>
                        <textarea
                          value={form.address || ''}
                          onChange={(e) => updateField('address', e.target.value)}
                          rows={2}
                          placeholder="Angré Château, Abidjan"
                          className={`${inputClass} h-auto py-3 resize-none`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Tab */}
                {activeTab === 'contact' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-[#2a181d] mb-1">
                        Contact & Réseaux sociaux
                      </h2>
                      <p className="text-sm text-[#94786b]">
                        Comment vos clients peuvent vous contacter
                      </p>
                    </div>

                    <div className="space-y-5 pt-4">
                      {/* WhatsApp */}
                      <div>
                        <label className={labelClass}>Numéro WhatsApp</label>
                        <input
                          type="text"
                          value={form.whatsapp_number || ''}
                          onChange={(e) =>
                            updateField('whatsapp_number', e.target.value)
                          }
                          placeholder="2250508905666"
                          className={inputClass}
                        />
                        <p className={hintClass}>
                          Format international sans le + (ex: 2250508905666)
                        </p>
                      </div>

                      {/* Phone & Email */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Téléphone</label>
                          <input
                            type="text"
                            value={form.phone_number || ''}
                            onChange={(e) =>
                              updateField('phone_number', e.target.value)
                            }
                            placeholder="0778784268"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Email</label>
                          <input
                            type="email"
                            value={form.email || ''}
                            onChange={(e) => updateField('email', e.target.value)}
                            placeholder="contact@somaya.ci"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* Social Media */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Instagram</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94786b]">
                              @
                            </span>
                            <input
                              type="text"
                              value={
                                form.instagram_handle?.replace('@', '') || ''
                              }
                              onChange={(e) =>
                                updateField('instagram_handle', e.target.value)
                              }
                              placeholder="so_maya_ci"
                              className={inputClass}
                              style={{ paddingLeft: 32 }}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>TikTok</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94786b]">
                              @
                            </span>
                            <input
                              type="text"
                              value={form.tiktok_handle?.replace('@', '') || ''}
                              onChange={(e) =>
                                updateField('tiktok_handle', e.target.value)
                              }
                              placeholder="somayashop"
                              className={inputClass}
                              style={{ paddingLeft: 32 }}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Facebook URL</label>
                        <input
                          type="url"
                          value={form.facebook_url || ''}
                          onChange={(e) =>
                            updateField('facebook_url', e.target.value)
                          }
                          placeholder="https://facebook.com/somaya.ci"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Livraison Tab */}
                {activeTab === 'livraison' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-[#2a181d] mb-1">
                        Livraison
                      </h2>
                      <p className="text-sm text-[#94786b]">
                        Frais et informations de livraison
                      </p>
                    </div>

                    <div className="space-y-5 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>
                            Frais de livraison (FCFA)
                          </label>
                          <input
                            type="number"
                            value={form.delivery_fee || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateField(
                                'delivery_fee',
                                val === "" ? 0 : parseInt(val) || 0
                              );
                            }}
                            min={0}
                            placeholder="0"
                            className={inputClass}
                          />
                          <p className={hintClass}>
                            Frais appliqués à chaque commande
                          </p>
                        </div>

                        <div>
                          <label className={labelClass}>
                            Horaires de livraison
                          </label>
                          <input
                            type="text"
                            value={form.delivery_hours || ''}
                            onChange={(e) =>
                              updateField('delivery_hours', e.target.value)
                            }
                            placeholder="Lun-Sam: 14h-20h"
                            className={inputClass}
                          />
                          <p className={hintClass}>Affiché dans le footer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Apparence Tab */}
                {activeTab === 'apparence' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-[#2a181d] mb-1">
                        Couleurs du thème
                      </h2>
                      <p className="text-sm text-[#94786b]">
                        Personnalisez l&apos;apparence de votre boutique
                      </p>
                    </div>

                    <div className="space-y-5 pt-4">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Primary color */}
                        <div>
                          <label className={labelClass}>Couleur principale</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={form.primary_color}
                              onChange={(e) =>
                                updateField('primary_color', e.target.value)
                              }
                              className="w-12 h-12 border border-[#511F29]/20 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={form.primary_color}
                              onChange={(e) =>
                                updateField('primary_color', e.target.value)
                              }
                              className={`${inputClass} flex-1 font-mono text-sm`}
                            />
                          </div>
                          <p className={hintClass}>
                            Couleur de marque principale (boutons, accents)
                          </p>
                        </div>

                        {/* Secondary color */}
                        <div>
                          <label className={labelClass}>Couleur secondaire</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={form.secondary_color}
                              onChange={(e) =>
                                updateField('secondary_color', e.target.value)
                              }
                              className="w-12 h-12 border border-[#511F29]/20 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={form.secondary_color}
                              onChange={(e) =>
                                updateField('secondary_color', e.target.value)
                              }
                              className={`${inputClass} flex-1 font-mono text-sm`}
                            />
                          </div>
                          <p className={hintClass}>
                            Couleur complémentaire (texte sur boutons)
                          </p>
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="pt-6 border-t border-[#511F29]/10">
                        <h3 className="text-sm font-semibold text-[#2a181d] mb-4">
                          Aperçu
                        </h3>

                        <div
                          className="p-6"
                          style={{
                            background: '#faf6f1',
                            border: '1px solid rgba(81, 31, 41, 0.1)',
                          }}
                        >
                          {/* Header preview */}
                          <div
                            className="flex items-center justify-between p-4 mb-4"
                            style={{ background: form.primary_color }}
                          >
                            <span
                              className="font-semibold"
                              style={{ color: form.secondary_color }}
                            >
                              {form.store_name || "SO'MAYA"}
                            </span>
                            <div
                              className="flex gap-4 text-sm"
                              style={{ color: form.secondary_color, opacity: 0.8 }}
                            >
                              <span>Catalogue</span>
                              <span>Contact</span>
                            </div>
                          </div>

                          {/* Button preview */}
                          <div className="flex gap-3">
                            <span
                              className="inline-block px-5 py-2.5 text-sm font-semibold"
                              style={{
                                background: form.primary_color,
                                color: form.secondary_color,
                              }}
                            >
                              Ajouter au panier
                            </span>
                            <span
                              className="inline-block px-5 py-2.5 text-sm font-semibold border-2"
                              style={{
                                borderColor: form.primary_color,
                                color: form.primary_color,
                              }}
                            >
                              Voir plus
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hero Banner Tab */}
            {activeTab === 'hero' && heroBanner && (
              <div className="bg-white border border-[#511F29]/10 rounded-lg overflow-hidden">
                <HeroBannerForm data={heroBanner} embedded />
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === 'temoignages' && (
              <div className="bg-white border border-[#511F29]/10 rounded-lg overflow-hidden">
                <TestimonialsManager initialData={testimonials} embedded />
              </div>
            )}

            {/* Instagram Tab */}
            {activeTab === 'instagram' && (
              <div className="bg-white border border-[#511F29]/10 rounded-lg overflow-hidden">
                <InstagramManager initialData={instagramPosts} settings={instagramSettings} embedded />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
