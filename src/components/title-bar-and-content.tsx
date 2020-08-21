import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import SettingsButtonMenu from './settings-button-menu';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
		},
		appBar: {
			[theme.breakpoints.up('lg')]: {
				width: `100%`,
			},
		},
		title: {
			flexGrow: 1,
		},
		toolbar: theme.mixins.toolbar,
		content: {
			flexGrow: 1,
			padding: theme.spacing(3),
			width: '100%',
		},
	})
);

export default function TitleBarAndContent<T>(props: React.PropsWithChildren<{}>) {
	const { children } = props;

	const classes = useStyles();

	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					<Typography variant="h6" className={classes.title} noWrap>
						raichu
					</Typography>
					<SettingsButtonMenu />
				</Toolbar>
			</AppBar>
			<main className={classes.content}>
				<div className={classes.toolbar} />
				{children}
			</main>
		</div>
	);
}
