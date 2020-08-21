const defaultSecondTicks = [5, 30];

const defaultMinuteTicks = [1, 2, 5, 10, 20, 30, 45];

const defaultHourTicks = [1, 2, 5];

export const defaultTimeTicksForBestSplits = [
	...defaultSecondTicks,
	...defaultMinuteTicks.map((t) => t * 60),
	...defaultHourTicks.map((t) => t * 60 * 60),
];

const defaultSecondTimeIntervals = [1, 5, 10, 30];

export const timeIntervalsForBestSplits = [
	...defaultSecondTimeIntervals,
	...defaultMinuteTicks.map((t) => t * 60),
	...defaultHourTicks.map((t) => t * 60 * 60),
];

export const distancesForBestSplits = [100, 200, 400, 800, 1000, 1600, 5000, 10000];

export const defaultDistanceTicksForBestSplits = distancesForBestSplits;
