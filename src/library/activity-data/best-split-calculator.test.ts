import {
	calculateMaxAveragesForDistances,
	calculateMinTimesForDistances,
	interpolateNullValues,
	fillMissingIndices,
} from './best-split-calculator';

test('fillMissingIndices', () => {
	const data = [
		{ a: 1, index: 1 },
		{ a: 2, index: 3 },
		{ a: 3, index: 4 },
	];

	const filled = fillMissingIndices(data);
	expect(filled.length).toBe(4);
	expect(filled[0]).toEqual({ data: data[0], index: 1 });
	expect(filled[1]).toEqual({ data: undefined, index: 2 });
	expect(filled[2]).toEqual({ data: data[1], index: 3 });
	expect(filled[3]).toEqual({ data: data[2], index: 4 });
});

describe('interpolateNullValues', () => {
	test('no interpolation needed', () => {
		const noNull = [1, 2, 3, 4];
		const interpolated = interpolateNullValues(noNull, 0);
		expect(interpolated).toEqual(noNull);
	});

	test('interpolation needed but gap too large', () => {
		const withNull = [1, null, 3, 4];
		const interpolated = interpolateNullValues(withNull, 0);
		expect(interpolated).toEqual(withNull);
	});

	test('interpolation needed but valid gap', () => {
		const withNull = [1, null, 3, 4];
		const interpolated = interpolateNullValues(withNull, 2);
		expect(interpolated).toEqual([1, 2, 3, 4]);
	});

	test('multi interpolation needed but valid gap', () => {
		const withNull = [1, null, null, 4];
		const interpolated = interpolateNullValues(withNull, 3);
		expect(interpolated).toEqual([1, 2, 3, 4]);
	});
});

describe('maxAveragesForDistances', () => {
	test('all equal input', () => {
		const input = [1, 1, 1, 1, 1, 1];
		const distances = [1, 2, 3, 4, 5];

		const result = calculateMaxAveragesForDistances(input, distances);

		expect(result.length).toEqual(distances.length);
		for (let i = 0; i < distances.length; ++i) {
			expect(result[i].distance).toEqual(distances[i]);
			expect(result[i].best).toBeTruthy();
			expect(result[i].best?.startIndex).toEqual(0);
			expect(result[i].best?.average).toEqual(1);
		}
	});

	test('invalid distance', () => {
		const input = [1, 1, 1, 1, 1, 1];
		// 10 and 15 shouldn't have data at the input range isn't that high
		const distances = [5, 10, 15];

		const result = calculateMaxAveragesForDistances(input, distances);

		expect(result.length).toEqual(distances.length);

		expect(result[0].best).toEqual({ average: 1, startIndex: 0 });
		expect(result[0].distance).toEqual(5);

		expect(result[1].best).toBeNull();
		expect(result[1].distance).toEqual(10);

		expect(result[2].best).toBeNull();
		expect(result[2].distance).toEqual(15);
	});

	test('simple interval', () => {
		const input = [1, 1, 5, 5, 1, 1, 5, 5];
		const distances = [1, 2, 3, 4, 5, 6];

		const result = calculateMaxAveragesForDistances(input, distances);
		expect(result.length).toEqual(distances.length);

		expect(result[0].best?.average).toEqual(5);
		expect(result[0].best?.startIndex).toEqual(2);

		expect(result[1].best?.average).toEqual(5);
		expect(result[1].best?.startIndex).toEqual(2);

		expect(result[2].best?.average).toEqual(11 / 3);
		expect(result[2].best?.startIndex).toEqual(1);

		expect(result[3].best?.average).toEqual(3);
		expect(result[3].best?.startIndex).toEqual(0);

		expect(result[4].best?.average).toEqual(17 / 5);
		expect(result[4].best?.startIndex).toEqual(2);

		expect(result[5].best?.average).toEqual(22 / 6);
		expect(result[5].best?.startIndex).toEqual(2);
	});
});

describe('minTimesForDistances', () => {
	const convertInput = (input: number[]) =>
		input.map((d, i) => ({ time: i, cumulativeDistance: d }));

	test('constant speed', () => {
		const cumulativeDist = [1, 2, 3, 4, 5, 6];
		const distances = [1, 2, 3, 4, 5];

		const result = calculateMinTimesForDistances(convertInput(cumulativeDist), distances);

		expect(result.length).toEqual(distances.length);
		for (let i = 0; i < distances.length; ++i) {
			expect(result[i].distance).toEqual(distances[i]);
			expect(result[i].best).toBeTruthy();
			expect(result[i].best?.startTime).toEqual(0);
			expect(result[i].best?.time).toEqual(i + 1);
		}
	});

	test('invalid distance', () => {
		const cumulativeDist = [1, 2, 3, 4, 5, 6];
		// 10 and 15 shouldn't have data at the input range isn't that high
		const distances = [5, 10, 15];

		const result = calculateMinTimesForDistances(convertInput(cumulativeDist), distances);

		expect(result.length).toEqual(distances.length);

		expect(result[0].best).toEqual({ time: 5, startTime: 0 });
		expect(result[0].distance).toEqual(5);

		expect(result[1].best).toBeNull();
		expect(result[1].distance).toEqual(10);

		expect(result[2].best).toBeNull();
		expect(result[2].distance).toEqual(15);
	});

	test('vary pace', () => {
		const cumulativeDist = [1, 2, 3, 5, 7, 8, 8, 8];
		const distances = [1, 2, 3, 4, 5, 6];

		const result = calculateMinTimesForDistances(convertInput(cumulativeDist), distances);
		expect(result.length).toEqual(distances.length);

		// 1 to 2
		expect(result[0].best?.time).toEqual(1);
		expect(result[0].best?.startTime).toEqual(0);

		// 3 to 5
		expect(result[1].best?.time).toEqual(1);
		expect(result[1].best?.startTime).toEqual(2);

		// 2 to 5
		expect(result[2].best?.time).toEqual(2);
		expect(result[2].best?.startTime).toEqual(1);

		// 3 to 7
		expect(result[3].best?.time).toEqual(2);
		expect(result[3].best?.startTime).toEqual(2);

		// 2 to 7
		expect(result[4].best?.time).toEqual(3);
		expect(result[4].best?.startTime).toEqual(1);

		// 1 to 7
		expect(result[5].best?.time).toEqual(4);
		expect(result[5].best?.startTime).toEqual(0);
	});
});
