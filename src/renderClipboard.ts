import { Notice } from 'obsidian';
import type { TableModelV2 } from './model';
import { t } from './i18n';
import { formatRow, displayLen } from './serializer';
import { cellRawValue } from './renderCellStyle';

export function buildRangeGrid(model: TableModelV2, r1: number, r2: number, c1: number, c2: number): string[][] {
	const grid: string[][] = [];
	for (let r = r1; r <= r2; r++) {
		const row: string[] = [];
		for (let c = c1; c <= c2; c++) row.push(cellRawValue(model, r, c));
		grid.push(row);
	}
	return grid;
}

/**
 * Copies a rectangular range to the system clipboard as both plain-text TSV and an
 * HTML <table> — spreadsheet apps (Excel, Sheets) read the HTML table on paste and
 * reconstruct the grid; anything else falls back to the tab/newline-delimited text.
 */
export function copyRangeToClipboard(model: TableModelV2, r1: number, r2: number, c1: number, c2: number): void {
	const grid = buildRangeGrid(model, r1, r2, c1, c2);
	const tsv  = grid.map(row => row.map(v => v.replace(/\t/g, ' ').replace(/\r?\n/g, ' ')).join('\t')).join('\n');
	const esc  = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	const html = `<table>${grid.map(row => `<tr>${row.map(v => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</table>`;

	void activeWindow.navigator.clipboard.write([
		new ClipboardItem({
			'text/plain': new Blob([tsv], { type: 'text/plain' }),
			'text/html':  new Blob([html], { type: 'text/html' }),
		}),
	]).catch(() => new Notice(t('copyFailed')));
}

/**
 * Copies a rectangular range to the clipboard as a standard GFM pipe table (the
 * topmost selected row becomes the header row) — pastes as literal Markdown source,
 * e.g. into a note or a chat box. Cell pipes are escaped and newlines become <br>
 * so the table stays valid on a single physical line per row.
 */
export function copyRangeAsMarkdown(model: TableModelV2, r1: number, r2: number, c1: number, c2: number): void {
	const grid = buildRangeGrid(model, r1, r2, c1, c2).map(row =>
		row.map(v => v.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>')));
	const header = grid[0];
	if (!header) return;
	const widths = header.map((_, ci) => Math.max(3, ...grid.map(row => displayLen(row[ci] ?? ''))));

	const lines = [
		formatRow(header, widths),
		'| ' + widths.map(w => '-'.repeat(w)).join(' | ') + ' |',
		...grid.slice(1).map(row => formatRow(row, widths)),
	];

	void activeWindow.navigator.clipboard.writeText(lines.join('\n'))
		.catch(() => new Notice(t('copyFailed')));
}
