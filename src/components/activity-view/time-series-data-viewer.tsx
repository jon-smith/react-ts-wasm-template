import React, { useMemo } from 'react';
import lodash from 'lodash';

import useThrottledState from 'generic-components/hooks/use-throttled-state';
import XYPlot, { DataSeriesT } from 'generic-components/charts/xy-plot';

import { getProcessedAndSmoothedTimeSeries } from 'library/activity-data/activity-calculator';
import { ActivityContainer } from 'library/activity-data/activity-container';
import { buildNiceTimeTicksToDisplay } from 'library/utils/chart-utils';
import { formatSecondsAsHHMMSS } from 'library/utils/time-format-utils';

import { useActivitySelector } from 'store/reducers';
import { getSelectedActivity } from 'store/activity-data/selectors';

import TimeSeriesSelection from './time-series-selection';

function buildTimeSeries(
	d: ActivityContainer | undefined,
	movingAverageRadius: number,
	name: string
): DataSeriesT {
	const timeSeries = d
		? getProcessedAndSmoothedTimeSeries(
				d,
				'power',
				{
					interpolateNull: true,
					maxGapForInterpolation: undefined,
					resolution: 1,
				},
				{ movingAverageRadius }
		  )
		: undefined;

	return {
		name,
		data: timeSeries?.smoothed ?? [],
		seriesType: 'line',
		color: '#966fd6',
	};
}

const TimeSeriesDataViewer = () => {
	const [movingAverage, throttledMovingAverage, setMovingAverage] = useThrottledState(0, 1);

	const selectedActivity = useActivitySelector((s) => getSelectedActivity(s));

	const timeSeries = useMemo(
		() => [buildTimeSeries(selectedActivity, throttledMovingAverage, 'time-series')],
		[selectedActivity, throttledMovingAverage]
	);

	const timeTicks = useMemo(() => {
		const maxTimeSeconds = lodash.max(timeSeries.flatMap((s) => s.data.map((d) => d.x))) ?? 0;
		return buildNiceTimeTicksToDisplay(maxTimeSeconds, 6);
	}, [timeSeries]);

	return (
		<>
			<TimeSeriesSelection movingAverage={movingAverage} onChangeMovingAverage={setMovingAverage} />
			<XYPlot
				className="test-data-chart"
				series={timeSeries}
				xTickFormat={formatSecondsAsHHMMSS}
				xTickValues={timeTicks}
				xAxisLabel="Time"
				yAxisLabel={'Power (W)'}
			/>
		</>
	);
};

export default TimeSeriesDataViewer;
