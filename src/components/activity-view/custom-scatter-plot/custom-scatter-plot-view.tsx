import React, { useMemo, useState } from 'react';

import useThrottledState from 'generic-components/hooks/use-throttled-state';
import XYPlot, { DataSeriesT, DataPoint } from 'generic-components/charts/xy-plot';
import {
	primaryColourForVariable,
	axisLabelForVariable,
} from 'components/helpers/activity-data-component-helpers';

import {
	getProcessedAndSmoothedTimeSeries,
	Variable,
} from 'library/activity-data/activity-calculator';
import { ActivityContainer } from 'library/activity-data/activity-container';

import { useActivitySelector } from 'store/reducers';
import { getSelectedActivity } from 'store/activity-data/selectors';

import SelectionForm, { VarSelection } from './custom-scatter-plot-selection';

function zipYs(x: DataPoint[], y: DataPoint[]) {
	return x
		.map((x, i) => ({ x: x.y, y: y[i].y }))
		.filter((xy) => xy.x !== null && xy.y !== null)
		.map((xy) => ({ x: xy.x!, y: xy.y! }));
}

function getTimeSeriesData(d: ActivityContainer, v: Variable, movingAverageRadius: number) {
	return getProcessedAndSmoothedTimeSeries(
		d,
		v,
		{
			interpolateNull: true,
			maxGapForInterpolation: undefined,
			resolution: 1,
		},
		{ movingAverageRadius }
	).smoothed;
}

function getXYData(d: ActivityContainer, v: VarSelection, movingAverageRadius: number) {
	const xSeries = getTimeSeriesData(d, v.x, movingAverageRadius);
	const ySeries = getTimeSeriesData(d, v.y, movingAverageRadius);

	return zipYs(xSeries, ySeries);
}

function buildSeries(
	d: ActivityContainer | undefined,
	v: VarSelection,
	movingAverageRadius: number,
	name: string
): DataSeriesT {
	const data = d ? getXYData(d, v, movingAverageRadius) : [];

	return {
		name,
		data: data,
		seriesType: 'mark',
		color: primaryColourForVariable(v.x),
	};
}

export default function CustomScatterPlotView() {
	const [variables, setVariables] = useState<VarSelection>({ x: 'power', y: 'heartrate' });
	const [movingAverage, throttledMovingAverage, setMovingAverage] = useThrottledState(0, 1);

	const selectedActivity = useActivitySelector((s) => getSelectedActivity(s));

	const chartSeries = useMemo(
		() => [buildSeries(selectedActivity, variables, throttledMovingAverage, 'scatter')],
		[selectedActivity, variables, throttledMovingAverage]
	);

	return (
		<>
			<SelectionForm
				variables={variables}
				onChangeVariables={setVariables}
				movingAverage={movingAverage}
				onChangeMovingAverage={setMovingAverage}
			/>
			<XYPlot
				className="test-data-chart"
				series={chartSeries}
				xAxisLabel={axisLabelForVariable(variables.x)}
				yAxisLabel={axisLabelForVariable(variables.y)}
			/>
		</>
	);
}
