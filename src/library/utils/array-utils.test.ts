import * as ArrayUtils from './array-utils';

describe('peakAndTrough', () => {
	test('flat', () => {
		const input = [1, 1, 1, 1, 1];
		const result = ArrayUtils.findPeaksAndTroughs(input);
		expect(result).toEqual([null, null, null, null, null]);
	});

	test('startHigh', () => {
		const input = [5, 5, 4, 3, 2, 3];
		const result = ArrayUtils.findPeaksAndTroughs(input);
		expect(result).toEqual(['peak', null, null, null, 'trough', null]);
	});

	test('startLow', () => {
		const input = [2, 2, 3, 4, 3, 4];
		const result = ArrayUtils.findPeaksAndTroughs(input);
		expect(result).toEqual(['trough', null, null, 'peak', 'trough', null]);
	});

	test('stepIncreases', () => {
		const input = [1, 1, 2, 2, 3, 3, 2, 1];
		const result = ArrayUtils.findPeaksAndTroughs(input);
		expect(result).toEqual(['trough', null, null, null, null, 'peak', null, null]);
	});
});

describe('movingAverage', () => {
	const input12345 = [1, 2, 3, 4, 5];

	test('no change', () => {
		const result = ArrayUtils.movingAverage(input12345, 0);
		expect(result).toEqual(input12345);
	});

	const expectedResult12345Smooth1 = [
		(1 + 2) / 2,
		(1 + 2 + 3) / 3,
		(2 + 3 + 4) / 3,
		(3 + 4 + 5) / 3,
		(4 + 5) / 2,
	];

	test('radius 1', () => {
		const result = ArrayUtils.movingAverage(input12345, 1);
		expect(result).toEqual(expectedResult12345Smooth1);
	});

	test('radius 1 obj', () => {
		const toObj = (i: number) => ({ value: i });
		const inputObj = input12345.map(toObj);
		const expectedResultObj = expectedResult12345Smooth1.map(toObj);

		const result = ArrayUtils.movingAverageObj(inputObj, 'value', 1);
		expect(result).toEqual(expectedResultObj);
	});
});
