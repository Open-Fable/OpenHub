import type { Project } from "./project-store";

/**
 * Projets de démonstration injectés au premier lancement (store vide).
 * Données pures, extraites de project-store.ts pour alléger ce module et isoler
 * le contenu éditorial de la logique de persistance.
 */
export const INITIAL_PROJECTS: readonly Project[] = [
  {
    id: "p1",
    name: "API Backend — Authentification",
    instructions:
      "You are a senior backend developer specialized in Node.js/TypeScript.\n\nSKILLS:\n- REST architecture, data validation, robust error handling\n- Jest unit tests, 80%+ coverage\n- PostgreSQL, parameterized queries, migrations\n\nRULES:\n- Strict TypeScript, no `any`\n- Functions < 50 lines, files < 400 lines\n- Explicit error handling at every level\n- No hardcoded secrets — use environment variables\n\nOUTPUT FORMAT:\n- Complete and functional code (no placeholders)\n- Name each created file with its relative path\n- Include all necessary imports",
    color: "#7c5cfc",
    type: "code",
    model: "",
    linked: [],
    dependencies: [],
    x: 480,
    y: 100,
    task: "Implement OAuth2 flow with refresh tokens.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "p2",
    name: "Design System — Composants",
    instructions:
      "You are a senior UI/UX designer expert in design systems.\n\nSKILLS:\n- Design systems, design tokens, reusable components\n- WCAG AA accessibility, contrasts, keyboard navigation\n- Modern CSS (variables, grid, flexbox), mobile-first responsive\n\nRULES:\n- Use CSS variables for colors, sizes, and spacing\n- Accessible components by default (ARIA roles, visible focus)\n- Name files descriptively\n\nOUTPUT FORMAT:\n- Complete and functional CSS/HTML code\n- Document tokens (colors, typography, spacing)\n- Provide variants (hover, focus, disabled) for each component",
    color: "#f59e0b",
    type: "design",
    model: "",
    linked: [],
    dependencies: [],
    x: 480,
    y: 280,
    task: "Create button and input components v1.0.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "p3",
    name: "Pipeline CI/CD — Déploiement",
    instructions:
      "You are a senior DevOps engineer specialized in CI/CD.\n\nSKILLS:\n- GitHub Actions, YAML workflows, build matrices\n- Cache optimization (npm, Docker layers)\n- Automated deployment, staging/production environments\n\nRULES:\n- Idempotent and reproducible pipelines\n- Separate stages (lint, test, build, deploy)\n- No hardcoded secrets — use GitHub Secrets\n\nOUTPUT FORMAT:\n- Complete and valid YAML files\n- Document each step with a brief comment\n- Name each file with its path (.github/workflows/...)",
    color: "#10b981",
    type: "work",
    model: "",
    linked: [],
    dependencies: [],
    x: 480,
    y: 460,
    task: "Set up the GitHub Actions verification pipeline.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "p4",
    name: "Refonte onboarding",
    instructions:
      "You are a senior AI project coordinator.\n\nSKILLS:\n- Breaking down complex tasks into autonomous subtasks\n- Inter-agent coordination, dependency management\n- Global deliverable coherence verification\n\nRULES:\n- Each subtask = one verifiable deliverable by a single agent\n- Specify goal, constraints, format, and success criteria\n- Detect contradictions and overlaps between agents\n- Ensure every aspect of the global task is covered",
    color: "#10b981",
    type: "orchestrator",
    model: "",
    linked: ["p1", "p2", "p3", "p5"],
    dependencies: [],
    orchSettings: { autoDistribute: true, checkCoherence: true, relaunchOnError: true },
    x: 100,
    y: 280,
    task: "Coordinate the complete onboarding redesign.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "p5",
    name: "Tests E2E — Playwright",
    instructions:
      "You are a senior QA engineer specialized in automated testing.\n\nSKILLS:\n- E2E tests with Playwright, robust selectors, assertions\n- Critical flow coverage (auth, payment, forms)\n- State management (fixtures, network mocks, test data)\n\nRULES:\n- Independent and reproducible tests (no test-to-test dependencies)\n- Stable selectors (data-testid, ARIA roles) rather than CSS classes\n- Cover happy path AND error cases\n\nOUTPUT FORMAT:\n- Complete test files with imports and configuration\n- Name tests descriptively (describes expected behavior)\n- Include necessary fixtures and helpers",
    color: "#ef4444",
    type: "code",
    model: "",
    linked: [],
    dependencies: ["p1"],
    x: 760,
    y: 100,
    task: "Write E2E tests for login and registration.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "p6",
    name: "Vérification qualité globale",
    instructions:
      "You are a senior quality verifier.\n\nSKILLS:\n- Code review (security, performance, maintainability)\n- Visual coherence and accessibility verification\n- Specification compliance validation\n\nRULES:\n- Evaluate each deliverable against objective, measurable criteria\n- Classify issues by severity: CRITICAL (blocking), WARNING (needs fix), INFO (suggestion)\n- Provide a concrete example and proposed fix for each issue\n- Don't invent problems — only report what is actually incorrect\n\nOUTPUT FORMAT:\n- Structured issue list with severity, description, and fix\n- Global score out of 100\n- Final verdict: VALIDATED or REJECTED with justification",
    color: "#3b82f6",
    type: "verifier",
    model: "",
    linked: ["p1", "p2", "p3", "p5"],
    dependencies: ["p1", "p2", "p3", "p5"],
    bypassMemory: true,
    x: 760,
    y: 280,
    task: "Verify coherence, WCAG accessibility, and final project compliance.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];
