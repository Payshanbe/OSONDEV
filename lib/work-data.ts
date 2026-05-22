/** Portfolio data — backed by `content/{locale}/work.json`. */

export type { WorkProject } from "@/lib/content/types";
export {
  getWorkProject,
  getWorkProjectSync,
  getWorkProjects,
  getWorkProjectsSync,
} from "@/lib/content";

/** @deprecated Use `getWorkProjects(locale)`. */
import { getWorkProjectsSync } from "@/lib/content";
import { defaultLocale } from "@/lib/i18n/config";

export const WORK_PROJECTS = getWorkProjectsSync(defaultLocale);
