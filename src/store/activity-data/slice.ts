import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActivityContainer, fromJSONData } from 'library/activity-data/activity-container';
import ExampleData from 'library/activity-data/data/example-over-unders';
import { Mutable } from 'library/utils/type-utils';

type ExtendedActivityContainer = ActivityContainer & { filename: string };

export type View = 'data' | 'interval-detector';

export type ActivityState = Readonly<{
	activities: ExtendedActivityContainer[];
	selectedIndex?: number;
	view: View;
}>;

const defaultState: ActivityState = {
	activities: [],
	view: 'data',
};

function addActivitiesImpl(
	state: Mutable<ActivityState>,
	newActivities: ExtendedActivityContainer[]
) {
	const previousLength = state.activities.length;
	state.activities = [...state.activities, ...newActivities];
	// Select the first activity we have loaded
	if (state.activities.length > previousLength) {
		state.selectedIndex = previousLength;
	}
}

const slice = createSlice({
	name: 'activityData',
	initialState: defaultState,
	reducers: {
		loadExampleData(state) {
			addActivitiesImpl(state, [{ ...fromJSONData(ExampleData), filename: 'Example.json' }]);
		},
		setView(state, action: PayloadAction<View>) {
			state.view = action.payload;
		},
		addActivities(state, action: PayloadAction<ExtendedActivityContainer[]>) {
			addActivitiesImpl(state, action.payload);
		},
		clearActivityData(state) {
			state.activities = [];
		},
		setSelectedIndex(state, action: PayloadAction<number | undefined>) {
			state.selectedIndex = action.payload;
		},
	},
});

export const { reducer, actions } = slice;

export const {
	loadExampleData,
	setView,
	addActivities,
	clearActivityData,
	setSelectedIndex,
} = actions;
