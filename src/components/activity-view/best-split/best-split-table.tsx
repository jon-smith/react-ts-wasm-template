import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { DataPoint } from 'generic-components/charts/xy-plot';
import { formatSecondsAsTimeWords, formatSecondsAsHHMMSS } from 'library/utils/time-format-utils';
import { BestSplitDisplayOption } from './best-split-display-option';

function columnNameForOption(o: BestSplitDisplayOption) {
	switch (o) {
		case 'heartrate':
			return 'Time';
		case 'power':
			return 'Time';
		case 'speed':
			return 'Distance';
		case 'pace':
			return 'Distance';
		default:
			return '';
	}
}

type BestSplitTableProps = {
	option: BestSplitDisplayOption;
	series: { name: string; data: DataPoint[] }[];
};

function formatCellXValue(value: number, option: BestSplitDisplayOption) {
	switch (option) {
		case 'heartrate':
			return formatSecondsAsTimeWords(value);
		case 'power':
			return formatSecondsAsTimeWords(value);
		case 'speed':
			return `${value} m`;
		case 'pace':
			return `${value} m`;
		default:
			return value;
	}
}

function formatCellYValue(value: number | null, option: BestSplitDisplayOption) {
	if (value === null) return '-';

	switch (option) {
		case 'heartrate':
			return `${value.toFixed(0)} bpm`;
		case 'power':
			return `${value.toFixed(0)} W`;
		case 'speed':
			return `${value.toFixed(2)} m/s`;
		case 'pace':
			return `${formatSecondsAsHHMMSS(Math.floor(value))}/km`;
		default:
			return value;
	}
}

export default function BestSplitTable(props: BestSplitTableProps) {
	const { option, series } = props;

	const ysPerX: { [k: number]: (number | null)[] } = {};

	series.forEach((d) => {
		d.data.forEach((p) => {
			if (!(p.x in ysPerX)) {
				ysPerX[p.x] = [];
			}
			ysPerX[p.x].push(p.y);
		});
	});

	return (
		<TableContainer component={Paper}>
			<Table size="small" aria-label="best split table">
				<TableHead>
					<TableRow>
						<TableCell>{columnNameForOption(option)}</TableCell>
						{series.map((d, i) => (
							<TableCell key={d.name + i} align="right">
								{d.name}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.entries(ysPerX).map(([x, values]) => (
						<TableRow key={x}>
							<TableCell component="th" scope="row">
								{formatCellXValue(Number(x), option)}
							</TableCell>
							{values.map((v, i) => (
								<TableCell key={i} align="right">
									{formatCellYValue(v, option)}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
