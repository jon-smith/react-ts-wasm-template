import React from 'react';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import ActivityDataViewer from './activity-view/activity-data-viewer';
import TitleBarAndContent from './title-bar-and-content';
import WasmTestButton from './wasm-test-button';
import WebWorkerDemoView from './web-worker-demo-view';

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
				<WasmTestButton />
				<WebWorkerDemoView />
				<ActivityDataViewer />
			</TitleBarAndContent>
		</ThemeProvider>
	);
}
