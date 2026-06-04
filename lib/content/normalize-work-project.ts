import type { WorkMediaItem, WorkProject } from "@/lib/content/types";

/** Merge legacy coverImage/coverVideo into gallery; keep gallery as source of truth. */
export function normalizeWorkProject(project: WorkProject): WorkProject {
  if (project.gallery?.length) {
    return {
      ...project,
      gallery: project.gallery.filter((item) => item.url?.trim()),
    };
  }

  const gallery: WorkMediaItem[] = [];
  if (project.coverVideo?.trim()) {
    gallery.push({ url: project.coverVideo.trim(), type: "video" });
  }
  if (project.coverImage?.trim()) {
    gallery.push({ url: project.coverImage.trim(), type: "image" });
  }

  if (!gallery.length) return project;
  return { ...project, gallery };
}

export function getPrimaryMedia(project: WorkProject): WorkMediaItem | undefined {
  const normalized = normalizeWorkProject(project);
  return normalized.gallery?.[0];
}
