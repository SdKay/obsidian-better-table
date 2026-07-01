/** "A" → 0, "B" → 1, "Z" → 25, "AA" → 26 */
export function colLetterToIndex(letters: string): number {
	let result = 0;
	for (const ch of letters.toUpperCase()) {
		result = result * 26 + (ch.charCodeAt(0) - 64);
	}
	return result - 1;
}

/** 0 → "A", 1 → "B", 25 → "Z", 26 → "AA" */
export function colIndexToLetter(idx: number): string {
	let result = '';
	let n = idx + 1;
	while (n > 0) {
		result = String.fromCharCode(65 + ((n - 1) % 26)) + result;
		n = Math.floor((n - 1) / 26);
	}
	return result;
}

/** "A1" → { row: 0, col: 0 }  (0-indexed, row 1 = header) */
export function parseCellCoord(str: string): { row: number; col: number } | null {
	const m = /^([A-Z]+)(\d+)$/.exec(str.trim().toUpperCase());
	if (!m) return null;
	const letter = m[1], numStr = m[2];
	if (!letter || !numStr) return null;
	return { col: colLetterToIndex(letter), row: parseInt(numStr) - 1 };
}

/** { row: 0, col: 0 } → "A1" */
export function coordToString(row: number, col: number): string {
	return colIndexToLetter(col) + (row + 1);
}
