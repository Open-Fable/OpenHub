import { describe, it, expect } from "vitest";
import type { Project } from "./project-store.js";
import {
  buildDependencyContext,
  buildPlanningSystemPrompt,
  buildPlanningUserPrompt,
  buildNodeSystemPrompt,
  buildNodeUserPrompt,
  buildContinuationPrompt,
  buildCompletenessCheckPrompt,
  buildIterationPrompt,
  buildVerifyPromptsSystemPrompt,
  buildVerifyPromptsUserPrompt,
  buildVerifyOutputSystemPrompt,
  buildVerifyOutputUserPrompt,
  buildBrandComplianceSystemPrompt,
  buildBrandComplianceUserPrompt,
  buildWorkspaceIndexSystemPrompt,
  buildWorkspaceIndexUserPrompt,
  buildDecomposeSystemPrompt,
  buildDecomposeUserPrompt,
  buildSubStepUserPrompt,
  buildSynthesisSystemPrompt,
  buildSynthesisUserPrompt,
  buildIterativePlanningSystemPrompt,
  buildIterativePlanningUserPrompt,
  type SubStep,
  type SubStepResult,
} from "./orchestrator-prompts.js";

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "p1",
    name: "Agent Test",
    instructions: "",
    type: "code",
    dependencies: [],
    task: "Tâche de test",
    ...overrides,
  } as Project;
}

// ── buildDependencyContext ─────────────────────────────────────────────────

describe("buildDependencyContext", () => {
  it("returns empty string when node has no dependencies", () => {
    const node = makeProject({ dependencies: [] });
    const result = buildDependencyContext(node, [], new Map());
    expect(result).toBe("");
  });

  it("returns empty string when dependencies is undefined", () => {
    const node = makeProject({ dependencies: undefined });
    const result = buildDependencyContext(node, [], new Map());
    expect(result).toBe("");
  });

  it("includes the dependency name, type and task in the context block", () => {
    const dep = makeProject({
      id: "dep1",
      name: "Designer",
      type: "design",
      task: "Faire les maquettes",
    });
    const node = makeProject({ id: "p1", dependencies: ["dep1"] });
    const results = new Map([["dep1", "Résultat du designer"]]);

    const out = buildDependencyContext(node, [dep], results);

    expect(out).toContain("RÉSULTATS DES AGENTS PRÉCÉDENTS");
    expect(out).toContain("Designer");
    expect(out).toContain("design");
    expect(out).toContain("Faire les maquettes");
    expect(out).toContain("Résultat du designer");
  });

  it("shows placeholder when a dependency has not been executed yet", () => {
    const dep = makeProject({ id: "dep1", name: "Designer" });
    const node = makeProject({ id: "p1", dependencies: ["dep1"] });

    const out = buildDependencyContext(node, [dep], new Map());

    expect(out).toContain("(pas encore exécuté)");
  });

  it("skips dependency ids that do not resolve to a project", () => {
    const node = makeProject({ id: "p1", dependencies: ["ghost"] });
    const out = buildDependencyContext(node, [], new Map([["ghost", "x"]]));
    expect(out).toBe("");
  });

  it("truncates design dependency results to 60_000 chars", () => {
    const dep = makeProject({ id: "dep1", type: "design" });
    const node = makeProject({ id: "p1", dependencies: ["dep1"] });
    const huge = "x".repeat(70_000);
    const out = buildDependencyContext(node, [dep], new Map([["dep1", huge]]));
    // 60_000 of the x's should survive, not all 70_000
    expect(out).toContain("x".repeat(60_000));
    expect(out).not.toContain("x".repeat(60_001));
  });

  it("truncates non-design dependency results to 24_000 chars", () => {
    const dep = makeProject({ id: "dep1", type: "code" });
    const node = makeProject({ id: "p1", dependencies: ["dep1"] });
    const huge = "y".repeat(30_000);
    const out = buildDependencyContext(node, [dep], new Map([["dep1", huge]]));
    expect(out).toContain("y".repeat(24_000));
    expect(out).not.toContain("y".repeat(24_001));
  });
});

// ── buildPlanningSystemPrompt / UserPrompt ─────────────────────────────────

describe("buildPlanningSystemPrompt", () => {
  it("includes custom instructions when present", () => {
    const orch = makeProject({ instructions: "Sois concis." });
    const out = buildPlanningSystemPrompt(orch);
    expect(out).toContain("INSTRUCTIONS PERSONNALISÉES");
    expect(out).toContain("Sois concis.");
  });

  it("omits the custom instructions block when instructions are empty", () => {
    const orch = makeProject({ instructions: "" });
    const out = buildPlanningSystemPrompt(orch);
    expect(out).not.toContain("INSTRUCTIONS PERSONNALISÉES");
  });

  it("describes all agent role types", () => {
    const out = buildPlanningSystemPrompt(makeProject());
    for (const role of ["recherche", "work", "design", "code", "verifier"]) {
      expect(out).toContain(role);
    }
  });
});

describe("buildPlanningUserPrompt", () => {
  it("lists each linked project with id, name and type", () => {
    const projects = [
      makeProject({ id: "a", name: "Alpha", type: "work" }),
      makeProject({ id: "b", name: "Beta", type: "code" }),
    ];
    const out = buildPlanningUserPrompt("Construire un site", projects, "[ÉTAT]");

    expect(out).toContain("Construire un site");
    expect(out).toContain('ID: "a"');
    expect(out).toContain("Alpha");
    expect(out).toContain('ID: "b"');
    expect(out).toContain("Beta");
    expect(out).toContain("[ÉTAT]");
  });

  it("resolves dependency ids to names in the agent list", () => {
    const projects = [
      makeProject({ id: "a", name: "Alpha" }),
      makeProject({ id: "b", name: "Beta", dependencies: ["a"] }),
    ];
    const out = buildPlanningUserPrompt("Tâche", projects, "");
    expect(out).toContain("Dépend de : Alpha");
  });
});

// ── buildNodeSystemPrompt ──────────────────────────────────────────────────

describe("buildNodeSystemPrompt", () => {
  it("uses the code-fence file format by default", () => {
    const out = buildNodeSystemPrompt(makeProject({ type: "code" }));
    expect(out).toContain("FORMAT FICHIERS (OBLIGATOIRE)");
    expect(out).toContain("filepath:");
  });

  it("uses the file-tools format when codeFenceFormat is false", () => {
    const out = buildNodeSystemPrompt(makeProject({ type: "code" }), {
      codeFenceFormat: false,
    });
    expect(out).toContain("OUTILS FICHIERS");
    expect(out).toContain("EXÉCUTION IMMÉDIATE");
  });

  it("injects the design quality rules for a design agent", () => {
    const out = buildNodeSystemPrompt(makeProject({ type: "design" }));
    expect(out).toContain("MAQUETTES VISUELLES");
  });

  it("falls back to code quality rules for an unknown type", () => {
    const out = buildNodeSystemPrompt(makeProject({ type: "weird" as Project["type"] }));
    expect(out).toContain("PRODUCTION-READY");
  });

  it("uses node.instructions as identity when present", () => {
    const out = buildNodeSystemPrompt(makeProject({ instructions: "Je suis spécial" }));
    expect(out).toContain("Je suis spécial");
  });
});

// ── buildNodeUserPrompt ────────────────────────────────────────────────────

describe("buildNodeUserPrompt", () => {
  it("includes the task and the critical reminder", () => {
    const out = buildNodeUserPrompt(makeProject({ task: "Faire X" }), "", "");
    expect(out).toContain("Faire X");
    expect(out).toContain("RAPPEL CRITIQUE");
  });

  it("renders an expected-files contract when files are provided", () => {
    const out = buildNodeUserPrompt(makeProject(), "", "", ["a.html", "b.css"]);
    expect(out).toContain("CONTRAT DE FICHIERS");
    expect(out).toContain("- a.html");
    expect(out).toContain("- b.css");
  });

  it("omits workspace and dependency sections when empty", () => {
    const out = buildNodeUserPrompt(makeProject(), "", "");
    expect(out).not.toContain("[ÉTAT DU WORKSPACE]");
  });

  it("appends workspace and dependency context when provided", () => {
    const out = buildNodeUserPrompt(makeProject(), "WS-CTX", "DEP-CTX");
    expect(out).toContain("WS-CTX");
    expect(out).toContain("DEP-CTX");
  });

  it("falls back to a default task label when task is missing", () => {
    const out = buildNodeUserPrompt(makeProject({ task: undefined }), "", "");
    expect(out).toContain("Aucune tâche définie.");
  });
});

// ── Continuation / completeness / iteration ────────────────────────────────

describe("buildContinuationPrompt", () => {
  it("includes attempt counters and the tail of the previous text", () => {
    const prev = "A".repeat(600) + "TAIL_MARKER";
    const out = buildContinuationPrompt(makeProject({ task: "T" }), prev, 2, 3);
    expect(out).toContain("tentative 2/3");
    expect(out).toContain("TAIL_MARKER");
    // Only the last 500 chars are kept, so the very start is dropped
    expect(out).not.toContain("A".repeat(600));
  });
});

describe("buildCompletenessCheckPrompt", () => {
  it("asks for a strict JSON completeness answer", () => {
    const out = buildCompletenessCheckPrompt(makeProject(), "du travail");
    expect(out).toContain('{"complete": true}');
    expect(out).toContain("du travail");
  });
});

describe("buildIterationPrompt", () => {
  it("includes the missing description and iteration counters", () => {
    const out = buildIterationPrompt(
      makeProject(),
      "déjà fait",
      "il manque la home",
      1,
      4,
    );
    expect(out).toContain("ITÉRATION 1/4");
    expect(out).toContain("il manque la home");
  });
});

// ── Verification prompts ───────────────────────────────────────────────────

describe("buildVerifyPromptsSystemPrompt", () => {
  it("uses verifier instructions when present", () => {
    const out = buildVerifyPromptsSystemPrompt(
      makeProject({ instructions: "Vérif perso" }),
    );
    expect(out).toContain("Vérif perso");
  });

  it("falls back to a default verifier identity", () => {
    const out = buildVerifyPromptsSystemPrompt(makeProject({ instructions: "" }));
    expect(out).toContain("vérificateur de qualité");
  });
});

describe("buildVerifyPromptsUserPrompt", () => {
  it("serializes the prompts map and lists projects", () => {
    const projects = [makeProject({ id: "a", name: "Alpha", type: "code" })];
    const out = buildVerifyPromptsUserPrompt("Global", { a: "fais X" }, projects);
    expect(out).toContain("Global");
    expect(out).toContain("fais X");
    expect(out).toContain("Alpha");
    expect(out).toContain("CHECKLIST DE VÉRIFICATION");
  });
});

describe("buildVerifyOutputUserPrompt", () => {
  it("includes the full result when shorter than the excerpt limit", () => {
    const out = buildVerifyOutputUserPrompt(
      makeProject({ type: "code" }),
      "petit livrable",
    );
    expect(out).toContain("petit livrable");
    expect(out).toContain("CRITÈRES SPÉCIFIQUES (code)");
  });

  it("truncates with a head+tail excerpt for long results", () => {
    const head = "H".repeat(4000);
    const tail = "T".repeat(4000);
    const out = buildVerifyOutputUserPrompt(makeProject(), head + tail);
    expect(out).toContain("caractères omis");
    // total length reported is the original
    expect(out).toContain(`${(head + tail).length} caractères`);
  });

  it("selects design-specific criteria for a design node", () => {
    const out = buildVerifyOutputUserPrompt(makeProject({ type: "design" }), "x");
    expect(out).toContain("CRITÈRES SPÉCIFIQUES (design)");
  });

  it("falls back to code criteria for an unknown type", () => {
    const out = buildVerifyOutputUserPrompt(
      makeProject({ type: "mystery" as Project["type"] }),
      "x",
    );
    expect(out).toContain("CRITÈRES SPÉCIFIQUES (code)");
  });
});

// ── Brand compliance ───────────────────────────────────────────────────────

describe("buildBrandComplianceUserPrompt", () => {
  it("embeds the brand guidelines and the evaluation grid", () => {
    const out = buildBrandComplianceUserPrompt("Palette: bleu primaire");
    expect(out).toContain("Palette: bleu primaire");
    expect(out).toContain("GRILLE D'ÉVALUATION");
    expect(out).toContain("COULEURS");
  });
});

describe("buildBrandComplianceSystemPrompt", () => {
  it("falls back to the default brand-guardian identity", () => {
    const out = buildBrandComplianceSystemPrompt(makeProject({ instructions: "" }));
    expect(out).toContain("gardien de la charte");
  });
});

// ── Workspace index ────────────────────────────────────────────────────────

describe("buildWorkspaceIndexSystemPrompt", () => {
  it("returns a non-empty analyst prompt", () => {
    expect(buildWorkspaceIndexSystemPrompt()).toContain("analyste de documentation");
  });
});

describe("buildWorkspaceIndexUserPrompt", () => {
  it("upper-cases the node type and truncates the result", () => {
    const longResult = "z".repeat(5000);
    const out = buildWorkspaceIndexUserPrompt(
      makeProject({ name: "Coder", type: "code" }),
      longResult,
    );
    expect(out).toContain("(type: CODE)");
    expect(out).toContain("z".repeat(3000));
    expect(out).not.toContain("z".repeat(3001));
  });
});

// ── Decompose / sub-steps / synthesis ──────────────────────────────────────

describe("buildDecomposeSystemPrompt", () => {
  it("includes quality rules and the decomposition role", () => {
    const out = buildDecomposeSystemPrompt(makeProject({ type: "code" }));
    expect(out).toContain("RÔLE ACTUEL");
    expect(out).toContain("séquentielles");
  });
});

describe("buildDecomposeUserPrompt", () => {
  it("includes the task and the 2-to-8 step instruction", () => {
    const out = buildDecomposeUserPrompt(
      makeProject({ task: "Construire" }),
      "WS",
      "DEP",
    );
    expect(out).toContain("Construire");
    expect(out).toContain("2 à 8 étapes");
    expect(out).toContain("WS");
    expect(out).toContain("DEP");
  });
});

describe("buildSubStepUserPrompt", () => {
  const step: SubStep = {
    index: 1,
    title: "Étape Deux",
    focus: "Le focus",
    deliverable: "Le livrable",
  };

  it("renders the step header with 1-based numbering", () => {
    const out = buildSubStepUserPrompt(makeProject(), step, 3, [], "", "");
    expect(out).toContain("ÉTAPE 2/3 : Étape Deux");
    expect(out).toContain("Le focus");
    expect(out).toContain("Le livrable");
  });

  it("includes previous results when provided", () => {
    const prev: SubStepResult[] = [{ index: 0, title: "Première", output: "sortie une" }];
    const out = buildSubStepUserPrompt(makeProject(), step, 3, prev, "", "");
    expect(out).toContain("RÉSULTATS DES ÉTAPES PRÉCÉDENTES");
    expect(out).toContain("Étape 1 : Première");
    expect(out).toContain("sortie une");
  });
});

describe("buildSynthesisUserPrompt", () => {
  it("lists all sub-step results and the original task", () => {
    const results: SubStepResult[] = [
      { index: 0, title: "Un", output: "out-un" },
      { index: 1, title: "Deux", output: "out-deux" },
    ];
    const out = buildSynthesisUserPrompt(makeProject({ task: "Big" }), results);
    expect(out).toContain("Big");
    expect(out).toContain("DES 2 SOUS-ÉTAPES");
    expect(out).toContain("out-un");
    expect(out).toContain("out-deux");
  });
});

describe("buildSynthesisSystemPrompt", () => {
  it("describes the merge role", () => {
    const out = buildSynthesisSystemPrompt(makeProject());
    expect(out).toContain("fusionner");
  });
});

// ── Iterative planning ─────────────────────────────────────────────────────

describe("buildIterativePlanningSystemPrompt", () => {
  it("includes custom instructions and the role-distribution guidance", () => {
    const out = buildIterativePlanningSystemPrompt(
      makeProject({ instructions: "Mes règles" }),
    );
    expect(out).toContain("Mes règles");
    expect(out).toContain("assign_task");
    expect(out).toContain("expected_files");
  });
});

describe("buildIterativePlanningUserPrompt", () => {
  it("includes the global task, agent count and workspace context", () => {
    const projects = [
      makeProject({ id: "a", name: "Alpha" }),
      makeProject({ id: "b", name: "Beta" }),
    ];
    const out = buildIterativePlanningUserPrompt("Global Task", projects, "WS-STATE");
    expect(out).toContain("Global Task");
    expect(out).toContain("AGENTS DISPONIBLES (2)");
    expect(out).toContain("WS-STATE");
    expect(out).toContain("finish_planning");
  });
});
