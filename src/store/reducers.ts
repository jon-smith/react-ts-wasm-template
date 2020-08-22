import { combineReducers } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { DataProcessorState, reducer as dataProcessorReducer } from './data-processor/slice';

export const rootReducer = combineReducers({
	dataProcessor: dataProcessorReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const useRootSelector = <T extends unknown>(selector: (s: RootState) => T) =>
	useSelector<RootState, T>((s) => selector(s));

export const useDataProcessorSelector = <T extends unknown>(
	selector: (s: DataProcessorState) => T
) => useSelector<RootState, T>((s) => selector(s.dataProcessor));
