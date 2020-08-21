import {
	calculateMaxAveragesForDistances as maxAveragesForDistances,
	interpolateNullValues,
	Result,
} from 'library/activity-data/best-split-calculator';
import { movingAverageObj } from 'library/utils/array-utils';
import { getWasmLibIfLoaded } from 'wasm/wasm-loader';
import { ActivityContainer, ActivityPoint } from './activity-container';

export type Variable = 'power' | 'time';

const getVar = (p: ActivityPoint, v: Variable) => {
	switch (v) {
		case 'power':
			return p.power ?? null;
		case 'time':
			return p.secondsSinceStart;
		default:
			return null;
	}
};

export function getAsTimeSeries(data: ActivityContainer) {
	return data.filledPoints.map((p) => ({ x: p.index, y: p.data?.power ?? null }));
}

export type TimeSeriesProcessingOptions = {
	interpolateNull: boolean;
	maxGapForInterpolation?: number;
	resolution: number;
};

export function getProcessedTimeSeries(data: ActivityContainer) {
	return getAsTimeSeries(data);
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

export function getSmoothedTimeSeries(data: ActivityContainer, movingAverageRadius?: number) {
	return calculateSmoothedTimeSeries(getAsTimeSeries(data), movingAverageRadius);
}

function getInterpolatedDataPointsForBestSplits(
	data: ActivityContainer,
	maxGapForInterpolation: number
) {
	const dataPoints = data.filledPoints.map((p) =>
		p.data !== undefined ? getVar(p.data, 'power') ?? null : null
	);

	return interpolateNullValues(dataPoints, maxGapForInterpolation);
}

export const getBestSplitsVsTime = (
	data: ActivityContainer,
	timeRanges: number[],
	maxGapForInterpolation: number
): Result[] => {
	const interpolatedData = getInterpolatedDataPointsForBestSplits(data, maxGapForInterpolation);

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
