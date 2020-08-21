import { createSelector } from '@reduxjs/toolkit';
import { Interval } from 'library/activity-data/interval';
import { IntervalDetectionState } from './slice';

export const intervalsWithIntensity = createSelector(
	(s: IntervalDetectionState) => s.detectionResults,
	(s: IntervalDetectionState) => s.ftp,
	(results, ftp): Interval[] =>
		results.results.intervals.map((i) => ({
			durationSeconds: i.durationSeconds,
			intensityPercent: i.power / ftp,
		}))
);
