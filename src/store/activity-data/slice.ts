import { createSlice } from '@reduxjs/toolkit';
import { ActivityContainer, fromJSONData } from 'library/activity-data/activity-container';
import ExampleData from 'library/activity-data/data/example-over-unders';
import { Mutable } from 'library/utils/type-utils';

export type ActivityState = Readonly<{
	activities: ActivityContainer[];
	selectedIndex?: number;
}>;

const defaultState: ActivityState = {
	activities: [],
};

function addActivitiesImpl(state: Mutable<ActivityState>, newActivities: ActivityContainer[]) {
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
			addActivitiesImpl(state, [{ ...fromJSONData(ExampleData) }]);
		},
	},
});

export const { reducer, actions } = slice;

export const { loadExampleData } = actions;
