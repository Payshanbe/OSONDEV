/**
 * GitHub Contents API — read/write JSON under content/ in the repo.
 * Used on Vercel where the filesystem is read-only.
 */

const GITHUB_API = "https://api.github.com";

export interface GitHubStorageConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export function getGitHubStorageConfig(): GitHubStorageConfig | null {
  const token = process.env.GITHUB_TOKEN?.trim();
  const owner = process.env.GITHUB_REPO_OWNER?.trim();
  const repo = process.env.GITHUB_REPO_NAME?.trim();
  const branch = process.env.GITHUB_BRANCH?.trim() || "main";

  if (!token || !owner || !repo) return null;
  return { token, owner, repo, branch };
}

export function isGitHubStorageEnabled(): boolean {
  return getGitHubStorageConfig() !== null;
}

interface GitHubContentResponse {
  content?: string;
  sha?: string;
  message?: string;
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

/** Read a file from the repo. Returns null if the path does not exist (404). */
export async function readGitHubFile(repoPath: string): Promise<string | null> {
  const config = getGitHubStorageConfig();
  if (!config) return null;

  const url = `${GITHUB_API}/repos/${config.owner}/${config.repo}/contents/${repoPath}?ref=${encodeURIComponent(config.branch)}`;
  const res = await fetch(url, {
    headers: authHeaders(config.token),
    next: { revalidate: 0 },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub read failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as GitHubContentResponse;
  if (!data.content) return null;
  return Buffer.from(data.content, "base64").toString("utf-8");
}

/** Create or update a file in the repo. */
export async function writeGitHubFile(
  repoPath: string,
  body: string,
  commitMessage: string,
): Promise<void> {
  const config = getGitHubStorageConfig();
  if (!config) {
    throw new Error("GitHub storage is not configured");
  }

  const url = `${GITHUB_API}/repos/${config.owner}/${config.repo}/contents/${repoPath}`;
  const existingSha = await getGitHubFileSha(repoPath, config);

  const payload: Record<string, string> = {
    message: commitMessage,
    content: Buffer.from(body, "utf-8").toString("base64"),
    branch: config.branch,
  };
  if (existingSha) payload.sha = existingSha;

  const res = await fetch(url, {
    method: "PUT",
    headers: authHeaders(config.token),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write failed (${res.status}): ${err}`);
  }
}

async function getGitHubFileSha(
  repoPath: string,
  config: GitHubStorageConfig,
): Promise<string | undefined> {
  const url = `${GITHUB_API}/repos/${config.owner}/${config.repo}/contents/${repoPath}?ref=${encodeURIComponent(config.branch)}`;
  const res = await fetch(url, { headers: authHeaders(config.token) });
  if (res.status === 404) return undefined;
  if (!res.ok) return undefined;
  const data = (await res.json()) as GitHubContentResponse;
  return data.sha;
}
