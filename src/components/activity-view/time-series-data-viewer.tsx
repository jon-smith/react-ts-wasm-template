import React, { useMemo, useState } from 'react';
import lodash from 'lodash';

import useThrottledState from 'generic-components/hooks/use-throttled-state';
import XYPlot, { DataSeriesT } from 'generic-components/charts/xy-plot';
import {
	primaryColourForVariable,
	axisLabelForVariable,
} from 'components/helpers/activity-data-component-helpers';

import {
	getProcessedAndSmoothedTimeSeries,
	Variable,
} from 'library/activity-data/activity-calculator';
import { ActivityContainer } from 'library/activity-data/activity-container';
import { buildNiceTimeTicksToDisplay } from 'library/utils/chart-utils';
import { formatSecondsAsHHMMSS } from 'library/utils/time-format-utils';

import { useActivitySelector } from 'store/reducers';
import { getSelectedActivity } from 'store/activity-data/selectors';

import TimeSeriesSelection from './time-series-selection';

function buildTimeSeries(
	d: ActivityContainer | undefined,
	v: Variable,
	movingAverageRadius: number,
	name: string
): DataSeriesT {
	const timeSeries = d
		? getProcessedAndSmoothedTimeSeries(
				d,
				v,
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
		color: primaryColourForVariable(v),
	};
}

const TimeSeriesDataViewer = () => {
	const [variableOption, setVariableOption] = useState<Variable>('power');
	const [movingAverage, throttledMovingAverage, setMovingAverage] = useThrottledState(0, 1);

	const selectedActivity = useActivitySelector((s) => getSelectedActivity(s));

	const timeSeries = useMemo(
		() => [
			buildTimeSeries(selectedActivity, variableOption, throttledMovingAverage, 'time-series'),
		],
		[selectedActivity, variableOption, throttledMovingAverage]
	);

	const timeTicks = useMemo(() => {
		const maxTimeSeconds = lodash.max(timeSeries.flatMap((s) => s.data.map((d) => d.x))) ?? 0;
		return buildNiceTimeTicksToDisplay(maxTimeSeconds, 6);
	}, [timeSeries]);

	return (
		<>
			<TimeSeriesSelection
				option={variableOption}
				onChangeOption={setVariableOption}
				movingAverage={movingAverage}
				onChangeMovingAverage={setMovingAverage}
			/>
			<XYPlot
				className="test-data-chart"
				series={timeSeries}
				xTickFormat={formatSecondsAsHHMMSS}
				xTickValues={timeTicks}
				xAxisLabel="time"
				yAxisLabel={axisLabelForVariable(variableOption)}
			/>
		</>
	);
};

export default TimeSeriesDataViewer;
