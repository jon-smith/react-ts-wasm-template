import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as ArrayUtils from 'library/utils/array-utils';
import { Mutable } from 'library/utils/type-utils';
import { Interval } from 'library/activity-data/interval';
import { WorkoutCreatorState } from './types';

const defaultIntervals: Interval[] = [
	{ intensityPercent: 0.3, durationSeconds: 60 },
	{ intensityPercent: 0.4, durationSeconds: 60 },
	{ intensityPercent: 0.5, durationSeconds: 60 },
	{ intensityPercent: 0.6, durationSeconds: 60 * 5 },
	...Array(13)
		.fill([
			{ intensityPercent: 1.3, durationSeconds: 30 },
			{ intensityPercent: 0.6, durationSeconds: 15 },
		])
		.flat(),
	{ intensityPercent: 0.6, durationSeconds: 60 * 5 },
];

const defaultState: WorkoutCreatorState = {
	ftp: 200,
	newInterval: { intensityPercent: 1.0, durationSeconds: 0 },
	currentIntervals: defaultIntervals,
	history: [defaultIntervals],
	currentHistoryPosition: 0,
	selectedIndex: null,
};

function setIntervalsImpl(state: Mutable<WorkoutCreatorState>, intervals: Interval[]) {
	const areEqual = (a: Interval, b: Interval) =>
		a.intensityPercent === b.intensityPercent && a.durationSeconds === b.durationSeconds;
	if (!ArrayUtils.areEqual(intervals, state.currentIntervals, areEqual)) {
		const newHistory = [...state.history.slice(0, state.currentHistoryPosition + 1), intervals];

		state.history = newHistory;
		state.currentHistoryPosition = newHistory.length - 1;
		state.currentIntervals = intervals;
	}
}

const workoutCreatorSlice = createSlice({
	name: 'workoutCreator',
	initialState: defaultState,
	reducers: {
		setIntervals(state, action: PayloadAction<Interval[]>) {
			setIntervalsImpl(state, action.payload);
		},
		undo(state) {
			if (state.currentHistoryPosition > 0) {
				state.currentIntervals = state.history[state.currentHistoryPosition - 1];
				state.currentHistoryPosition -= 1;
			}
		},
		redo(state) {
			if (state.currentHistoryPosition < state.history.length - 1) {
				state.currentIntervals = state.history[state.currentHistoryPosition + 1];
				state.currentHistoryPosition += 1;
			}
		},
		setSelectedIndex(state, action: PayloadAction<number | null>) {
			state.selectedIndex = action.payload;
		},
		setSelectedIntensity(state, action: PayloadAction<number>) {
			if (state.selectedIndex === null) {
				state.newInterval.intensityPercent = action.payload;
			} else {
				const updatedIntervals = state.currentIntervals.slice();
				updatedIntervals[state.selectedIndex] = {
					...updatedIntervals[state.selectedIndex],
					intensityPercent: action.payload,
				};
				setIntervalsImpl(state, updatedIntervals);
			}
		},
		setSelectedLength(state, action: PayloadAction<number>) {
			if (state.selectedIndex === null) {
				state.newInterval.durationSeconds = action.payload;
			} else {
				const updatedIntervals = state.currentIntervals.slice();
				updatedIntervals[state.selectedIndex] = {
					...updatedIntervals[state.selectedIndex],
					durationSeconds: action.payload,
				};
				setIntervalsImpl(state, updatedIntervals);
			}
		},
		setFTP(state, action: PayloadAction<number>) {
			state.ftp = action.payload;
		},
	},
});

export const { reducer, actions } = workoutCreatorSlice;

export const {
	setIntervals,
	undo,
	redo,
	setSelectedIndex,
	setSelectedIntensity,
	setSelectedLength,
	setFTP,
} = actions;
