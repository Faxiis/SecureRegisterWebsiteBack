/**
 * Calcule la redondance d'un mot de passe.
 */
export function calculateRedundancy(password: string): number {
    const len = password.length;
    if (len === 0) return 1;

    for (let patternLen = 1; patternLen <= len / 2; patternLen++) {
        const pattern = password.slice(0, patternLen);
        let repeated = '';
        while (repeated.length < len) repeated += pattern;

        let matchCount = 0;
        for (let i = 0; i < len; i++) {
            if (password[i] === repeated[i]) matchCount++;
        }
        const redundancy = matchCount / len;
        if (redundancy > 0.5) return redundancy;
    }

    return 0;
}