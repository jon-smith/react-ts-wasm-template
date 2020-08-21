import * as React from 'react';
import { useCallback } from 'react';
import { batchActions } from 'redux-batched-actions';

import Box from '@material-ui/core/Box';

import { useWorkoutCreatorSelector } from 'store/reducers';
import { useDispatchCallback, useAppDispatch } from 'store/dispatch-hooks';
import { actions as WorkoutCreatorActions } from 'store/workout-creator/slice';
import { selectedOrNewInterval } from 'store/workout-creator/selectors';
import { Interval } from 'library/activity-data/interval';

import IntervalEditorPlot from 'generic-components/charts/interval-editor-plot';
import IntervalAdjustmentFormGroup from './interval-adjustment-form-group';
import SettingsFormGroup from './settings-form-group';

const useActions = () => {
	const setIntervals = useDispatchCallback(WorkoutCreatorActions.setIntervals);
	const setSelectedIntensity = useDispatchCallback(WorkoutCreatorActions.setSelectedIntensity);
	const setSelectedLength = useDispatchCallback(WorkoutCreatorActions.setSelectedLength);

	const dispatch = useAppDispatch();
	const onChange = useCallback(
		(newIntervals: Interval[], newIndex: number | null) => {
			// Batch the interval and index updates to prevent flicker on multiple rerender
			dispatch(
				batchActions([
					WorkoutCreatorActions.setIntervals(newIntervals),
					WorkoutCreatorActions.setSelectedIndex(newIndex),
				])
			);
		},
		[dispatch]
	);

	return {
		setIntervals,
		onChange,
		setSelectedIntensity,
		setSelectedLength,
	};
};

const WorkoutCreatorPage = () => {
	const { intervals, selectedIndex, currentSelectedInterval } = useWorkoutCreatorSelector((w) => ({
		intervals: w.currentIntervals,
		selectedIndex: w.selectedIndex,
		currentSelectedInterval: selectedOrNewInterval(w),
	}));

	const { onChange, setSelectedIntensity, setSelectedLength } = useActions();

	const onMouseWheel = useCallback(
		(e: React.WheelEvent) => {
			if (selectedIndex == null) return;
			const intensityChange = e.deltaY < 0 ? 0.01 : -0.01;
			const newIntensity = Math.max(
				0.01,
				currentSelectedInterval.intensityPercent + intensityChange
			).toFixed(2);
			setSelectedIntensity(parseFloat(newIntensity));
		},
		[currentSelectedInterval, selectedIndex, setSelectedIntensity]
	);

	return (
		<div className="workout-creator-panel">
			<Box display="flex" flexDirection="column">
				<SettingsFormGroup />
				<IntervalAdjustmentFormGroup />
				<Box>
					<div className="workout-creator-chart" onWheel={onMouseWheel}>
						<IntervalEditorPlot
							intervals={intervals}
							selectedIndex={selectedIndex}
							onChange={onChange}
						/>
					</div>
				</Box>
			</Box>
		</div>
	);
};

export default WorkoutCreatorPage;
