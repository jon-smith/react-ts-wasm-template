import React, { useMemo, useEffect } from 'react';
import lodash from 'lodash';

import XYPlot, { DataSeriesT, DataPoint } from 'generic-components/charts/xy-plot';

import { buildNiceTimeTicksToDisplay } from 'library/utils/chart-utils';
import { formatSecondsAsHHMMSS } from 'library/utils/time-format-utils';

import { useWebWorkerDemoSelector } from 'store/reducers';
import { useAppDispatch } from 'store/dispatch-hooks';
import { processData, dataProcessingRequired } from 'store/web-worker-demo/slice';

function buildTimeSeries(timeSeries: DataPoint[]): DataSeriesT {
	return {
		name: 'time-series',
		data: timeSeries,
		seriesType: 'line',
		color: '#966fd6',
	};
}

const ActivityDataViewer = () => {
	const { movingAverage, dataSeries, generateRequired, isGenerating } = useWebWorkerDemoSelector(
		(s) => ({
			movingAverage: s.input,
			dataSeries: s.processedData.series,
			generateRequired: dataProcessingRequired(s),
			isGenerating: s.isGenerating,
		})
	);

	const timeSeries = useMemo(() => [buildTimeSeries(dataSeries)], [dataSeries]);

	const dispatch = useAppDispatch();

	useEffect(() => {
		// Only start generating new intervals when the previous interval generation has completed
		// This ensures only 1 worker is running at once
		if (generateRequired && !isGenerating) {
			dispatch(processData(movingAverage));
		}
	}, [movingAverage, generateRequired, isGenerating, dispatch]);

	const timeTicks = useMemo(() => {
		const maxTimeSeconds = lodash.max(dataSeries.map((d) => d.x)) ?? 0;
		return buildNiceTimeTicksToDisplay(maxTimeSeconds, 6);
	}, [dataSeries]);

	return (
		<div className="activity-data-viewer">
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
