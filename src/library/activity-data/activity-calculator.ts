import { movingAverageObj } from 'library/utils/array-utils';
import { ActivityContainer } from './activity-container';

export function getAsTimeSeries(data: ActivityContainer) {
	return data.flatPoints.map((p) => ({ x: p.secondsSinceStart, y: p?.power ?? null }));
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
