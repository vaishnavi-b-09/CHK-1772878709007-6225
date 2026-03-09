# Git Commit Strategy for Gyan Setu

## Branch Structure
```
main (production-ready)
  └── develop (integration branch)
      ├── feature/project-setup
      ├── feature/core-components
      ├── feature/api-routes
      └── feature/documentation
```

## Commit Plan

### Phase 1: Project Foundation (Branch: feature/project-setup)
**Commits:**
1. Initial commit with Next.js setup and dependencies
2. Add Tailwind CSS configuration and global styles
3. Add Firebase configuration and environment setup
4. Add .gitignore and project configuration files

**Files:**
- package.json, package-lock.json
- next.config.mjs, tsconfig.json
- tailwind.config.ts, postcss.config.js
- .gitignore, .env.example
- app/globals.css, app/layout.tsx
- lib/firebase.ts, app/firebase.ts

---

### Phase 2: Core UI Components (Branch: feature/core-components)
**Commits:**
1. Add navigation sidebar and layout components
2. Add visualization components (3D and 2D engines)
3. Add chat interface components
4. Add utility components and animations

**Files:**
- app/components/Sidebar.tsx
- app/components/InlineLesson.tsx
- app/components/FabricBoard.tsx
- app/components/ThreeDBoard.tsx
- app/components/MagicSearch.tsx
- app/components/PetCanvas.tsx
- app/components/ArPet.tsx
- app/components/LearningOverlay.tsx
- app/components/VisualizerWrapper.tsx

---

### Phase 3: API Routes & Backend (Branch: feature/api-routes)
**Commits:**
1. Add AI chat and explanation API routes
2. Add visualization generation API routes
3. Add learning roadmap and concept explanation APIs
4. Add model testing and health check endpoints

**Files:**
- app/api/explain/route.ts
- app/api/explain-concept/route.ts
- app/api/visualize/route.ts
- app/api/visualize-3d/route.ts
- app/api/roadmap/route.ts
- app/api/check-models/route.ts
- app/api/test-openai/route.ts

---

### Phase 4: Pages & Documentation (Branch: feature/pages-and-docs)
**Commits:**
1. Add main application pages (learn, visualizer, dashboard)
2. Add authentication and profile pages
3. Add comprehensive documentation (README, ARCHITECTURE)
4. Add public assets and final touches

**Files:**
- app/page.tsx
- app/learn/page.tsx
- app/visualizer/page.tsx
- app/syllabus/page.tsx
- app/dashboard/page.tsx
- app/leaderboard/page.tsx
- app/profile/page.tsx
- app/login/page.tsx
- app/check-models/page.tsx
- README.md
- ARCHITECTURE.md
- public/* (assets)

---

## Merge Strategy
1. feature/project-setup → develop
2. feature/core-components → develop
3. feature/api-routes → develop
4. feature/pages-and-docs → develop
5. develop → main (final release)

## Commit Message Convention
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

**Examples:**
- `feat(setup): initialize Next.js project with TypeScript`
- `feat(components): add 3D visualization engine with Three.js`
- `feat(api): implement OpenAI chat integration`
- `docs: add comprehensive README and architecture documentation`
