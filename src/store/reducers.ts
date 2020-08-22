import { combineReducers } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { WebWorkerDemoState, reducer as webWorkerDemoReducer } from './web-worker-demo/slice';

export const rootReducer = combineReducers({
	webWorkerDemo: webWorkerDemoReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const useRootSelector = <T extends unknown>(selector: (s: RootState) => T) =>
	useSelector<RootState, T>((s) => selector(s));

export const useWebWorkerDemoSelector = <T extends unknown>(
	selector: (s: WebWorkerDemoState) => T
) => useSelector<RootState, T>((s) => selector(s.webWorkerDemo));
