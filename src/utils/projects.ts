import projectsData from '../data/projects.json';

export type Step = { state?: string; completed?: boolean };
export type Project = (typeof projectsData)[number];

export const projects = projectsData as unknown as Project[];

/** Normalise a development step to one of three states. */
export function stepState(step: Step): 'completed' | 'in-progress' | 'pending' {
  const raw = step.state || (step.completed ? 'completed' : 'pending');
  return raw === 'completed' || raw === 'in-progress' ? raw : 'pending';
}

export function statusOf(project: Project): string {
  return (project as any).status || 'released';
}

/** Steps closed / total for one project. */
export function progressOf(project: Project) {
  const steps = ((project as any).developmentStatus || []) as Step[];
  const done = steps.filter((s) => stepState(s) === 'completed').length;
  return { done, total: steps.length, steps };
}

/** Site-wide counters — the numbers the home page leads with. */
export function totals() {
  let done = 0;
  let work = 0;
  let pending = 0;
  for (const p of projects) {
    for (const s of ((p as any).developmentStatus || []) as Step[]) {
      const st = stepState(s);
      if (st === 'completed') done += 1;
      else if (st === 'in-progress') work += 1;
      else pending += 1;
    }
  }
  return {
    products: projects.length,
    released: projects.filter((p) => statusOf(p) === 'released').length,
    inProgress: projects.filter((p) => statusOf(p) !== 'released').length,
    extensions: projects.filter((p) =>
      (p as any).tech.some((t: string) => /Browser Extension|Chrome API/i.test(t))
    ).length,
    steps: done + work + pending,
    done,
    work,
    pending,
  };
}

/**
 * Which projects get a full-bleed slide on the home page.
 * Featured first, then the rest — nothing is hidden behind the slider,
 * the ledger below carries every project. Mark more projects
 * `"featured": true` in projects.json to narrow this to a curated set.
 */
export function slides(): Project[] {
  const featured = projects.filter((p) => (p as any).featured);
  return featured.length >= 3 ? featured : projects;
}

/** Technology counts across every project's stack. */
export function stackCounts(limit = 12) {
  const counts = new Map<string, number>();
  for (const p of projects) {
    const seen = new Set<string>();
    for (const tech of [...(p as any).tech, ...(p as any).techStack]) {
      const key = String(tech).split(' (')[0].split(' / ')[0].trim();
      if (seen.has(key)) continue;
      seen.add(key);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
}
