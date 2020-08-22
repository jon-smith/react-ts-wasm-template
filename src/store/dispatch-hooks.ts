import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { Action } from 'redux';
import configureStore from './configure-store';

type StoreType = ReturnType<typeof configureStore>;
type AppDispatch = StoreType['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useDispatchCallback = <T extends Array<unknown>, ActionT extends Action>(
	action: (...args: T) => ActionT
) => {
	const dispatch = useAppDispatch();
	return useCallback((...args: T) => dispatch(action(...args)), [dispatch, action]);
};
