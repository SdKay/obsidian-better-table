import type { App } from 'obsidian';
import { WikilinkInputSuggest } from './wikilinkInputSuggest';
import type { CellChangeHandler } from './renderTypes';

export function enterDateEditMode(
	el: HTMLElement,
	currentValue: string,
	rowIdx: number,
	colIdx: number,
	onCellChange: CellChangeHandler,
): void {
	const savedNodes = Array.from(el.childNodes).map(n => n.cloneNode(true));
	el.empty();
	el.addClass('bt-editing');

	const input = el.createEl('input', {
		cls: 'bt-date-input',
		attr: { type: 'date', value: currentValue },
	});

	let committed = false;

	const save = () => {
		if (committed) return;
		committed = true;
		el.removeClass('bt-editing');
		if (input.value !== currentValue) {
			void onCellChange(rowIdx, colIdx, input.value);
		} else {
			el.empty();
			for (const node of savedNodes) el.appendChild(node);
		}
	};

	const cancel = () => {
		if (committed) return;
		committed = true;
		input.removeEventListener('blur', save);
		el.removeClass('bt-editing');
		el.empty();
		for (const node of savedNodes) el.appendChild(node);
	};

	input.addEventListener('blur', save);
	input.addEventListener('keydown', (evt: KeyboardEvent) => {
		if (evt.key === 'Enter') { evt.preventDefault(); input.blur(); }
		if (evt.key === 'Escape') { evt.preventDefault(); cancel(); }
	});

	input.focus();
}

/**
 * Inline editor for title (single-line) and footer (multi-line).
 * Single-line: Enter = save, Escape = cancel.
 * Multi-line:  Enter = newline, Shift+Enter = save, Escape = cancel.
 */
export function enterLineEdit(
	el: HTMLElement,
	currentText: string,
	onSave: (newText: string) => void,
	multiLine = false,
): void {
	const savedNodes = Array.from(el.childNodes).map(n => n.cloneNode(true));
	el.empty();
	el.addClass('bt-editing');

	let committed = false;

	if (multiLine) {
		const textarea = el.createEl('textarea', { cls: 'bt-inline-editor bt-inline-editor-multi' });
		textarea.value = currentText;
		textarea.rows  = Math.max(2, currentText.split('\n').length);

		const save = () => {
			if (committed) return;
			committed = true;
			el.removeClass('bt-editing');
			const newVal = textarea.value.trim();
			if (newVal !== currentText) onSave(newVal);
			else { el.empty(); for (const n of savedNodes) el.appendChild(n); }
		};
		const cancel = () => {
			if (committed) return;
			committed = true;
			textarea.removeEventListener('blur', save);
			el.removeClass('bt-editing');
			el.empty();
			for (const n of savedNodes) el.appendChild(n);
		};

		textarea.addEventListener('blur', save);
		textarea.addEventListener('keydown', (evt: KeyboardEvent) => {
			if (evt.key === 'Escape') { evt.preventDefault(); cancel(); }
			if (evt.key === 'Enter' && evt.shiftKey) { evt.preventDefault(); textarea.blur(); }
		});
		textarea.focus();
		// Move cursor to end so Enter adds a line break rather than replacing all text
		textarea.setSelectionRange(textarea.value.length, textarea.value.length);
		return;
	}

	const editor = el.createDiv({
		cls: 'bt-inline-editor',
		attr: { contenteditable: 'true' },
	});
	editor.textContent = currentText;

	const save = () => {
		if (committed) return;
		committed = true;
		el.removeClass('bt-editing');
		const newVal = (editor.textContent ?? '').trim();
		if (newVal !== currentText) onSave(newVal);
		else { el.empty(); for (const n of savedNodes) el.appendChild(n); }
	};

	const cancel = () => {
		if (committed) return;
		committed = true;
		editor.removeEventListener('blur', save);
		el.removeClass('bt-editing');
		el.empty();
		for (const n of savedNodes) el.appendChild(n);
	};

	editor.addEventListener('blur', save);
	editor.addEventListener('keydown', (evt: KeyboardEvent) => {
		if (evt.key === 'Enter') { evt.preventDefault(); editor.blur(); }
		if (evt.key === 'Escape') { evt.preventDefault(); cancel(); }
	});

	editor.focus();
	if (activeDocument.contains(editor)) {
		const range = activeDocument.createRange();
		range.selectNodeContents(editor);
		activeWindow.getSelection()?.removeAllRanges();
		activeWindow.getSelection()?.addRange(range);
	}
}

/**
 * Replaces cell content with a contenteditable div wired to WikilinkInputSuggest
 * (AbstractInputSuggest subclass) for native Obsidian wikilink suggestions.
 * Save on blur/Enter, cancel on Escape; pre-edit nodes restored on cancel.
 */
export function enterEditMode(
	el: HTMLElement,
	rawValue: string,
	rowIdx: number,
	colIdx: number,
	app: App,
	sourcePath: string,
	onCellChange: CellChangeHandler,
	onPasteGrid?: (values: string[][]) => void,
): void {
	const savedNodes = Array.from(el.childNodes).map(n => n.cloneNode(true));

	const restoreNodes = () => {
		el.empty();
		for (const node of savedNodes) el.appendChild(node);
	};

	el.empty();
	el.addClass('bt-editing');

	// contenteditable div — accepted by AbstractInputSuggest natively
	const editor = el.createDiv({
		cls: 'bt-cell-editor',
		attr: { contenteditable: 'true' },
	});
	editor.textContent = rawValue;

	// WikilinkInputSuggest attaches to the div directly (no hacks needed)
	new WikilinkInputSuggest(app, editor, sourcePath);

	let committed = false;

	const save = () => {
		if (committed) return;
		committed = true;
		el.removeClass('bt-editing');
		const newValue = editor.textContent ?? '';
		if (newValue !== rawValue) {
			void onCellChange(rowIdx, colIdx, newValue);
		} else {
			restoreNodes();
		}
	};

	const cancel = () => {
		if (committed) return;
		committed = true;
		editor.removeEventListener('blur', save);
		el.removeClass('bt-editing');
		restoreNodes();
	};

	editor.addEventListener('blur', save);
	if (onPasteGrid) {
		// Only intercept clipboard content that actually came from a spreadsheet
		// (Excel/Sheets always emit an HTML <table> alongside the plain text) —
		// otherwise leave ordinary multi-line text paste as native single-cell text.
		editor.addEventListener('paste', (evt: ClipboardEvent) => {
			const html = evt.clipboardData?.getData('text/html') ?? '';
			if (!/<table[\s>]/i.test(html)) return;
			const text = evt.clipboardData?.getData('text/plain');
			if (!text) return;
			evt.preventDefault();
			cancel();
			const rows = text.split(/\r\n|\n|\r/);
			if (rows.length > 1 && rows[rows.length - 1] === '') rows.pop();
			onPasteGrid(rows.map(r => r.split('\t')));
		});
	}
	editor.addEventListener('keydown', (evt: KeyboardEvent) => {
		// Stop Ctrl/Meta combos from bubbling to Obsidian's CodeMirror handlers.
		// The browser handles Ctrl+V / Ctrl+Z / Ctrl+A natively for contenteditable,
		// so blocking propagation only prevents Obsidian shortcuts (e.g. Ctrl+Shift+V
		// "paste without formatting") from accidentally firing on the code block.
		if (evt.ctrlKey || evt.metaKey) evt.stopPropagation();

		if (evt.key === 'Enter' && !evt.shiftKey) {
			evt.preventDefault();
			editor.blur();
		} else if (evt.key === 'Escape') {
			evt.preventDefault();
			cancel();
		}
	});

	// Focus and select all existing text
	editor.focus();
	if (activeDocument.contains(editor)) {
		const range = activeDocument.createRange();
		range.selectNodeContents(editor);
		activeWindow.getSelection()?.removeAllRanges();
		activeWindow.getSelection()?.addRange(range);
	}
}
