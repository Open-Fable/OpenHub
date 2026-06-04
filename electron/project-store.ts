import { promises as fs } from "fs";
import path from "path";
import { homedir } from "os";
import { randomBytes } from "crypto";

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly instructions: string;
  readonly color: string;
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

async function load(): Promise<ProjectStoreData> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    cache = JSON.parse(raw) as ProjectStoreData;
    return cache;
  } catch {
    cache = { projects: [], activeProjectId: null };
    return cache;
  }
}

async function save(data: ProjectStoreData): Promise<void> {
  await ensureDir();
  cache = data;
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
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
  project: Omit<Project, "id" | "createdAt" | "updatedAt"> & { id?: string },
): Promise<Project> {
  const data = await load();
  const now = Date.now();
  const existing = project.id ? data.projects.find((p) => p.id === project.id) : null;

  if (existing) {
    const updated: Project = {
      ...existing,
      name: project.name,
      instructions: project.instructions,
      color: project.color,
      updatedAt: now,
    };
    await save({
      ...data,
      projects: data.projects.map((p) => (p.id === updated.id ? updated : p)),
    });
    return updated;
  }

  const created: Project = {
    id: randomBytes(8).toString("hex"),
    name: project.name,
    instructions: project.instructions,
    color: project.color || DEFAULT_COLORS[data.projects.length % DEFAULT_COLORS.length],
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
