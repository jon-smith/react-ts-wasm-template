import React from 'react';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import ActivityDataViewer from './activity-view/activity-data-viewer';
import TitleBarAndContent from './title-bar-and-content';

import 'rc-time-picker/assets/index.css';
import './main.css';

const palette = {
	primary: { main: '#D1C4E9' },
	secondary: { main: '#FFECB3' },
};

const theme = createMuiTheme({
	palette,
});

export default function AppImpl() {
	return (
		<ThemeProvider theme={theme}>
			<TitleBarAndContent>
				<ActivityDataViewer />
			</TitleBarAndContent>
		</ThemeProvider>
	);
}
