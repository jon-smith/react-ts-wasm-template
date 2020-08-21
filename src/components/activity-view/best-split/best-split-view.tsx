import React, { useMemo } from 'react';

import Box from '@material-ui/core/Box';

import * as activityCalculator from 'library/activity-data/activity-calculator';
import { ActivityContainer } from 'library/activity-data/activity-container';
import { useActivitySelector } from 'store/reducers';
import { getSelectedActivity } from 'store/activity-data/selectors';
import BestSplitPlot from './best-split-plot';
import { timeIntervalsForBestSplits } from './best-split-x-values';

function buildPowerCurve(d: ActivityContainer) {
	const bestSplits = activityCalculator.getBestSplitsVsTime(d, timeIntervalsForBestSplits, 10);

	const bestSplitsDataPoints = bestSplits.map((r) => ({
		x: r.distance,
		y: r.best?.average ?? null,
	}));

	return {
		data: bestSplitsDataPoints,
		color: '#966fd6',
	};
}

function useBestSplitChartData() {
	const selectedActivity = useActivitySelector((s) => getSelectedActivity(s));
	return useMemo(() => {
		const selectedActivities = selectedActivity ? [selectedActivity] : [];
		return selectedActivities.map((a) => ({ ...buildPowerCurve(a), name: a.filename }));
	}, [selectedActivity]);
}

export default function BestSplitPlotComponent() {
	const data = useBestSplitChartData();

	return (
		<Box display="flex" flexDirection="row" flexWrap="wrap" width="100%">
			<BestSplitPlot series={data} />
		</Box>
	);
}
