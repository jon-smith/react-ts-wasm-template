import { Interval } from 'library/activity-data/interval';

export type WorkoutCreatorState = Readonly<{
	ftp: number;
	newInterval: Interval;
	currentIntervals: readonly Interval[];
	history: readonly Interval[][];
	currentHistoryPosition: number;
	selectedIndex: number | null;
}>;
