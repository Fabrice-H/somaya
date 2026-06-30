# SO'MAYA - Site Vitrine Mode & Accessoires

Site vitrine elegant pour SO'MAYA, boutique de mode et accessoires pour femme basee a Abidjan, Cote d'Ivoire.

## Stack Technique

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Playfair Display + Montserrat

## Demarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

## Structure du Projet

```
src/
├── app/                    # Pages Next.js
│   ├── page.tsx           # Page d'accueil
│   ├── catalogue/         # Pages catalogue
│   ├── produit/[id]/      # Pages produit
│   └── a-propos/          # Page A propos
├── components/
│   ├── layout/            # Header, Footer
│   ├── sections/          # Hero, Categories, etc.
│   └── ui/                # ProductCard, WhatsAppButton
├── data/
│   └── products.ts        # Donnees produits
└── lib/
    └── utils.ts           # Utilitaires
```

## Images Requises

Ajouter les images dans `public/images/`:

### Hero
- `hero-somaya.jpg` - Image hero principale (1920x1080 recommande)
- `about-somaya.jpg` - Image page A propos
- `about-story.jpg` - Image histoire de la marque

### Categories (public/images/categories/)
- `bijoux.jpg`
- `sacs.jpg`
- `vetements.jpg`
- `montres.jpg`
- `accessoires.jpg`

### Produits (public/images/products/)
- `collier-1.jpg`
- `sac-1.jpg`
- `tunique-1.jpg`
- `montre-1.jpg`
- `boucles-1.jpg`
- `pochette-1.jpg`
- `boubou-1.jpg`
- `bracelet-1.jpg`

**Format recommande**: JPG/WebP, min 1000px de large

## Configuration

### WhatsApp
Modifier le numero WhatsApp dans `src/lib/utils.ts`:
```typescript
export const WHATSAPP_NUMBER = "2250000000000"; // Remplacer par le vrai numero
```

### Produits
Ajouter/modifier les produits dans `src/data/products.ts`

### Couleurs
Palette definie dans `src/app/globals.css`:
- Or Champagne: #D4AF37
- Noir Elegant: #1A1A1A
- Blanc Ivoire: #FFFEF9
- Rose Nude: #E8D5D5
- Bordeaux: #722F37

## Deploiement

```bash
npm run build
```

Deployer sur Vercel:
```bash
npx vercel
```

## Contact

Realise par [SEGNOX Studio](https://segnox.com)
