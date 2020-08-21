import React, { useMemo } from 'react';
import XYPlot, { DataSeriesT } from 'generic-components/charts/xy-plot';
import { formatSecondsAsTimeWords } from 'library/utils/time-format-utils';
import {
	defaultTimeTicksForBestSplits,
	defaultDistanceTicksForBestSplits,
} from './best-split-x-values';
import { BestSplitDisplayOption } from './best-split-display-option';

function frontBack<T>(a: T[]) {
	return [a[0], a[a.length - 1]] as const;
}

const defaultTimeAxisRange = frontBack(defaultTimeTicksForBestSplits);

const defaultPaceCurveXDomain = frontBack(defaultDistanceTicksForBestSplits);

function calcYDomain(series: readonly DataSeriesT[]) {
	let yRange = null as [number, number] | null;
	series.forEach((s) =>
		s.data.forEach((d) => {
			if (d.y !== null) {
				if (yRange == null) yRange = [d.y, d.y];
				else {
					if (d.y < yRange[0]) yRange[0] = d.y;
					if (d.y > yRange[1]) yRange[1] = d.y;
				}
			}
		})
	);

	if (yRange == null) return undefined;

	const difference = yRange[1] - yRange[0];

	const margin = difference === 0 ? yRange[0] * 0.1 : difference * 0.1;

	return [yRange[0] - margin, yRange[1] + margin] as const;
}

type BestSplitPlotImplProps = Pick<
	React.ComponentProps<typeof XYPlot>,
	'xAxisLabel' | 'yAxisLabel' | 'xTickValues' | 'xTickFormat' | 'series'
> & {
	defaultXDomain: readonly [number, number];
};

const BestSplitPlotImpl = (props: BestSplitPlotImplProps) => {
	const { series, defaultXDomain, ...plotProps } = props;

	const yDomain = useMemo(() => calcYDomain(series), [series]);

	return (
		<XYPlot
			className="test-data-chart"
			series={series}
			xDomain={series.length === 0 ? defaultXDomain : undefined}
			yDomain={yDomain}
			xType="log"
			{...plotProps}
		/>
	);
};

function bestSplitChartProps(o: BestSplitDisplayOption) {
	switch (o) {
		case 'heartrate':
			return {
				defaultXDomain: defaultTimeAxisRange,
				xAxisLabel: 'time',
				yAxisLabel: 'HR',
				xTickFormat: formatSecondsAsTimeWords,
				xTickValues: defaultTimeTicksForBestSplits,
			};
		case 'power':
			return {
				defaultXDomain: defaultTimeAxisRange,
				xAxisLabel: 'time',
				yAxisLabel: 'power',
				xTickFormat: formatSecondsAsTimeWords,
				xTickValues: defaultTimeTicksForBestSplits,
			};
		case 'speed':
			return {
				defaultXDomain: defaultPaceCurveXDomain,
				xAxisLabel: 'distance',
				yAxisLabel: 'speed',
				xTickFormat: String,
				xTickValues: defaultDistanceTicksForBestSplits,
			};
		case 'pace':
			return {
				defaultXDomain: defaultPaceCurveXDomain,
				xAxisLabel: 'distance',
				yAxisLabel: 'pace',
				xTickFormat: String,
				xTickValues: defaultDistanceTicksForBestSplits,
			};
		default:
			return {
				defaultXDomain: defaultPaceCurveXDomain,
				xAxisLabel: '',
				yAxisLabel: '',
				xTickFormat: String,
				xTickValues: defaultDistanceTicksForBestSplits,
			};
	}
}

export default function BestSplitPlot(
	props: Pick<BestSplitPlotImplProps, 'series'> & { option: BestSplitDisplayOption }
) {
	return <BestSplitPlotImpl series={props.series} {...bestSplitChartProps(props.option)} />;
}
