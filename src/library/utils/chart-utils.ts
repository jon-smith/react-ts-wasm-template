import * as lodash from 'lodash';

const defaultSecondTicks = [1, 5, 10, 30];

const defaultMinuteTicks = [1, 2, 5, 10, 20, 30, 45];

const defaultHourTicks = [1, 2, 3, 4, 5];

const defaultTimeTicks = [
	...defaultSecondTicks,
	...defaultMinuteTicks.map((t) => t * 60),
	...defaultHourTicks.map((t) => t * 60 * 60),
];

export const findNiceTickInterval = (maxValue: number, maxTicks: number) => {
	const targetInterval = maxValue / maxTicks;
	const digits = Math.floor(Math.log10(targetInterval)) + 1;
	const powerOfTenAbove = 10 ** digits;
	const loop = [0.05, 0.1, 0.2, 0.5, 1];
	// eslint-disable-next-line no-restricted-syntax
	for (const l of loop) {
		const interval = l * powerOfTenAbove;
		if (interval * maxTicks >= maxValue) return parseFloat(interval.toPrecision(1));
	}
	return powerOfTenAbove;
};

export const findNiceTimeTickInterval = (maxValue: number, maxTicks: number) => {
	const targetInterval = maxValue / maxTicks;
	// eslint-disable-next-line no-restricted-syntax
	for (const t of defaultTimeTicks) {
		const nTicks = maxValue / t;
		if (nTicks <= maxTicks) return t;
	}
	return targetInterval;
};

export const buildNiceTimeTicksToDisplay = (maxSeconds: number, maxTicks: number) => {
	const interval = findNiceTimeTickInterval(maxSeconds, maxTicks);
	return lodash.range(0, maxSeconds, interval);
};
