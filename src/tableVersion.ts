/**
 * Rich Table block-format versioning.
 *
 * CURRENT_TABLE_VERSION is the highest format version this build can parse.
 * Bump it (and add a migration function below) whenever a breaking syntax
 * change makes old source strings unparseable by the new parser.
 *
 * Consumers:
 *   - tableBlock.ts calls getTableVersion() before parsing.
 *   - If tableVersion > CURRENT → render an "upgrade plugin" error.
 *   - If tableVersion < CURRENT → call migrateSource() then write back.
 */

export const CURRENT_TABLE_VERSION = 1;

/** Extract the format version from a rich-table source string.
 *  Returns 1 if the version field is absent (all pre-versioning tables). */
export function getTableVersion(source: string): number {
	const lines = source.split('\n');
	if (lines[0]?.trim() !== '---') return 1; // no YAML front-matter
	for (let i = 1; i < lines.length; i++) {
		if (lines[i]?.trim() === '---') break;   // end of front-matter
		const m = /^version:\s*(\d+)/.exec(lines[i] ?? '');
		if (m) return parseInt(m[1] ?? '1');
	}
	return 1;
}

/** A migration function receives the raw block source at version N and returns
 *  the transformed source at version N+1 (including `version: <N+1>` in YAML). */
type MigrationFn = (source: string) => string;

/**
 * Migration chain indexed by FROM-version (0-based):
 *   migrations[0]  v1 → v2
 *   migrations[1]  v2 → v3
 *   …
 *
 * Add a new entry here whenever CURRENT_TABLE_VERSION is incremented.
 * Each function must be self-contained and idempotent for its version pair.
 */
const migrations: MigrationFn[] = [
	// v1 → v2  (placeholder — fill in when a breaking syntax change ships)
	// (source) => transformV1toV2(source),
];

/** Apply all available migrations from fromVersion up to CURRENT_TABLE_VERSION.
 *  Returns the (possibly unchanged) source string. */
export function migrateSource(source: string, fromVersion: number): string {
	let result = source;
	for (let v = fromVersion; v < CURRENT_TABLE_VERSION; v++) {
		const fn = migrations[v - 1];
		if (fn) result = fn(result);
	}
	return result;
}
