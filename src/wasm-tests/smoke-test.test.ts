import { WasmLibT, loadWasmLib } from 'wasm/wasm-loader';

describe('wasm smoke test', () => {
	let wasm: WasmLibT;

	beforeAll(async () => {
		wasm = (await loadWasmLib())!;
		if (!wasm) fail();
	});

	test('functions exist', () => {
		expect(wasm.init).toBeTruthy();
		expect(typeof wasm.init).toBe('function');

		expect(wasm.greet).toBeTruthy();
		expect(typeof wasm.greet).toBe('function');

		expect(wasm.best_averages_for_distances).toBeTruthy();
		expect(typeof wasm.best_averages_for_distances).toBe('function');
	});
});
