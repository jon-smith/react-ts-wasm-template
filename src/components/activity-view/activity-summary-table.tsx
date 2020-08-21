import * as React from 'react';
import { createStyles, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Paper,
	ThemeProvider,
} from '@material-ui/core';

const useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			width: '100%',
		},
		paper: {
			marginTop: theme.spacing(1),
			width: '100%',
			overflowX: 'auto',
			marginBottom: theme.spacing(1),
		},
		table: {
			minWidth: '100%',
		},
	})
);

const theme = createMuiTheme({
	overrides: {
		MuiTableCell: {
			root: {
				padding: '0px',
			},
		},
	},
});

export interface ActivityData {
	filename: string;
	name: string;
	date?: Date;
}

interface Props {
	rows: ActivityData[];
}

const ActivitySummaryTable = (props: Props) => {
	const classes = useStyles();

	const { rows } = props;

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<ThemeProvider theme={theme}>
					<Table className={classes.table} aria-label="activity table">
						<TableHead>
							<TableRow>
								<TableCell>Time</TableCell>
								<TableCell>Date</TableCell>
								<TableCell>Name</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row, i) => (
								<TableRow key={i}>
									<TableCell>{row.date?.toLocaleTimeString() ?? '-'}</TableCell>
									<TableCell>{row.date?.toDateString() ?? '-'}</TableCell>
									<TableCell component="th" scope="row">
										{row.name}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</ThemeProvider>
			</Paper>
		</div>
	);
};

export default ActivitySummaryTable;
