import React, { useMemo } from 'react';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { useViewSelector } from 'store/reducers';
import { Page, setCurrentPage } from 'store/view/slice';
import { useDispatchCallback } from 'store/dispatch-hooks';

import ActivityDataViewer from './activity-view/activity-data-viewer';
import WorkoutCreatorPanel from './workout-creator/workout-creator-panel';
import ResponsiveDrawerNav from './responsive-drawer-nav';

import 'rc-time-picker/assets/index.css';
import './main.css';

const palette = {
	primary: { main: '#D1C4E9' },
	secondary: { main: '#FFECB3' },
};

const theme = createMuiTheme({
	palette,
});

const getPage = (page: Page) => {
	switch (page) {
		case 'data':
			return ActivityDataViewer;
		case 'workout-creator':
			return WorkoutCreatorPanel;
		default:
			break;
	}

	return () => <div />;
};

export default function AppImpl() {
	const currentPage = useViewSelector((s) => s.currentPage);
	const PageElement = useMemo(() => getPage(currentPage), [currentPage]);

	const setCurrentPageCallback = useDispatchCallback(setCurrentPage);

	const menuItems = [
		{ name: 'Data', value: 'data' as const },
		{ name: 'Workout Creator', value: 'workout-creator' as const },
	];

	return (
		<ThemeProvider theme={theme}>
			<ResponsiveDrawerNav menuItems={menuItems} onMenuSelect={setCurrentPageCallback}>
				<PageElement />
			</ResponsiveDrawerNav>
		</ThemeProvider>
	);
}
