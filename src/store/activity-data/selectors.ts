import { ActivityState } from './slice';

export function getSelectedActivity(state: ActivityState) {
	return state.selectedIndex !== undefined ? state.activities[state.selectedIndex] : undefined;
}
