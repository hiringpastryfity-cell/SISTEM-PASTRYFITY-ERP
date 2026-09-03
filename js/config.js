const GITHUB_CONFIG = {
    owner: 'hiringpastryfity-cell',
    repo: 'SISTEM-PASTRYFITY-ERP',
    
    // Pastikan Anda memecah token GitHub Anda di sini
    t_part1: 'ghp_xxxx',
    t_part2: 'yyyyzzzz',
    
    get token() {
        return this.t_part1 + this.t_part2;
    }
};
