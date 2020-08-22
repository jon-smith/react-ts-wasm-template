import React, { useMemo, useEffect } from 'react';
import lodash from 'lodash';

import XYPlot, { DataSeriesT, DataPoint } from 'generic-components/charts/xy-plot';

import { buildNiceTimeTicksToDisplay } from 'library/utils/chart-utils';
import { formatSecondsAsHHMMSS } from 'library/utils/time-format-utils';

import { useDataProcessorSelector } from 'store/reducers';
import { useDispatchCallback, useAppDispatch } from 'store/dispatch-hooks';
import { smoothData, dataSmoothingRequired, setSmoothingRadius } from 'store/data-processor/slice';

import TimeSeriesControlBar from './time-series-control-bar';

function buildTimeSeries(timeSeries: DataPoint[]): DataSeriesT {
	return {
		name: 'time-series',
		data: timeSeries,
		seriesType: 'line',
		color: '#966fd6',
	};
}

const ActivityDataViewer = () => {
	const { movingAverage, dataSeries, generateRequired, isGenerating } = useDataProcessorSelector(
		(s) => ({
			movingAverage: s.smoothingRadius,
			dataSeries: s.processedData.series,
			generateRequired: dataSmoothingRequired(s),
			isGenerating: s.isGenerating,
		})
	);

	const timeSeries = useMemo(() => [buildTimeSeries(dataSeries)], [dataSeries]);

	const dispatch = useAppDispatch();

	const setMovingAverage = useDispatchCallback(setSmoothingRadius);

	useEffect(() => {
		// Only start generating new intervals when the previous interval generation has completed
		// This ensures only 1 worker is running at once
		if (generateRequired && !isGenerating) {
			dispatch(smoothData(movingAverage));
		}
	}, [movingAverage, generateRequired, isGenerating, dispatch]);

	const timeTicks = useMemo(() => {
		const maxTimeSeconds = lodash.max(dataSeries.map((d) => d.x)) ?? 0;
		return buildNiceTimeTicksToDisplay(maxTimeSeconds, 6);
	}, [dataSeries]);

	return (
		<div className="activity-data-viewer">
			<TimeSeriesControlBar
				movingAverage={movingAverage}
				onChangeMovingAverage={setMovingAverage}
			/>
			<XYPlot
				className="test-data-chart"
				series={timeSeries}
				xTickFormat={formatSecondsAsHHMMSS}
				xTickValues={timeTicks}
				xAxisLabel="Time"
				yAxisLabel={'Power (W)'}
			/>
		</div>
	);
};

export default ActivityDataViewer;
