import * as React from 'react';
import { useMemo, useState } from 'react';
import {
	FlexibleXYPlot,
	HorizontalGridLines,
	VerticalGridLines,
	XAxis,
	YAxis,
	LineMarkSeries,
	Highlight,
	Borders,
} from 'react-vis';

type ReactVisArea = {
	left: number;
	right: number;
	top: number;
	bottom: number;
};

export type DataPoint = {
	x: number;
	// null will allow gaps in series lines
	y: number | null;
};

type SeriesTypes = 'line' | 'mark' | 'linemark';

const LineSeriesStyle = {
	lineStyle: { fill: 'none' },
	markStyle: { fill: 'none', stroke: 'none' },
};

const MarkSeriesStyle = {
	lineStyle: { fill: 'none', stroke: 'none' },
};

const LineMarkSeriesStyle = {
	lineStyle: { fill: 'none' },
};

function getSeriesStyle(type?: SeriesTypes) {
	switch (type) {
		case 'line':
			return LineSeriesStyle;
		case 'mark':
			return MarkSeriesStyle;
		case 'linemark':
			return LineMarkSeriesStyle;
		default:
			return LineMarkSeriesStyle;
	}
}

export type DataSeriesT<DataPointT extends DataPoint = DataPoint> = {
	name: string;
	data: DataPointT[];
	seriesType?: SeriesTypes;
	color?: string;
};

interface Props<DataPointT extends DataPoint> {
	className?: string;
	series: readonly DataSeriesT<DataPointT>[];

	xType?: 'log';
	yType?: 'log';

	xAxisLabel?: string;
	yAxisLabel?: string;

	xDomain?: readonly [number, number];
	yDomain?: readonly [number, number];

	xTickValues?: readonly number[];
	yTickValues?: readonly number[];

	xTickFormat?(value: number, index?: number): string | React.ReactSVGElement;
	yTickFormat?(value: number, index?: number): string | React.ReactSVGElement;
}

const buildSeriesComponents = <DataPointT extends DataPoint>(
	series: readonly DataSeriesT<DataPointT>[]
) => {
	const seriesComponents = series
		.filter((s) => s.data.length > 0)
		.map((s, i) => {
			return (
				<LineMarkSeries
					key={i}
					size={2}
					data={s.data}
					color={s.color}
					getNull={(p: DataPoint) => p.y !== null}
					{...getSeriesStyle(s.seriesType)}
				/>
			);
		});

	if (seriesComponents.length > 0) {
		return seriesComponents;
	}

	// If we don't have any series, return a dummy one so the chart still displays
	return <LineMarkSeries size={0} data={[{ x: 1.0, y: 1.0 }]} />;
};

const gridStyle = { stroke: 'lightgrey' };
const axisStyle = { line: { stroke: 'black' } };
const backgroundFill = { fill: '#fff' };
// Define a style for the border around the inner chart area
// which blocks the chart series from being seen under the axes
const borderStyle = {
	bottom: backgroundFill,
	left: backgroundFill,
	right: backgroundFill,
	top: backgroundFill,
};

const XYPlot = <DataPointT extends DataPoint>(props: Props<DataPointT>) => {
	const { series, xType, yType, xDomain, yDomain } = props;

	const [zoomArea, setZoomArea] = useState<ReactVisArea | null>(null);

	const xDomainToUse = zoomArea ? [zoomArea.left, zoomArea.right] : xDomain;
	const yDomainToUse = zoomArea ? [zoomArea.bottom, zoomArea.top] : yDomain;
	const seriesComponents = useMemo(() => buildSeriesComponents(series), [series]);

	return (
		<FlexibleXYPlot
			className={props.className}
			xDomain={xDomainToUse}
			yDomain={yDomainToUse}
			xType={xType}
			yType={yType}
		>
			<HorizontalGridLines style={gridStyle} />
			<VerticalGridLines style={gridStyle} />
			{seriesComponents}
			<Borders style={borderStyle} />
			<XAxis
				title={props.xAxisLabel}
				style={axisStyle}
				tickValues={props.xTickValues}
				tickFormat={props.xTickFormat}
			/>
			<YAxis
				title={props.yAxisLabel}
				style={axisStyle}
				tickValues={props.yTickValues}
				tickFormat={props.yTickFormat}
			/>
			<Highlight onBrushEnd={setZoomArea} />
		</FlexibleXYPlot>
	);
};

XYPlot.defaultProps = {
	xAxisLabel: '',
	yAxisLabel: '',
};

export default React.memo(XYPlot);
