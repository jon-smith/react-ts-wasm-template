import React, { useCallback, useEffect } from 'react';

import Box, { BoxProps } from '@material-ui/core/Box';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Button from '@material-ui/core/Button';

import IntervalEditorPlot from 'generic-components/charts/interval-editor-plot';

import { useIntervalDetectionSelector, useActivitySelector } from 'store/reducers';
import { setCurrentPage } from 'store/view/slice';
import { setIntervals } from 'store/workout-creator/slice';
import { getSelectedActivity } from 'store/activity-data/selectors';
import { useDispatchCallback, useAppDispatch } from 'store/dispatch-hooks';
import { generateIntervals, generateIntervalsRequired } from 'store/interval-detection/slice';
import { intervalsWithIntensity } from 'store/interval-detection/selectors';

import ActivityIntervalAnalysisPlot from './activity-interval-analysis-plot';
import ParamsForm from './interval-detection-params-form-group';

const stopClickFocusPropagation: Partial<BoxProps> = {
	onClick: (event) => event.stopPropagation(),
	onFocus: (event) => event.stopPropagation(),
};

const IntervalDetectionView = () => {
	const activity = useActivitySelector((s) => getSelectedActivity(s));

	const { params, intervals, generateRequired, isGenerating } = useIntervalDetectionSelector(
		(s) => ({
			params: s.generationParams,
			intervals: intervalsWithIntensity(s),
			generateRequired: generateIntervalsRequired(s, activity),
			isGenerating: s.isGenerating,
		})
	);

	const dispatch = useAppDispatch();

	useEffect(() => {
		// Only start generating new intervals when the previous interval generation has completed
		// This ensures only 1 worker is running at once
		if (generateRequired && !isGenerating) {
			dispatch(generateIntervals({ activity, params }));
		}
	}, [activity, params, generateRequired, isGenerating, dispatch]);

	const setIntervalsDispatcher = useDispatchCallback(setIntervals);
	const setCurrentPageDispatcher = useDispatchCallback(setCurrentPage);
	const openInEditor = useCallback(() => {
		setIntervalsDispatcher(intervals);
		setCurrentPageDispatcher('workout-creator');
	}, [setIntervalsDispatcher, setCurrentPageDispatcher, intervals]);

	return (
		<>
			<ExpansionPanel
				// Do not render ActivityIntervalAnalysisPlot when the panel is collapsed
				TransitionProps={{ unmountOnExit: true }}
			>
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
					<Box display="flex" flexDirection="column" {...stopClickFocusPropagation}>
						<Box width="100%" {...stopClickFocusPropagation}>
							<ParamsForm />
						</Box>
					</Box>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<ActivityIntervalAnalysisPlot />
				</ExpansionPanelDetails>
			</ExpansionPanel>
			<Box height="50vh">
				<IntervalEditorPlot intervals={intervals} />
				<Button variant="contained" onClick={openInEditor} disabled={!activity}>
					Open in editor
				</Button>
			</Box>
		</>
	);
};

export default IntervalDetectionView;
