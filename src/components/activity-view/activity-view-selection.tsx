import React, { useCallback } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useActivitySelector } from 'store/reducers';
import { View, setView } from 'store/activity-data/slice';
import { useDispatchCallback } from 'store/dispatch-hooks';

const StyledTabs = withStyles((theme) => ({
	root: {
		borderBottom: '1px solid #e8e8e8',
		width: '100%',
		backgroundColor: theme.palette.background.paper,
	},
}))(Tabs);

interface StyledTabProps {
	label: string;
}

const StyledTab = withStyles((theme) =>
	createStyles({
		root: {
			textTransform: 'none',
			minWidth: 72,
			fontWeight: theme.typography.fontWeightRegular,
			marginRight: theme.spacing(4),
		},
	})
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

const viewOrder: View[] = ['data', 'interval-detector'];
const pageToIndex = (p: View) => viewOrder.findIndex((o) => o === p) ?? 0;

const NavigationTabs = () => {
	const currentPage = useActivitySelector((s) => s.view);

	const setViewCallback = useDispatchCallback(setView);

	const setCurrentPageCallback = useCallback(
		(_: React.ChangeEvent<{}>, newValue: number) => {
			setViewCallback(viewOrder[newValue]);
		},
		[setViewCallback]
	);

	return (
		<StyledTabs value={pageToIndex(currentPage)} onChange={setCurrentPageCallback}>
			<StyledTab label="Data" />
			<StyledTab label="Interval Detector" />
		</StyledTabs>
	);
};

export default NavigationTabs;
