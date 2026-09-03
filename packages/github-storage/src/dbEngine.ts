// packages/github-storage/src/dbEngine.ts

interface GithubConfig {
  owner: string;
  repo: string;
  token: string;
  branch?: string;
}

export class GithubLightweightDB {
  private config: GithubConfig;
  private baseUrl: string;

  constructor(config: GithubConfig) {
    this.config = { branch: 'main', ...config };
    this.baseUrl = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents`;
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${this.config.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };
  }

  // Mengambil data JSON dari GitHub Storage
  async readData<T>(path: string): Promise<{ data: T | null; sha: string | null }> {
    try {
      const response = await fetch(`${this.baseUrl}/${path}?ref=${this.config.branch}`, {
        headers: this.headers,
      });

      if (response.status === 404) return { data: null, sha: null };
      if (!response.ok) throw new Error(`GitHub API Error: ${response.statusText}`);

      const fileData = await response.json();
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      
      return { data: JSON.parse(content) as T, sha: fileData.sha };
    } catch (error) {
      console.error("Error reading from GitHub DB:", error);
      return { data: null, sha: null };
    }
  }

  // Menyimpan atau menimpa data JSON ke GitHub Storage
  async writeData(path: string, payload: any, commitMessage: string, sha?: string): Promise<boolean> {
    try {
      const contentBase64 = Buffer.from(JSON.stringify(payload, null, 2)).toString('base64');
      const body = {
        message: commitMessage,
        content: contentBase64,
        branch: this.config.branch,
        ...(sha && { sha }), // SHA wajib disertakan jika file sudah ada (Update)
      };

      const response = await fetch(`${this.baseUrl}/${path}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(body),
      });

      return response.ok;
    } catch (error) {
      console.error("Error writing to GitHub DB:", error);
      return false;
    }
  }
}
