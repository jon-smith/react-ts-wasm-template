import {
	calculateMaxAveragesForDistances as maxAveragesForDistances,
	calculateMinTimesForDistances,
	interpolateNullValues,
	Result,
} from 'library/activity-data/best-split-calculator';
import { movingAverageObj } from 'library/utils/array-utils';
import { getWasmLibIfLoaded } from 'wasm/wasm-loader';
import { ActivityContainer, ActivityPoint } from './activity-container';

export type Variable = 'heartrate' | 'power' | 'cadence' | 'elevation' | 'time';

const getVar = (p: ActivityPoint, v: Variable) => {
	switch (v) {
		case 'heartrate':
			return p.heartRate ?? null;
		case 'power':
			return p.power ?? null;
		case 'cadence':
			return p.cadence ?? null;
		case 'elevation':
			return p.elevation ?? null;
		case 'time':
			return p.secondsSinceStart;
		default:
			return null;
	}
};

export function getAsTimeSeries(data: ActivityContainer, y: Variable, filledPoints = false) {
	if (filledPoints) {
		return data.filledPoints.map((p) => ({ x: p.index, y: p.data ? getVar(p.data, y) : null }));
	}
	return data.flatPoints.map((p) => ({ x: p.secondsSinceStart, y: getVar(p, y) }));
}

export function extractData(data: ActivityContainer, v: Variable, filledPoints = false) {
	if (filledPoints) {
		return data.filledPoints.map((p) => (p.data ? getVar(p.data, v) : null));
	}
	return data.flatPoints.map((p) => getVar(p, v));
}

function getDefaultInterpolateMaxGap(v: Variable) {
	switch (v) {
		case 'cadence':
			return 10;
		case 'heartrate':
			return 10;
		default:
			return 0;
	}
}

export type TimeSeriesProcessingOptions = {
	interpolateNull: boolean;
	maxGapForInterpolation?: number;
	resolution: number;
};

export function getProcessedTimeSeries(
	data: ActivityContainer,
	variable: Variable,
	options: TimeSeriesProcessingOptions
) {
	const rawTimeSeries = getAsTimeSeries(data, variable, true);
	const rawValues = rawTimeSeries.map((v) => v.y);
	const interpolatedValues = options.interpolateNull
		? interpolateNullValues(
				rawValues,
				options.maxGapForInterpolation ?? getDefaultInterpolateMaxGap(variable)
		  )
		: rawValues;

	const interpolatedTimeSeries = interpolatedValues.map((v, i) => ({
		x: rawTimeSeries[i].x,
		y: v,
	}));
	if (options.resolution <= 1) {
		return interpolatedTimeSeries;
	}

	type ResultT = typeof interpolatedTimeSeries;

	const result: ResultT = [];

	for (let i = 0; i < interpolatedTimeSeries.length; i += options.resolution) {
		let sum = null as null | number;
		const count = Math.min(options.resolution, interpolatedTimeSeries.length - i);
		for (let j = 0; j < count; ++j) {
			const value = interpolatedTimeSeries[i + j].y;
			if (value != null) {
				sum = value + (sum ?? 0);
			}
		}
		const average = sum === null ? null : sum / count;
		result.push({ x: interpolatedTimeSeries[i].x, y: average });
	}

	return result;
}

function calculateSmoothedTimeSeries(
	timeSeries: { x: number; y: number | null }[],
	movingAverageRadius?: number
) {
	return movingAverageObj(
		timeSeries.map((t) => ({ x: t.x, y: t.y ?? 0 })),
		'y',
		movingAverageRadius
	);
}

export function getProcessedAndSmoothedTimeSeries(
	data: ActivityContainer,
	variable: Variable,
	processingOptions: TimeSeriesProcessingOptions,
	smoothingOptions: { movingAverageRadius?: number }
) {
	const processed = getProcessedTimeSeries(data, variable, processingOptions);

	const smoothed = calculateSmoothedTimeSeries(processed, smoothingOptions.movingAverageRadius);

	return { processed, smoothed };
}

type BestSplitOption = 'heartrate' | 'power' | 'cadence' | 'time' | 'speed';

export function asRawVariable(o: BestSplitOption): Variable | null {
	switch (o) {
		case 'heartrate':
			return 'heartrate';
		case 'power':
			return 'power';
		case 'cadence':
			return 'cadence';
		case 'time':
			return 'time';
		default:
			return null;
	}
}

function getInterpolatedDataPointsForBestSplits(
	data: ActivityContainer,
	option: BestSplitOption,
	maxGapForInterpolation: number
) {
	const rawVariable = asRawVariable(option);

	if (rawVariable) {
		const dataPoints = data.filledPoints.map((p) =>
			p.data !== undefined ? getVar(p.data, rawVariable) ?? null : null
		);

		return interpolateNullValues(dataPoints, maxGapForInterpolation);
	}
	if (option === 'speed') {
		// For speed, we first interpolate cumulative distance and then calc speed from that
		const distances = data.filledPoints.map((p) => p.data?.cumulativeDistance ?? null);
		const interpolatedDistances = interpolateNullValues(distances, maxGapForInterpolation);

		// Set all speeds to zero
		const speeds = interpolatedDistances.map((_) => 0);

		let previousDistance = interpolatedDistances[0] ?? 0;
		for (let i = 1; i < interpolatedDistances.length; ++i) {
			const distance = interpolatedDistances[i];
			if (distance != null) {
				const delta = distance - previousDistance;
				if (delta > 0) {
					// Each index is a unit of time, so no need to divide by t
					speeds[i] = delta;
				}
				previousDistance = distance;
			}
		}

		return speeds;
	}

	return [];
}

export const getBestSplitsVsTime = (
	data: ActivityContainer,
	option: BestSplitOption,
	timeRanges: number[],
	maxGapForInterpolation: number
): Result[] => {
	const interpolatedData = getInterpolatedDataPointsForBestSplits(
		data,
		option,
		maxGapForInterpolation
	);

	const maxTime = interpolatedData.length;
	const timeRangesToUse = timeRanges.filter((t) => t <= maxTime);
	if (timeRangesToUse.length === 0) return [];

	const wasmLib = getWasmLibIfLoaded();
	if (wasmLib) {
		return wasmLib.best_averages_for_distances(
			(interpolatedData as unknown) as Float64Array,
			(timeRangesToUse as unknown) as Uint32Array
		);
	}

	return maxAveragesForDistances(interpolatedData, timeRangesToUse);
};

export function getMinTimesPerDistance(data: ActivityContainer, distances: number[]) {
	return calculateMinTimesForDistances(
		data.flatPoints.map((d) => ({
			time: d.secondsSinceStart,
			cumulativeDistance: d.cumulativeDistance,
		})),
		distances
	);
}
