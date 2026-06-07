import { promises as fs } from "fs";
import path from "path";
import { homedir } from "os";
import { randomBytes } from "crypto";

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly instructions: string;
  readonly color: string;
  readonly type?: "code" | "design" | "work" | "orchestrator" | "verifier";
  readonly model?: string;
  readonly linked?: readonly string[];
  readonly dependencies?: readonly string[];
  readonly orchSettings?: {
    readonly autoDistribute: boolean;
    readonly checkCoherence: boolean;
    readonly relaunchOnError: boolean;
  };
  readonly bypassMemory?: boolean;
  readonly maxRetries?: number;
  readonly x?: number;
  readonly y?: number;
  readonly task?: string;
  readonly createdAt: number;
  readonly updatedAt: number;
}

interface ProjectStoreData {
  readonly projects: readonly Project[];
  readonly activeProjectId: string | null;
}

const STORE_DIR = path.join(homedir(), ".config", "openhub");
const STORE_PATH = path.join(STORE_DIR, "projects.json");

const DEFAULT_COLORS = [
  "#7c5cfc",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
];

let cache: ProjectStoreData | null = null;

async function ensureDir(): Promise<void> {
  await fs.mkdir(STORE_DIR, { recursive: true });
}

const INITIAL_PROJECTS: readonly Project[] = [
  {
    id: "p1",
    name: "API Backend — Authentification",
    instructions:
      "Tu es un expert backend Node.js/TypeScript. Tu écris du code sécurisé, documenté (JSDoc), avec des tests unitaires Jest. Tu utilises PostgreSQL et gères les erreurs.",
    color: "#7c5cfc",
    type: "code",
    model: "",
    linked: [],
    dependencies: [],
    x: 480,
    y: 100,
    task: "Implémenter le flux OAuth2 avec refresh tokens.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "p2",
    name: "Design System — Composants",
    instructions:
      "Tu es un designer UI/UX expert en design systems. Tu crées des composants accessibles WCAG AA, responsive, avec des styles CSS propres.",
    color: "#f59e0b",
    type: "design",
    model: "",
    linked: [],
    dependencies: [],
    x: 480,
    y: 280,
    task: "Créer les composants de boutons et inputs v1.0.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "p3",
    name: "Pipeline CI/CD — Déploiement",
    instructions:
      "Tu es un ingénieur DevOps. Tu configures des pipelines CI/CD GitHub Actions robustes. Tu optimises le build et le caching.",
    color: "#10b981",
    type: "work",
    model: "",
    linked: [],
    dependencies: [],
    x: 480,
    y: 460,
    task: "Mettre en place le pipeline GitHub Actions de vérification.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "p4",
    name: "Refonte onboarding",
    instructions:
      "Tu es un chef de projet IA. Tu coordonnes plusieurs agents pour livrer un produit complet. Tu distribues les tâches et assures la cohérence globale.",
    color: "#10b981",
    type: "orchestrator",
    model: "",
    linked: ["p1", "p2", "p3", "p5"],
    dependencies: [],
    orchSettings: { autoDistribute: true, checkCoherence: true, relaunchOnError: true },
    x: 100,
    y: 280,
    task: "Coordonner la refonte complète de l'onboarding.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "p5",
    name: "Tests E2E — Playwright",
    instructions:
      "Tu es un ingénieur QA. Tu écris des tests de bout en bout robustes avec Playwright. Tu couvres les flux critiques d'authentification.",
    color: "#ef4444",
    type: "code",
    model: "",
    linked: [],
    dependencies: ["p1"],
    x: 760,
    y: 100,
    task: "Écrire les tests E2E de connexion et inscription.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "p6",
    name: "Vérification qualité globale",
    instructions:
      "Tu es un vérificateur qualité. Tu analyses la cohérence visuelle, la sécurité du code, et la conformité aux spécifications initiales.",
    color: "#3b82f6",
    type: "verifier",
    model: "",
    linked: ["p1", "p2", "p3", "p5"],
    dependencies: ["p1", "p2", "p3", "p5"],
    bypassMemory: true,
    x: 760,
    y: 280,
    task: "Vérifier la cohérence, l'accessibilité WCAG et la conformité finale du projet.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

async function load(): Promise<ProjectStoreData> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    cache = JSON.parse(raw) as ProjectStoreData;
    return cache;
  } catch {
    cache = { projects: INITIAL_PROJECTS, activeProjectId: "p4" };
    await save(cache);
    return cache;
  }
}

async function save(data: ProjectStoreData): Promise<void> {
  await ensureDir();
  const tmpPath = STORE_PATH + ".tmp." + randomBytes(4).toString("hex");
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmpPath, STORE_PATH);
  cache = data;
}

export async function getProjects(): Promise<readonly Project[]> {
  const data = await load();
  return data.projects;
}

export async function getActiveProjectId(): Promise<string | null> {
  const data = await load();
  return data.activeProjectId;
}

export async function getActiveProject(): Promise<Project | null> {
  const data = await load();
  if (!data.activeProjectId) return null;
  return data.projects.find((p) => p.id === data.activeProjectId) ?? null;
}

export async function saveProject(
  project: Partial<Omit<Project, "createdAt" | "updatedAt">> & {
    name: string;
    id?: string;
  },
): Promise<Project> {
  const data = await load();
  const now = Date.now();
  const existing = project.id ? data.projects.find((p) => p.id === project.id) : null;

  if (existing) {
    const updated: Project = {
      ...existing,
      name: project.name,
      instructions: project.instructions ?? existing.instructions ?? "",
      color: project.color ?? existing.color ?? "",
      type: project.type ?? existing.type,
      model: project.model ?? existing.model,
      linked: project.linked ?? existing.linked,
      dependencies: project.dependencies ?? existing.dependencies,
      orchSettings: project.orchSettings ?? existing.orchSettings,
      bypassMemory: project.bypassMemory ?? existing.bypassMemory,
      maxRetries: project.maxRetries ?? existing.maxRetries,
      x: project.x ?? existing.x,
      y: project.y ?? existing.y,
      task: project.task ?? existing.task,
      updatedAt: now,
    };
    await save({
      ...data,
      projects: data.projects.map((p) => (p.id === updated.id ? updated : p)),
    });
    return updated;
  }

  const created: Project = {
    id: project.id || randomBytes(8).toString("hex"),
    name: project.name,
    instructions: project.instructions || "",
    color: project.color || DEFAULT_COLORS[data.projects.length % DEFAULT_COLORS.length],
    type: project.type,
    model: project.model,
    linked: project.linked || [],
    dependencies: project.dependencies || [],
    orchSettings: project.orchSettings,
    bypassMemory: project.bypassMemory,
    maxRetries: project.maxRetries,
    x: project.x,
    y: project.y,
    task: project.task || "",
    createdAt: now,
    updatedAt: now,
  };
  await save({ ...data, projects: [...data.projects, created] });
  return created;
}

export async function deleteProject(id: string): Promise<void> {
  const data = await load();
  const nextActive = data.activeProjectId === id ? null : data.activeProjectId;
  await save({
    projects: data.projects.filter((p) => p.id !== id),
    activeProjectId: nextActive,
  });
}

export async function setActiveProject(id: string | null): Promise<void> {
  const data = await load();
  if (id && !data.projects.some((p) => p.id === id)) return;
  await save({ ...data, activeProjectId: id });
}
