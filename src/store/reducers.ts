import { combineReducers } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { ActivityState, reducer as activityReducer } from './activity-data/slice';
import { ViewState, reducer as viewReducer } from './view/slice';
import { WorkoutCreatorState } from './workout-creator/types';
import { reducer as workoutCreatorReducer } from './workout-creator/slice';
import {
	IntervalDetectionState,
	reducer as intervalDetectionReducer,
} from './interval-detection/slice';

export const rootReducer = combineReducers({
	activities: activityReducer,
	intervalDetection: intervalDetectionReducer,
	view: viewReducer,
	workoutCreator: workoutCreatorReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const useRootSelector = <T extends unknown>(selector: (s: RootState) => T) =>
	useSelector<RootState, T>((s) => selector(s));

export const useActivitySelector = <T extends unknown>(selector: (s: ActivityState) => T) =>
	useSelector<RootState, T>((s) => selector(s.activities));

export const useIntervalDetectionSelector = <T extends unknown>(
	selector: (s: IntervalDetectionState) => T
) => useSelector<RootState, T>((s) => selector(s.intervalDetection));

export const useViewSelector = <T extends unknown>(selector: (s: ViewState) => T) =>
	useSelector<RootState, T>((s) => selector(s.view));

export const useWorkoutCreatorSelector = <T extends unknown>(
	selector: (s: WorkoutCreatorState) => T
) => useSelector<RootState, T>((s) => selector(s.workoutCreator));
