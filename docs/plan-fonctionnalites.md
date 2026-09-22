# SO'MAYA — Plan d'évolution V1 : Clients, Fidélité, Automatisations, Paiement en ligne, Espace client

> Statut : **validé le 22/09/2026** (fournisseur : Jèko ; stock décrémenté ; ajout de l'espace client et du suivi de commande).
> Suivi d'avancement : voir la section 9 en bas du fichier.
> Règle de travail : une fonctionnalité à la fois, dans l'ordre des dépendances, finie à 100 % (code + migration + tests + build) avant de passer à la suivante.

---

## 1. Analyse de l'existant

### 1.1 Stack

| Élément | Choix actuel |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack), React 19, TypeScript |
| Styles | Tailwind v4 + tokens `--som-*` dans `globals.css`, police Poppins |
| Base de données | PostgreSQL Neon (driver `neon-http`), ORM Drizzle 0.45 |
| Validation | Zod 4 |
| Auth | NextAuth v5 (credentials, JWT), **admin uniquement**, table `admin_users` |
| Médias | Cloudinary (upload signé côté serveur) |
| État client | Zustand (panier, favoris) |
| Hébergement | Vercel (projet `somaya-ci`) |

### 1.2 Architecture du code

- `src/app` : routes uniquement. Boutique dans le groupe `(site)`, admin dans `admin/(dashboard)`, connexion dans `admin/(auth)`.
- `src/features/<domaine>` : `components/`, `hooks/`, `server/queries.ts` (lectures, `server-only`), `server/actions.ts` (server actions : auth → zod → écriture → `updateTag`), `schemas.ts`, `types.ts`, `constants.ts`, `utils.ts`.
- `src/shared` : composants communs (dont le kit admin `AdminPage`, `AdminCard`, `StatCard`, `Badge`, `Table`, `Tabs`, `SearchField`, `EmptyState`), `lib/` (db, env, format, phone, rate-limit…).
- Il n'y a **pas d'API REST interne** : tout passe par les server actions et les lectures serveur. Seules routes API : `api/auth` (NextAuth) et `api/upload/signature`. **Je garde cette convention** : les nouvelles fonctionnalités seront des server actions et des queries, et j'ajouterai uniquement les routes HTTP obligatoires (webhook de paiement, retour du fournisseur, cron).

### 1.3 Base de données actuelle

Tables : `admin_users`, `categories`, `products`, `product_lots`, `price_lots`, `delivery_zones`, `orders`, `order_items`, `store_settings`, `hero_banner`, `testimonials`, `about_collections`, `featured_collection`, `instagram_posts`, `activity_logs`.

Enums :
- `order_status` : `pending` (Commande reçue), `confirmed`, `preparing`, `shipped`, `delivered`, `cancelled`
- `payment_method` : `cash`, `mobile_money`, `bank_transfer`
- `payment_status` : `pending`, `paid`, `refunded`

Table `orders` : les infos client sont **copiées dans chaque commande** (`customer_first_name`, `customer_last_name`, `customer_phone`, `customer_email`, adresse, commune). Il n'existe **aucune table clients**. `order_items` garde un instantané du produit (nom, prix, image, lot, quantité).

Relations : `orders → delivery_zones`, `order_items → orders / products / product_lots`, `products → categories`.

État réel de la base (lecture seule) : 2 commandes, 2 téléphones distincts, aucun email. Les téléphones sont au format local (ex. `07…01`).

### 1.4 Fonctionnement actuel des commandes

1. Checkout en 3 étapes (`/commande`) : Coordonnées → Livraison (domicile / retrait boutique) → Paiement.
2. L'étape Paiement propose « Paiement à la livraison / au retrait ». « Payer maintenant » est affiché mais **désactivé** (« Bientôt »).
3. La server action `placeOrder` (`features/checkout/server/actions.ts`) :
   - valide avec Zod ;
   - applique une limite anti-spam ;
   - **recalcule les prix depuis la base** (`pricing.ts`) et vérifie le stock ;
   - récupère les frais de livraison dans les réglages ;
   - insère la commande et ses lignes dans une seule transaction (`db.batch`).
4. Écran de succès, avec un bouton **WhatsApp** (`wa.me`) et le message de commande prérempli (`buildOrderWhatsAppMessage`).
5. L'admin change le statut dans `/admin/commandes/[id]` (`updateOrderStatus`). `delivered_at` est rempli au passage à « Livrée ».

Points relevés, à connaître :
- **Le stock n'est pas décrémenté** quand une commande est passée ou livrée. Il est seulement vérifié. Ce point est hors du périmètre demandé ; je le signale pour que tu décides (voir §8).
- Le checkout ne demande pas d'email.
- Le téléphone n'est pas normalisé : `07 01 02 03 04`, `+2250701020304` et `0701020304` sont stockés différemment.

### 1.5 Dashboard actuel

`/admin` : KPIs (commandes, en attente, chiffre d'affaires sur les commandes livrées, produits actifs), dernières commandes, raccourcis. Autres pages admin : produits, lots, catégories, commandes, réglages. Pas de bibliothèque de graphiques installée.

### 1.6 Authentification

- Admin : NextAuth credentials, session JWT de 12 h. Protégé par le proxy (`middleware.ts`), puis `assertAdmin()` dans le layout et les queries, puis `requireAdmin()` dans chaque action.
- Clients : **aucun compte**. `/compte` et `/fidelite` sont des pages « Bientôt ».

### 1.7 Migrations

- Drizzle Kit, dossier `drizzle/` (migrations 0000 à 0007).
- `drizzle.config.ts` pointe vers un **ancien chemin** (`src/lib/db/schema.ts`), à corriger.
- La table `drizzle.__drizzle_migrations` de la base contient **0 migration appliquée** : la base a été créée avec `db:push` / `db:setup`, pas avec `db:migrate`. Lancer `db:migrate` aujourd'hui essaierait de recréer toutes les tables et échouerait.
- Le schéma et les snapshots sont presque synchronisés : il ne manque que 6 changements de couleurs par défaut, sans risque.

---

## 2. Principes de la V1

- **Rien de cassé** : la commande WhatsApp reste le mode par défaut et fonctionne exactement comme aujourd'hui.
- **Migrations uniquement additives** : nouvelles tables, nouvelles colonnes, nouvelles valeurs d'enum. Aucune suppression, aucun renommage, les anciennes commandes sont conservées.
- **Règles centralisées** : les seuils de segments, les points et les niveaux sont dans une seule table de réglages, modifiable depuis l'admin, avec des valeurs par défaut dans un seul fichier `constants.ts`.
- **Même architecture que l'existant** : un dossier `features/<domaine>` par nouveau domaine.
- **Aucun envoi payant** (WhatsApp API, SMS, email) sans fournisseur configuré. Par défaut, les messages sont *préparés* et l'admin les envoie en un clic via `wa.me`.
- **Sécurité** : Zod partout, admin vérifié dans chaque action, secrets uniquement côté serveur (`shared/lib/env.ts`), montants toujours recalculés côté serveur, webhooks signés et idempotents.

---

## 3. Ordre de développement (par dépendances)

```
Étape 0  Fondations           (migrations fiables, téléphone normalisé)
   ↓
Étape 1  Clients / CRM         (table customers, rattachement des commandes, admin)
   ↓
Étape 2  Événements + Stock    (bus d'événements + journal ; décrément / restitution du stock)
   ↓
Étape 3  Fidélité              (points à la livraison, niveaux, /admin/loyalty)
   ↓
Étape 4  Notifications         (NotificationProvider, messages préparés WhatsApp manuel)
   ↓
Étape 5  Automatisations       (règles Événement → Automation → Action → Provider, relance inactifs via cron)
   ↓
Étape 6  Paiement en ligne     (PaymentService + JekoProvider, vérification serveur, webhooks signés)
   ↓
Étape 7  Espace client         (suivi de commande public, compte client, /compte)
   ↓
Étape 8  Dashboard             (nouveaux indicateurs + graphiques simples)
   ↓
Étape 9  Recette complète      (tous les flux de bout en bout)
```

Pourquoi cet ordre :
- la fidélité a besoin des clients (à qui donner les points) et des événements (quand les donner) ;
- le stock réagit aux changements de statut, donc il s'appuie sur les événements ;
- les automatisations ont besoin des notifications ;
- le paiement a besoin des événements (`order.paid`) et du stock ;
- l'espace client s'appuie sur les clients, la fidélité et le paiement (affichage des commandes payées) ;
- le dashboard agrège tout, il vient en dernier.

---

## 4. Détail par étape

### Étape 0 — Fondations

| Tâche | Détail |
|---|---|
| 0.1 | Corriger `drizzle.config.ts` → `src/shared/lib/db/schema.ts` |
| 0.2 | **Baseline des migrations** : marquer 0000 à 0007 comme déjà appliquées dans `__drizzle_migrations` (script idempotent, sans toucher aux tables), pour pouvoir utiliser `pnpm db:migrate` proprement ensuite |
| 0.3 | Générer la migration 0008 (couleurs par défaut, sans risque) |
| 0.4 | `normalizePhone()` dans `shared/lib/phone.ts` : format unique `+225XXXXXXXXXX` (10 chiffres CI), utilisé partout où on identifie un client |
| 0.5 | Tests unitaires du normaliseur (Vitest, léger, à ajouter) |

✅ Terminé quand : `pnpm db:migrate` passe sur une copie de la base (branche Neon), et le build, le lint et les tests passent.

### Étape 1 — Clients / CRM

**Base de données** (migration additive) :

```
customers
  id                uuid PK
  phone             varchar(20)  UNIQUE NOT NULL   -- normalisé, identifiant principal
  email             varchar(255) NULL              -- complémentaire
  first_name        varchar(255)
  last_name         varchar(255)
  orders_count      integer  default 0             -- commandes non annulées
  total_spent       decimal  default 0             -- commandes livrées
  first_order_at    timestamptz
  last_order_at     timestamptz
  loyalty_points    integer  default 0             -- (utilisé à l'étape 3)
  loyalty_level     varchar(30) default 'new'      -- (utilisé à l'étape 3)
  notes             text                           -- note interne admin
  created_at / updated_at
  index(last_order_at), index(total_spent)

orders
  + customer_id     uuid NULL → customers.id (on delete set null)
  + index(customer_id)
```

- Le **segment n'est pas stocké** : il est calculé à la lecture à partir des vraies données (`last_order_at`, `orders_count`, `total_spent`) et des règles de réglage, donc il est toujours juste sans tâche de recalcul.
- Les statistiques (`orders_count`, `total_spent`, dates) sont recalculées depuis `orders` à chaque changement de commande du client (fonction `refreshCustomerStats(customerId)`), jamais incrémentées à l'aveugle, donc aucune dérive possible.

**Règles de segments** (valeurs par défaut, modifiables dans l'admin) :

| Segment | Règle | Défaut |
|---|---|---|
| NEW | 1re commande il y a moins de N jours et 1 seule commande | 30 jours |
| ACTIVE | dernière commande il y a moins de N jours | 90 jours |
| LOYAL | au moins N commandes | 3 |
| VIP | total dépensé ≥ X **ou** au moins N commandes | 300 000 FCFA / 6 |
| INACTIVE | aucune commande depuis N jours | 120 jours |

Priorité d'affichage : VIP > LOYAL > NEW > ACTIVE > INACTIVE.

**Code** : `features/customers/` (`server/queries.ts`, `server/actions.ts`, `server/service.ts` avec `upsertCustomerFromOrder` et `refreshCustomerStats`, `segments.ts`, `schemas.ts`, `components/admin/…`).

**Branchement non destructif** :
- `placeOrder` : après validation, `upsertCustomerFromOrder` (recherche par téléphone normalisé ; complète l'email et le nom s'ils manquent, sans écraser) → `customer_id` sur la commande. Si cette étape échoue, **la commande passe quand même** (erreur loguée).
- `updateOrderStatus` : `refreshCustomerStats` après le changement de statut.
- Script de **rattrapage** : créer les clients depuis les commandes existantes et remplir `customer_id` (idempotent, relançable).
- Checkout : champ **email facultatif** ajouté à l'étape Coordonnées.

**Admin** :
- `/admin/customers` (libellé « Clients » dans le menu, groupe Ventes) :
  - liste avec recherche (nom, téléphone, email) ;
  - onglets de filtre : Tous / Nouveaux / Actifs / Fidèles / VIP / Inactifs ;
  - tri : dernière commande, total dépensé, nombre de commandes ;
  - pagination.
- `/admin/customers/[id]` :
  - fiche (coordonnées, segment, niveau, points), bouton WhatsApp, note interne ;
  - KPIs : commandes, total dépensé, panier moyen, dernière commande ;
  - historique des commandes (lien vers chaque commande) ;
  - produits les plus achetés ;
  - activité récente.
- Fiche commande : lien « Voir la fiche client ».

✅ Terminé quand : une nouvelle commande crée ou retrouve le client sans doublon (même numéro écrit de 3 façons différentes), les anciennes commandes sont rattachées, les filtres et segments sont justes, le build, le lint et les tests passent.

### Étape 2 — Événements

- `features/events/` : `emit(event)` typé (union TypeScript des événements) + journal dans une table.

```
domain_events
  id            uuid PK
  type          varchar(60)      -- ex. 'order.delivered'
  aggregate_id  uuid             -- id commande / client
  payload       jsonb
  created_at
  index(type, created_at)
```

- Événements V1 : `order.created`, `order.confirmed`, `order.preparing`, `order.shipped`, `order.delivered`, `order.cancelled`, `order.paid`, `customer.created`, `customer.inactive`, `loyalty.points_added`.
- Déclenchés depuis `placeOrder`, `updateOrderStatus` et `upsertCustomerFromOrder`.
- Exécution **synchrone et isolée** : on émet après l'écriture en base ; si un gestionnaire échoue, l'erreur est journalisée et **ne bloque jamais** la commande ni le changement de statut.
- Pas de file de messages externe (inutile en V1).

**Stock** (décision validée : « au moment idéal ») :

| Moment | Effet | Pourquoi |
|---|---|---|
| Commande WhatsApp passée à **Confirmée** par l'admin | stock décrémenté | c'est le moment où la vente est réelle ; avant, la cliente peut ne jamais répondre |
| Commande **payée en ligne** (`order.paid`) | stock décrémenté immédiatement | l'argent est encaissé |
| Commande **Annulée** après décrément | stock restitué | |

- Colonne `orders.stock_applied_at` (timestamptz, NULL) : le décrément n'est appliqué qu'une fois, la restitution seulement s'il a été appliqué. Idempotent même en cliquant deux fois.
- Le décrément porte sur `products.stock` ou sur le stock de l'article de lot (`product_lots`) selon la ligne, comme le fait déjà la vérification au checkout.
- Si le stock est insuffisant au moment de confirmer, l'admin voit un avertissement clair et peut confirmer quand même (le stock passe à 0, jamais négatif).
- Rattrapage : les commandes déjà confirmées/expédiées/livrées **ne sont pas** re-décrémentées (elles datent d'avant la règle).

✅ Terminé quand : chaque changement de statut produit le bon événement dans le journal, une erreur volontaire dans un gestionnaire ne casse pas la commande, et Confirmée / Annulée ajustent le stock une seule fois.

### Étape 3 — Fidélité

```
loyalty_transactions          -- registre des points (source de vérité)
  id            uuid PK
  customer_id   uuid → customers.id
  order_id      uuid NULL → orders.id
  type          varchar(20)   -- 'earn' | 'revoke' | 'adjust'
  points        integer       -- positif ou négatif
  reason        varchar(255)
  created_at
  UNIQUE(order_id, type)      -- empêche de créditer deux fois la même commande

loyalty_settings              -- 1 seule ligne, modifiable dans l'admin
  points_per_amount     integer  default 1       -- 1 point…
  amount_step           integer  default 1000    -- …par tranche de 1 000 FCFA
  levels                jsonb    -- [{key:'new',label:'Nouveau',min:0},{key:'regular',label:'Habitué',min:100},{key:'loyal',label:'Fidèle',min:300},{key:'vip',label:'VIP',min:800}]
  segment_rules         jsonb    -- seuils des segments de l'étape 1
  is_enabled            boolean  default true
  updated_at
```

- Règle : les points sont crédités **uniquement** quand la commande passe à « Livrée » (automation sur `order.delivered`), calculés sur le **sous-total** (hors livraison).
- Si une commande livrée repasse à « Annulée », ses points sont retirés (`revoke`). Idempotent grâce à la contrainte unique.
- `customers.loyalty_points` = somme du registre ; `loyalty_level` est recalculé depuis les paliers.
- Rattrapage : option pour créditer les commandes déjà livrées (à valider, voir §8).
- **Admin** `/admin/loyalty` :
  - KPIs : clients avec des points, total de points distribués, répartition par niveau ;
  - top clients ;
  - formulaire des règles (points et paliers) ;
  - ajustement manuel de points sur la fiche client (avec motif).
- **Site** : `/fidelite` n'est plus « Bientôt » et présente les vraies règles (paliers, 1 point par tranche de 1 000 FCFA). Pas de compte client.
- **Prévu pour plus tard, sans le développer** : `type` du registre extensible (`redeem`), emplacement pour `rewards` / `coupons`.

✅ Terminé quand : Livrée crédite les points une seule fois (même en cliquant deux fois), Annulée les retire, les niveaux changent aux bons paliers, les réglages sont modifiables, le build et les tests passent.

### Étape 4 — Notifications

```
notifications
  id            uuid PK
  channel       varchar(20)   -- 'whatsapp' | 'email' | 'sms'
  recipient     varchar(255)
  template      varchar(60)   -- ex. 'order_shipped'
  body          text          -- message final rendu
  status        varchar(20)   -- 'pending' | 'sent' | 'skipped' | 'failed'
  provider      varchar(30)   -- 'manual' | 'whatsapp_cloud' | …
  order_id / customer_id  NULL
  error         text NULL
  sent_at, created_at
```

- Interface `NotificationProvider { channel; isConfigured(); send(message) }`.
- Fournisseurs V1 :
  - **`ManualWhatsAppProvider`** (par défaut, gratuit) : le message est mis en attente, et l'admin clique « Envoyer sur WhatsApp » (lien `wa.me` prérempli), ce qui le marque comme envoyé ;
  - `EmailProvider`, `SmsProvider`, `WhatsAppCloudProvider` : **squelettes non actifs**. `isConfigured()` renvoie `false` sans variable d'environnement, et le message passe alors en `skipped`.
- Modèles de messages en français dans un seul fichier (`templates.ts`).
- Admin : bloc « Messages à envoyer » (dashboard + fiche commande).

✅ Terminé quand : un message est préparé sans fournisseur externe, s'envoie en un clic via WhatsApp, et le système marche sans aucune clé.

### Étape 5 — Automatisations

- Registre simple dans le code : `Automation { id; label; on: EventType; enabled(settings); run(event) }`.
- Automatisations V1 :

| Événement | Automation | Action |
|---|---|---|
| `order.delivered` | CustomerLoyaltyAutomation | attribuer les points, recalculer le niveau |
| `order.*` (tous) | CustomerStatsAutomation | `refreshCustomerStats` |
| `order.confirmed` | OrderConfirmedNotification | préparer le message « commande confirmée » |
| `order.shipped` | OrderShippedNotification | préparer le message « commande expédiée » |
| `order.delivered` | OrderFollowUpNotification | préparer un message de suivi / remerciement |
| `customer.inactive` | InactiveCustomerReminder | préparer une relance (liste dans l'admin) |

- Activation / désactivation de chaque automation dans l'admin (petite table `automation_settings` : id + enabled).
- **Détection des inactifs** : route `GET /api/cron/customers` protégée par `CRON_SECRET` et déclenchée 1 fois par jour par **Vercel Cron** (`vercel.json`). Elle émet `customer.inactive` une seule fois par période d'inactivité (date mémorisée).
- Admin : page « Automatisations » (Réglages → onglet) avec la liste, les interrupteurs et les 20 dernières exécutions.

✅ Terminé quand : chaque automation se déclenche sur le bon événement, peut être coupée, ne s'exécute pas deux fois, et le cron est sécurisé et testé.

### Étape 6 — Paiement en ligne (Jèko)

**Base de données** (additive) :

```
enum payment_status  + 'processing', 'failed', 'cancelled'   (ALTER TYPE … ADD VALUE, non destructif)
enum payment_method  + 'online'

orders
  + order_channel   varchar(20) default 'whatsapp'   -- 'whatsapp' | 'online'
  + paid_at         timestamptz NULL

payments
  id                  uuid PK
  order_id            uuid → orders.id
  provider            varchar(30)          -- 'jeko' | 'fake'
  provider_reference  varchar(255) UNIQUE  -- id du payment_request Jèko
  reference           varchar(100) UNIQUE  -- notre référence envoyée à Jèko (= order_number)
  amount              decimal              -- recalculé serveur = orders.total
  currency            varchar(3) default 'XOF'
  status              payment_status
  payment_method      varchar(20) NULL     -- wave | orange | mtn | moov | djamo (renvoyé par Jèko)
  checkout_url        text
  raw                 jsonb                -- dernière réponse fournisseur
  created_at, updated_at, paid_at
  index(order_id)

payment_webhook_events
  id                  uuid PK
  provider            varchar(30)
  event_id            varchar(255)         -- id de transaction Jèko
  UNIQUE(provider, event_id)               -- idempotence des webhooks
  payload             jsonb
  processed_at, created_at
```

**Ce que dit la doc Jèko** (developer.jeko.africa, lue le 22/09/2026) :
- Base : `https://api.jeko.africa/partner_api`. **Pas de sandbox** : on utilise une boutique de test dédiée.
- Auth : deux en-têtes, `X-API-KEY` et `X-API-KEY-ID` (Dashboard Business → Paramètres → API & Webhooks).
- Création : `POST /payment_requests` avec `storeId`, `amountCents` (multiple de 100 ; 1 XOF = 100), `currency: "XOF"`, `reference` (unique, 5-100 car.), `paymentDetails: { type: "redirect", data: { successUrl, errorUrl, paymentMethod? } }`. Sans `paymentMethod`, la cliente choisit Wave / Orange / MTN / Moov / Djamo sur la page Jèko. Réponse : `{ id, status: "pending", redirectUrl }`.
- Vérification : `GET /payment_requests/{id}` → `status: pending | success | error`, avec `transaction.amount.amount`.
- Webhook `TRANSACTION_COMPLETED` : corps = la transaction (`id`, `status`, `amount`, `transactionDetails.reference`, `executedAt`), en-tête **`Jeko-Signature`** = HMAC-SHA256 du **corps brut**, en hexadécimal minuscule. Retour HTTP 200 attendu, 3 relances possibles, doublons et désordre possibles → idempotence obligatoire.
- Limites : 500 requêtes / minute.

**Architecture** :

```
Checkout (UI) → placeOrder(action) → PaymentService.start(orderId)
                                       → PaymentProvider (Jeko | Fake)
Retour client  → /commande/retour?ref=…  → PaymentService.verify(ref)   (GET Jèko côté serveur)
Webhook        → POST /api/payments/jeko/webhook → vérif. Jeko-Signature → PaymentService.apply
```

- Interface `PaymentProvider { createPayment(), verifyPayment(), parseWebhook() }`.
- `features/payments/` : `service.ts`, `providers/jeko.ts`, `providers/fake.ts` (dev et tests), `registry.ts`.
- Variables serveur (validées dans `shared/lib/env.ts`, facultatives : sans elles, « Payer maintenant » reste désactivé) : `PAYMENT_PROVIDER` (`jeko` | `fake`), `JEKO_API_KEY`, `JEKO_API_KEY_ID`, `JEKO_STORE_ID`, `JEKO_WEBHOOK_SECRET`. Les clés ne sont **jamais** envoyées au navigateur.
- **Flux** :
  1. la cliente choisit « Payer maintenant » (Wave, Orange, MTN, Moov, Djamo affichés) ;
  2. la commande est créée (`order_channel = online`, `payment_status = pending`) ;
  3. un paiement est créé avec `amountCents = orders.total × 100`, `reference = order_number`, URLs de retour `…/commande/retour?ref=<order_number>&r=ok|ko` ;
  4. redirection vers `redirectUrl` Jèko ;
  5. au retour, **vérification serveur** (`GET /payment_requests/{id}`) ; le paramètre `r` de l'URL n'est jamais cru ;
  6. le webhook signé confirme aussi (il arrive parfois avant le retour) ;
  7. `payment_status = paid`, `paid_at`, événement `order.paid` (→ stock décrémenté) ;
  8. écran de confirmation, bouton WhatsApp conservé pour le suivi.
- **Statut de commande indépendant** (validé) : un paiement réussi ne change pas `status` ; l'admin confirme comme aujourd'hui.
- **Protections** :
  - un seul paiement `pending` / `paid` par commande (réutilisé si la cliente revient) ;
  - `reference` et `provider_reference` uniques ;
  - webhooks dédupliqués par id de transaction, signature vérifiée sur le corps brut avec `timingSafeEqual` ;
  - le montant renvoyé par Jèko est comparé à `orders.total` ; s'il diffère, le paiement passe en `failed` et l'admin est alerté ;
  - transitions uniquement vers l'avant (pas de `paid → pending`) ;
  - webhook en `runtime = nodejs`, réponse 200 rapide (Jèko coupe à 5 s).
- Admin :
  - badge « Payée en ligne » / « À la livraison » dans la liste des commandes, filtre par statut de paiement ;
  - bloc « Paiement » sur la fiche commande (moyen, référence, statut, montant, historique) ;
  - fiche client : total payé en ligne.
- **Étape 6b, intégration réelle** : tests avec la boutique de test Jèko et un paiement de faible montant (pas de sandbox). Il me faudra : l'identifiant de clé (`X-API-KEY-ID`), le `storeId` de la boutique de test, et l'URL du webhook enregistrée dans le dashboard (`https://<domaine>/api/payments/jeko/webhook`).

✅ Terminé quand : un paiement fake réussi, échoué ou abandonné met chaque fois le bon statut ; un webhook rejoué deux fois n'a qu'un seul effet ; un montant falsifié ou une signature invalide sont refusés ; le flux WhatsApp est identique à avant ; un vrai paiement de test Jèko passe de bout en bout.

### Étape 7 — Espace client

Il n'existe aucun compte client aujourd'hui, et **aucun moyen gratuit d'envoyer un code de vérification** (WhatsApp API et SMS sont payants, pas de fournisseur email). La V1 est donc pensée pour marcher sans OTP, avec une sécurité honnête, et pour accueillir l'OTP plus tard.

**7.1 Suivi de commande public** (sans compte)
- Page `/suivi` : numéro de commande + numéro de téléphone (les deux doivent correspondre) → statut, frise (Reçue → Confirmée → Préparation → Expédiée → Livrée), articles, total, paiement, bouton WhatsApp.
- Lien direct depuis l'écran de succès du checkout et depuis les messages préparés (étape 4).
- Limite de requêtes pour empêcher de deviner des numéros.

**7.2 Compte client**
- Identifiant : **téléphone** (normalisé) + mot de passe ; email facultatif. Cohérent avec l'identité client de l'étape 1.
- Base : `customers` + `password_hash` (NULL tant qu'aucun compte), `account_created_at`, `last_login_at`.
- Auth : même instance NextAuth, second provider Credentials « customer », rôle `customer` dans le JWT. `assertAdmin()` exige le rôle `admin`, donc un client ne peut jamais entrer dans l'admin. Session 30 jours.
- Inscription : `/compte/inscription` (prénom, nom, téléphone, mot de passe, email facultatif) et, à la fin du checkout, « Créer mon compte pour suivre mes commandes » (juste un mot de passe, le reste est déjà saisi).
- **Rattachement de l'historique** : à l'inscription, le compte est lié à la fiche client du même téléphone, mais **les commandes passées avant la création du compte ne s'affichent pas automatiquement** (sinon n'importe qui connaissant un numéro verrait l'historique). La cliente peut les récupérer avec « Retrouver une ancienne commande » : numéro de commande + total → la commande est rattachée. Quand un fournisseur OTP existera, ce rattachement deviendra automatique après vérification du numéro.
- Connexion : `/compte/connexion` ; mot de passe oublié : impossible sans OTP en V1 → message « contactez-nous sur WhatsApp », et l'admin peut réinitialiser depuis la fiche client (action sécurisée, journalisée).

**7.3 Espace `/compte`**
- Mes commandes (liste + détail avec la même frise que `/suivi`) ;
- Ma fidélité : points, niveau, prochain palier, historique des points ;
- Mes informations : nom, téléphone (non modifiable en V1), email, adresse par défaut, mot de passe ;
- Déconnexion.
- Checkout **pré-rempli** quand la cliente est connectée, et commande rattachée à son compte.
- `/fidelite` affiche le solde si connectée.
- Header : l'icône « Mon compte » mène à `/compte` (connexion si besoin).

✅ Terminé quand : inscription, connexion, suivi public, récupération d'une ancienne commande et checkout connecté marchent ; un compte client ne peut ouvrir aucune page admin ; les mots de passe sont hachés (bcrypt 12) ; limites de requêtes en place.

### Étape 8 — Dashboard

Nouveaux indicateurs (sur une période, 30 jours par défaut) :
- chiffre d'affaires, commandes, clients, nouveaux clients ;
- clients actifs, inactifs et VIP ;
- points de fidélité distribués ;
- paiements réussis et en attente ;
- commandes via WhatsApp et commandes payées en ligne.

Graphiques simples **sans nouvelle dépendance** (barres SVG / CSS) : chiffre d'affaires par jour et répartition des commandes par canal. Mise en page sobre, dans le style actuel.

✅ Terminé quand : chaque chiffre est vérifié contre une requête SQL directe.

### Étape 9 — Recette complète

- Tests automatisés (Vitest) :
  - normalisation du téléphone ;
  - calcul des segments ;
  - calcul des points et des niveaux ;
  - idempotence de la fidélité ;
  - transitions de paiement ;
  - dédoublonnage des webhooks.
- Recette manuelle sur une **branche Neon de test** (copie de la base) :
  - commande WhatsApp ;
  - commande payée (fake, puis vraie boutique de test Jèko) ;
  - paiement échoué ;
  - inscription + connexion client, suivi public, récupération d'ancienne commande ;
  - Livrée → points ;
  - Annulée → retrait des points ;
  - client inactif → relance ;
  - rejeu du webhook.
- Build, typecheck, lint, Prettier.
- Déploiement preview Vercel → validation → production.

---

## 5. Fichiers concernés

**Modifiés (ajouts uniquement, rien de retiré)**
- `drizzle.config.ts` (chemin du schéma)
- `src/shared/lib/db/schema.ts` (nouvelles tables et colonnes)
- `src/shared/lib/phone.ts` (`normalizePhone`)
- `src/shared/lib/env.ts` (variables paiement, cron, providers : facultatives)
- `src/features/checkout/{schemas.ts, server/actions.ts, components/steps/DetailsStep.tsx, components/steps/PaymentStep.tsx, components/CheckoutSuccess.tsx}`
- `src/features/orders/{server/actions.ts, server/queries.ts, components/admin/…}` (événements, lien client, bloc paiement)
- `src/features/dashboard/{server/queries.ts, components/…}`
- `src/shared/components/admin/constants.ts` (menu : Clients, Fidélité)
- `src/app/(site)/fidelite/page.tsx`
- `package.json` (Vitest, scripts `db:baseline` et `db:backfill`)

**Créés**
- `src/features/customers/…`, `src/features/loyalty/…`, `src/features/events/…`, `src/features/stock/…`, `src/features/notifications/…`, `src/features/automations/…`, `src/features/payments/…`, `src/features/account/…`, `src/features/tracking/…`
- `src/app/admin/(dashboard)/customers/page.tsx`, `customers/[id]/page.tsx`, `loyalty/page.tsx`
- `src/app/(site)/commande/retour/page.tsx`, `src/app/(site)/suivi/page.tsx`, `src/app/(site)/compte/{connexion,inscription}/page.tsx`, `src/app/(site)/compte/commandes/[id]/page.tsx`
- `src/app/api/payments/jeko/webhook/route.ts`, `src/app/api/cron/customers/route.ts`
- `vercel.json` (cron)
- `drizzle/0008…` et migrations suivantes, `scripts/baseline-migrations.ts`, `scripts/backfill-customers.ts`

---

## 6. Ce que je ne développe pas (préparé seulement)

- Coupons, récompenses, réductions, avantages VIP : le registre de points et les types sont prêts à les accueillir.
- Envoi automatique WhatsApp / SMS / email : les fournisseurs sont en squelette, non actifs.
- Campagnes marketing, segmentation avancée, IA.
- Vérification du numéro par OTP (WhatsApp / SMS) : prévue dès qu'un fournisseur sera configuré ; le rattachement automatique de l'historique en dépend.

---

## 7. Déploiement et sécurité des migrations

1. Chaque migration est d'abord testée sur une **branche Neon** (copie gratuite de la base de production).
2. Migrations uniquement additives, relues avant d'être appliquées.
3. Scripts de rattrapage idempotents (relançables sans effet de bord).
4. Mise en production fonctionnalité par fonctionnalité, après ta validation sur le preview Vercel.

---

## 8. Décisions validées (22/09/2026)

| # | Question | Décision |
|---|---|---|
| 1 | Ordre des étapes | validé (+ étape 7 Espace client) |
| 2 | Segments | validés : 30 j / 90 j / 3 commandes / 300 000 FCFA ou 6 commandes / 120 j |
| 3 | Points et niveaux | validés : 1 pt / 1 000 FCFA ; Nouveau 0, Habitué 100, Fidèle 300, VIP 800 |
| 4 | Rattrapage fidélité | validé : les commandes déjà livrées sont créditées |
| 5 | Paiement réussi | l'admin confirme la commande (statut indépendant) |
| 6 | Fournisseur | **Jèko** (clés dev fournies dans `.env.local`) |
| 7 | Stock | décrémenté à la confirmation (WhatsApp) ou au paiement (en ligne), restitué à l'annulation |
| 8 | Email au checkout | validé : champ facultatif |
| 9 | Espace client | ajouté : compte (téléphone + mot de passe), suivi de commande public, `/compte` |

**Points encore ouverts (non bloquants avant l'étape 6)**
- Jèko : il manque `X-API-KEY-ID` (les clés fournies sont une seule valeur) et le `storeId` de la boutique de test ; l'URL de webhook du dashboard doit être `https://<domaine>/api/payments/jeko/webhook`.
- Pas de sandbox Jèko : les tests réels se feront avec un paiement de faible montant sur la boutique de test.
- Sécurité : changer les secrets exposés (Neon, Cloudinary, `AUTH_SECRET`) avant d'ajouter les clés Jèko dans Vercel.

## 9. Avancement

| Étape | État |
|---|---|
| 0 Fondations | terminé (22/09/2026) |
| 1 Clients / CRM | terminé (22/09/2026) |
| 2 Événements + Stock | terminé (22/09/2026) |
| 3 Fidélité | terminé (22/09/2026) |
| 4 Notifications | reporté après 6 et 7 |
| 5 Automatisations | à faire |
| 6 Paiement Jèko | à faire |
| 7 Espace client | en cours (priorisé) |
| 8 Dashboard | à faire |
| 9 Recette | à faire |
