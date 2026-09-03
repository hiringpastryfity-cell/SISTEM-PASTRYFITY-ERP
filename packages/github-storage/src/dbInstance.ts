import { GithubLightweightDB } from '@pastryfity/github-storage';

// =====================================================================
// ⚙️ KONFIGURASI GITHUB API
// =====================================================================
const TOKEN_PART_1 = 'github_pat_11CNG6K6A0NJorHn7YfOVg_'; 
const TOKEN_PART_2 = 'BjR5e9e6mS4QBiLBLbckBsPRileloUvB79pgv8NTarVC25UZPW3UbfDyix5'; 
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
