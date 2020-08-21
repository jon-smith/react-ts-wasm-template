import path from 'path';
import { makeDeferred } from 'library/utils/deferred';

export type JolteonLibT = typeof import('jolteon-wasm');

async function loadUnsafe(): Promise<JolteonLibT> {
	const isTest = process.env.JEST_WORKER_ID !== undefined || typeof jest !== 'undefined';

	// If running test in jest we have to load the node version of the package
	if (isTest) return await import(path.resolve(__dirname, '../../rust-wasm/pkg-node', 'jolteon'));
	return await import('jolteon-wasm');
}

// Allows the jolteon library to be loaded and awaited
export async function loadWasmLib() {
	let wasm: JolteonLibT | undefined;

	try {
		wasm = await loadUnsafe();

		console.log('successfully loaded jolteon/wasm');

		wasm?.init();
	} catch {
		console.log('failed to load jolteon/wasm');
	}

	return wasm;
}

const globalDeferredLoad = makeDeferred();

const globalState = {
	isEnabled: true,
	isLoading: false,
	failedToLoad: false,
	promise: globalDeferredLoad.promise,
};

export function enableWasm(enable: boolean) {
	globalState.isEnabled = enable;
}

export function getGlobalWasmState() {
	return { ...globalState };
}

function loadAsyncHelper() {
	let wasm: JolteonLibT | undefined;

	async function loadWasm() {
		globalState.isLoading = true;

		wasm = await loadWasmLib();

		globalDeferredLoad.resolve();

		globalState.failedToLoad = wasm === undefined;
		globalState.isLoading = false;
	}

	loadWasm();

	return () => (globalState.isEnabled ? wasm : undefined);
}

// A function that will return the jolteon lib if loaded globally or return undefined if not
export const getWasmLibIfLoaded = loadAsyncHelper();
