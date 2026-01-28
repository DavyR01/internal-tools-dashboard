# Internal Tools Management Dashboard

## 🚀 Quick Start

Ce projet est une application frontend développée avec Next.js permettant de monitorer et gérer les outils SaaS internes d’une entreprise.

Il s’agit d’un **dashboard interne** destiné à un Admin IT, permettant de :
- monitorer les outils SaaS utilisés au sein de l’organisation,
- suivre les coûts et l’usage,
- gérer le cycle de vie des outils internes.

### Installation

```bash
npm install
npm run dev
```

L’application est accessible sur :

```
http://localhost:3000
```


### Accès

* `/` : Dashboard (J6)
* `/tools` : Tools catalog & management (J7)
* `/analytics` : Analytics & charts (J8)

---

## 🏗️ Architecture

L’architecture a été pensée pour être **simple, lisible et maintenable**, en respectant les bonnes pratiques attendues pour un outil interne professionnel.
Elle repose sur une séparation claire des responsabilités :

* **routing** géré par Next.js (App Router),
* **composants UI réutilisables**,
* **logique métier par feature**,
* **data fetching centralisé**.

Structure principale :

```text
app/                # Routes (Dashboard, Tools, Analytics)
components/         # Design system et layout partagé
├─ ui/              # Composants UI réutilisables (Card, Button, ChartTooltip…)
└─ layout/          # Header et layout global
features/           # Logique par domaine (dashboard, tools, analytics)
├─ dashboard/       # KPIs et tables du dashboard (J6)
├─ tools/           # Gestion des outils SaaS (J7)
└─ analytics/       # KPIs et data visualisation (J8)
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

Les versions light et dark partagent **exactement la même structure et hiérarchie UI**, seules les valeurs de thème diffèrent.

---

## 🔗 Navigation & User Journey

Le parcours utilisateur suit un flux logique et progressif :

**Dashboard → Tools → Analytics**

- Le **Dashboard** fournit une vue globale (KPIs, outils récents),
- La page **Tools** permet la gestion opérationnelle détaillée des outils SaaS,
- La page **Analytics** apporte des insights orientés coûts et usage.

La navigation est assurée par un **header global unique partagé** entre toutes les pages.

---

## 📊 Data Integration Strategy

Toutes les données proviennent d’un backend simulé via **JSON Server**.

Stratégie :

- **Axios** comme client HTTP,
- **TanStack Query** pour la gestion du server state,
- pagination, filtres, tri et mutations gérés côté serveur.

Cette approche garantit :
- une séparation claire entre UI state et données serveur,
- une gestion robuste des loading, empty et error states,
- une base scalable pour les opérations CRUD.

---

## 📱 Progressive Responsive Design

L’application suit une approche **mobile-first** avec des breakpoints progressifs :

- Mobile : layouts empilés, tableau scrollable horizontalement, menu hamburger,
- Tablet : grilles intermédiaires et filtres adaptatifs,
- Desktop : dashboards complets et interactions avancées.

Les composants du design system sont conçus pour s’adapter naturellement à ces contraintes.

---

## 🧪 Testing Strategy

L’application inclut des **tests unitaires ciblés** afin de sécuriser les composants et interactions critiques,
sans surcharger le scope du test technique.

Stack utilisée :
- **Jest** comme test runner,
- **React Testing Library** pour tester les comportements utilisateur.

Les tests se concentrent volontairement sur :
- les états UI critiques (loading, empty, error),
- les composants mutualisés (AnalyticsWidget),
- les interactions métier clés (enable / disable tool, modales).

Les visualisations (Recharts) et le design system ne sont pas testés de manière exhaustive
afin de privilégier la robustesse et la maintenabilité.

### Lancer les tests
```bash
npm test
```

---

## ⚡ Performance Optimizations

Plusieurs choix visent à garantir de bonnes performances :

* React Query pour limiter les requêtes inutiles (cache et déduplication) ,
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

### Analytics (J8)

La page **Analytics** apporte une vision orientée pilotage et optimisation des coûts.

Elle comprend :

* **KPIs Analytics** fournissant une vue synthétique des coûts et usages,
* **Monthly spend evolution** (LineChart) avec une échelle dynamique adaptée aux données réelles,
* **Cost by department** (Donut chart) basé sur l’agrégation des coûts mensuels par département,
* **Top expensive tools** (Bar chart) permettant d’identifier les principaux leviers d’optimisation.

Choix clés :

* classement **relatif** des outils par coût (aucun seuil arbitraire),
* échelles dynamiques afin de garantir la lisibilité même avec des variations faibles,
* tooltips thémés et cohérents entre light et dark mode,
* responsive intelligent avec adaptation de l’orientation des graphiques selon le viewport,
* aucune donnée artificielle ou logique métier inventée côté frontend.

Ces choix garantissent une visualisation fiable, lisible et défendable dans un contexte d’outil interne professionnel.

---

## 🔮 Next Steps / Complete App Vision

Les évolutions possibles incluent :

* alertes intelligentes de coûts,
* recommandations d’optimisation SaaS,
* projections budgétaires,
* export de rapports,
* mises à jour temps réel.