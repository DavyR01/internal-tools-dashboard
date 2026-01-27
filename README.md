# Internal Tools Management Dashboard

## 🚀 Quick Start

Ce projet est une application frontend développée avec Next.js permettant de monitorer et gérer les outils SaaS internes d’une entreprise.

### Installation

```bash
npm install
npm run dev
```

### Accès

* `/` : Dashboard
* `/tools` : Tools (Jour 7)
* `/analytics` : Analytics (Jour 8)

---

## 🏗️ Architecture

L’architecture repose sur une séparation claire des responsabilités :

* **routing** géré par Next.js (App Router),
* **composants UI réutilisables**,
* **logique métier par feature**,
* **data fetching centralisé**.

Structure principale :

```
app/                # Routes (Dashboard, Tools, Analytics)
components/         # Design system et layout partagé
features/           # Logique par domaine (dashboard, tools, analytics)
lib/                # API, React Query, utilitaires
store/              # UI state global (Zustand)
styles/             # Styles globaux et tokens
```

---

## 🎨 Design System Evolution

Le design system est construit dès le **Jour 6** à partir des mockups fournis (dark & light mode) et sert de **fondation obligatoire** pour les Jours 7 et 8.

Principes clés :

* tokens globaux (couleurs, backgrounds, textes, bordures),
* composants UI uniques et réutilisés partout,
* aucune réinvention visuelle après le Jour 6.

Les composants principaux incluent :

* Card / Button / Badge / Input / Table,
* Header et layout communs,
* status system cohérent (Active / Expiring / Unused).

---

## 🔗 Navigation & User Journey

Le parcours utilisateur est pensé comme un flux logique :

**Dashboard → Tools → Analytics**

* Le Dashboard fournit une vue globale (KPIs, outils récents),
* La page Tools permet la gestion détaillée des outils SaaS,
* La page Analytics apporte des insights coûts et usage.

La navigation est assurée par un header unique partagé sur les trois pages.

---

## 📊 Data Integration Strategy

Toutes les données proviennent d’un backend **JSON Server**.

Stratégie :

* **Axios** comme client HTTP,
* **TanStack Query** pour la gestion du server state,
* cache, refetch et loading states gérés automatiquement.

Cette approche garantit :

* une séparation claire entre UI state et données serveur,
* une base scalable pour filtres, pagination et mutations (CRUD).

---

## 📱 Progressive Responsive Design

L’application suit une approche **mobile-first** avec des breakpoints progressifs :

* Mobile : layouts empilés, menu hamburger,
* Tablet : grilles intermédiaires, filtres adaptatifs,
* Desktop : dashboards complets et interactions avancées.

Les composants du design system sont conçus pour s’adapter naturellement à ces contraintes.

---

## 🧪 Testing Strategy

Le projet est structuré pour permettre :

* des tests unitaires ciblés sur les composants clés,
* une validation visuelle forte du design system,
* une réduction des régressions grâce à la réutilisation stricte des composants.

---

## ⚡ Performance Optimizations

Plusieurs choix visent à garantir de bonnes performances :

* React Query pour limiter les requêtes inutiles,
* découpage par features pour réduire les dépendances,
* composants UI simples et peu coûteux en rendu.

---

## 🎯 Design Consistency Approach

La cohérence visuelle est assurée par :

* un design system centralisé,
* des tokens globaux uniques,
* des patterns UI identiques entre Dashboard, Tools et Analytics.

Après le Jour 6, aucune nouvelle règle visuelle n’est introduite, seulement des extensions contrôlées.

---

## 📈 Data Visualization Philosophy

La data visualisation (Jour 8) repose sur :

* **Recharts** comme librairie de graphiques,
* une intégration stricte au design system existant,
* des visualisations orientées lisibilité et prise de décision.

---

## 🔮 Next Steps / Complete App Vision

Les évolutions possibles incluent :

* alertes intelligentes de coûts,
* recommandations d’optimisation SaaS,
* projections budgétaires,
* export de rapports,
* mises à jour temps réel.