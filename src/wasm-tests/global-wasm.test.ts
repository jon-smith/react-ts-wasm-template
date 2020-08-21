import { getGlobalWasmState, getWasmLibIfLoaded, enableWasm } from 'wasm/jolteon-loader';

describe('wasm global test', () => {
	beforeAll(async () => {
		await getGlobalWasmState().promise;
	});

	test('wasm loaded', () => {
		// Should be enabled by default
		const state = getGlobalWasmState();
		expect(state.isEnabled).toBeTruthy();
		const wasmLib = getWasmLibIfLoaded();
		expect(wasmLib).toBeTruthy();
	});

	test('disable/enable wasm', () => {
		enableWasm(false);
		{
			const wasmLib = getWasmLibIfLoaded();
			expect(wasmLib).toBeUndefined();
			const state = getGlobalWasmState();
			expect(state.isEnabled).toBeFalsy();
		}

		enableWasm(true);
		{
			const wasmLib = getWasmLibIfLoaded();
			expect(wasmLib).toBeTruthy();
			const state = getGlobalWasmState();
			expect(state.isEnabled).toBeTruthy();
		}
	});
});
