/**
 * Estime la taille de l'alphabet du mot de passe en fonction des types de caractères.
 * @param password - Le mot de passe à analyser.
 */
function estimateAlphabetSize(password: string): number {
    let hasLower = /[a-z]/.test(password);
    let hasUpper = /[A-Z]/.test(password);
    let hasDigits = /[0-9]/.test(password);
    let hasSymbols = /[^a-zA-Z0-9]/.test(password);

    let size = 0;
    if (hasLower) size += 26;
    if (hasUpper) size += 26;
    if (hasDigits) size += 10;
    if (hasSymbols) size += 33;
    return size;
}

/**
 * Calcule l'entropie en bits.
 * @param password - Le mot de passe à analyser.
 * @returns L'entropie en bits.
 */
export function calculateEntropy(password: string): number {
    const length = password.length;
    const alphabetSize = estimateAlphabetSize(password);
    if (alphabetSize === 0) return 0; // vide
    return length * Math.log2(alphabetSize);
}
