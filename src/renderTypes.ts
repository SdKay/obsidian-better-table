import type { StructuralOpV2 } from './operations';

// Shared adapter types used across the split renderer modules (renderer.ts,
// renderCell.ts, renderCellStyle.ts, renderPanel.ts, renderResize.ts, ...).
export type OpHandler         = (op: StructuralOpV2) => Promise<void>;
export type ToggleLockHandler = () => Promise<void>;

// Internal adapter types — same call-shape as v1 handlers, wired through OpHandler
export type CellChangeHandler    = (rowIdx: number, colIdx: number, value: string) => void;
export type ColTypeChangeHandler = (colIdx: number, colType: string | undefined) => void;
export type StructuralOpHandler  = (op: StructuralOpV2) => void;

/** Special column types handled with dedicated editors (not choice dropdowns). */
export const SPECIAL_TYPES = new Set(['date']);
