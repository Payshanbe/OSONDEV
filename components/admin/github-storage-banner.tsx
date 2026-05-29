import { isGitHubStorageEnabled } from "@/lib/content/storage";

export function GitHubStorageBanner() {
  if (!isGitHubStorageEnabled()) {
    return (
      <div
        className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90"
        role="status"
      >
        <p className="font-medium text-amber-50">Production storage not configured</p>
        <p className="mt-1 text-amber-100/80">
          On Vercel, saves only work after you set{" "}
          <code className="text-amber-50">GITHUB_TOKEN</code>,{" "}
          <code className="text-amber-50">GITHUB_REPO_OWNER</code>, and{" "}
          <code className="text-amber-50">GITHUB_REPO_NAME</code> in environment variables.
        </p>
      </div>
    );
  }

  return (
    <div
      className="mb-6 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100/90"
      role="status"
    >
      <p className="font-medium text-emerald-50">Saving to GitHub</p>
      <p className="mt-1 text-emerald-100/80">
        Changes are committed to the repository. Vercel redeploys automatically; the public site
        updates in about 1–2 minutes.
      </p>
    </div>
  );
}
