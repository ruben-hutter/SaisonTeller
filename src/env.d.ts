/*
 * Minimal ambient declarations for the few Node APIs used by vitest files.
 * The repo intentionally ships without @types/node; these shims exist only so
 * `svelte-check` (which type-checks test files too) resolves them. The real
 * implementations come from Node itself at test runtime.
 */

declare module 'node:fs' {
	export function existsSync(path: string): boolean;
}

declare module 'node:path' {
	export function join(...pathSegments: string[]): string;
}

declare const process: {
	cwd(): string;
};
