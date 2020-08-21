import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Page = 'data' | 'workout-creator';

export interface ViewState {
	readonly currentPage: Page;
}

const defaultState: ViewState = {
	currentPage: 'data',
};

const slice = createSlice({
	name: 'view',
	initialState: defaultState,
	reducers: {
		setCurrentPage(state, action: PayloadAction<Page>) {
			state.currentPage = action.payload;
		},
	},
});

export const { reducer, actions } = slice;

export const { setCurrentPage } = actions;
