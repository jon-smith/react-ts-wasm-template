import path from 'path';
import { makeDeferred } from 'library/utils/deferred';

export type WasmLibT = typeof import('rust-wasm-lib');

async function loadUnsafe(): Promise<WasmLibT> {
	const isTest = process.env.JEST_WORKER_ID !== undefined || typeof jest !== 'undefined';

	// If running test in jest we have to load the node version of the package
	if (isTest)
		return await import(path.resolve(__dirname, '../../rust-wasm/pkg-node', 'rust_wasm_lib'));
	return await import('rust-wasm-lib');
}

// Allows the wasm library to be loaded and awaited
export async function loadWasmLib() {
	let wasm: WasmLibT | undefined;

	try {
		wasm = await loadUnsafe();

		console.log('successfully loaded rust-wasm-lib');

		wasm?.init();
	} catch {
		console.log('failed to load rust-wasm-lib');
	}

	return wasm;
}

const globalDeferredLoad = makeDeferred();

const globalState = {
	isLoading: false,
	failedToLoad: false,
	promise: globalDeferredLoad.promise,
};

export function getGlobalWasmState() {
	return { ...globalState };
}

function loadAsyncHelper() {
	let wasm: WasmLibT | undefined;

	async function loadWasm() {
		globalState.isLoading = true;

		wasm = await loadWasmLib();

		globalDeferredLoad.resolve();

		globalState.failedToLoad = wasm === undefined;
		globalState.isLoading = false;
	}

	loadWasm();

	return () => wasm;
}

// A function that will return the wasm lib if loaded globally or return undefined if not
export const getWasmLibIfLoaded = loadAsyncHelper();
