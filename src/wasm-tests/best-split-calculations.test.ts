import { JolteonLibT, loadWasmLib } from 'wasm/jolteon-loader';

import { calculateMaxAveragesForDistances } from 'library/activity-data/best-split-calculator';

describe('best-split-tests', () => {
	let wasm: JolteonLibT;

	beforeAll(async () => {
		wasm = (await loadWasmLib())!;
		if (!wasm) fail();
	});

	test('vs native simple', () => {
		const input = [1, 1, 5, 5, 1, 1, 5, 5];
		const distances = [1, 2, 3, 4, 5, 6];

		const result = calculateMaxAveragesForDistances(input, distances);
		const nativeResult = wasm.best_averages_for_distances(
			new Float64Array(input),
			new Uint32Array(distances)
		);

		expect(result).toEqual(nativeResult);
	});

	test('vs native null input', () => {
		const input = [1, 1, 5, null, 1, 1, null, 5];
		const distances = [1, 2, 3, 4, 5, 6];

		const result = calculateMaxAveragesForDistances(input, distances);
		const nativeResult = wasm.best_averages_for_distances(
			(input as unknown) as Float64Array,
			new Uint32Array(distances)
		);

		expect(result).toEqual(nativeResult);
	});

	test('vs native null result', () => {
		const input = [1, 1, 5, 5, 1, 1, 5, 5];
		const distances = [1, 5, 10];

		const result = calculateMaxAveragesForDistances(input, distances);
		const nativeResult = wasm.best_averages_for_distances(
			new Float64Array(input),
			new Uint32Array(distances)
		);

		expect(result).toEqual(nativeResult);
	});
});
