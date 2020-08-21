import * as chartUtils from './chart-utils';

describe('findNiceTickInterval', () => {
	test('10 in 100', () => {
		expect(chartUtils.findNiceTickInterval(100, 10)).toEqual(10);
	});

	test('10 in 99', () => {
		expect(chartUtils.findNiceTickInterval(99, 10)).toEqual(10);
	});

	test('6 in 70', () => {
		expect(chartUtils.findNiceTickInterval(70, 6)).toEqual(20);
	});

	test('6 in 0.07', () => {
		expect(chartUtils.findNiceTickInterval(0.07, 6)).toEqual(0.02);
	});
});

describe('findNiceTimeTickInterval', () => {
	test('10 in 60 seconds', () => {
		expect(chartUtils.findNiceTimeTickInterval(60, 10)).toEqual(10);
	});

	test('6 in 5 minutes', () => {
		expect(chartUtils.findNiceTimeTickInterval(60 * 5, 6)).toEqual(60);
	});

	test('7 in 1h20m', () => {
		expect(chartUtils.findNiceTimeTickInterval(60 * 80, 6)).toEqual(60 * 20);
	});
});
