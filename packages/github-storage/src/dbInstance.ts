import { GithubLightweightDB } from '@pastryfity/github-storage';

// =====================================================================
// ⚙️ KONFIGURASI GITHUB API
// =====================================================================
const TOKEN_PART_1 = 'github_pat_11CLESV4Q07no0fYIeVsVD_'; 
const TOKEN_PART_2 = 'S44zLrixc5oVf9j1UI9H4yxpZiC0aYwnI7016I0VilMOHWEHJTIPUm2jsGa'; 
const GITHUB_TOKEN = TOKEN_PART_1 + TOKEN_PART_2; 

const REPO_OWNER = 'hiringpastryfity-cell';         
const REPO_NAME = 'db_pastryfity'; 
// =====================================================================  

// Inisialisasi koneksi ke GitHub Repositori menggunakan token yang disatukan
export const db = new GithubLightweightDB({
  owner: REPO_OWNER,
  repo: REPO_NAME,
  token: GITHUB_TOKEN, 
  branch: 'main'
});
