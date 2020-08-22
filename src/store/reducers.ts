import { combineReducers } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { ActivityState, reducer as activityReducer } from './activity-data/slice';
import { DataProcessorState, reducer as dataProcessorReducer } from './data-processor/slice';

export const rootReducer = combineReducers({
	activities: activityReducer,
	dataProcessor: dataProcessorReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const useRootSelector = <T extends unknown>(selector: (s: RootState) => T) =>
	useSelector<RootState, T>((s) => selector(s));

export const useActivitySelector = <T extends unknown>(selector: (s: ActivityState) => T) =>
	useSelector<RootState, T>((s) => selector(s.activities));

export const useDataProcessorSelector = <T extends unknown>(
	selector: (s: DataProcessorState) => T
) => useSelector<RootState, T>((s) => selector(s.dataProcessor));
