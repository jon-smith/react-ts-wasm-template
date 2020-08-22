import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getSmoothedTimeSeries } from 'library/activity-data/activity-calculator';
import { fromJSONData } from 'library/activity-data/activity-container';
import { clamp } from 'library/utils/math-utils';
import { performDataSmoothing } from './worker-caller';
import ExampleData from 'library/activity-data/data/example-over-unders';

type TimeSeriesT = ReturnType<typeof getSmoothedTimeSeries>;

const exampleDataLoaded = fromJSONData(ExampleData);

export type DataProcessorState = Readonly<{
	smoothingRadius: number;
	isGenerating: boolean;
	processedData: { series: TimeSeriesT; smoothingRadius?: number };
}>;

const defaultState: DataProcessorState = {
	smoothingRadius: 0,
	isGenerating: false,
	processedData: {
		series: [],
	},
};

export function dataSmoothingRequired(state: DataProcessorState) {
	if (state.processedData.smoothingRadius === undefined) return true;

	return state.processedData.smoothingRadius !== state.smoothingRadius;
}

export const smoothData = createAsyncThunk(
	'dataProcessing/smoothData',
	async (smoothingRadius: number) => {
		const series = await performDataSmoothing(exampleDataLoaded, smoothingRadius);
		return {
			series,
			smoothingRadius,
		};
	}
);

const dataProcessorSlice = createSlice({
	name: 'dataProcessing',
	initialState: defaultState,
	reducers: {
		setSmoothingRadius(state, action: PayloadAction<number>) {
			state.smoothingRadius = clamp(action.payload, 1, 600);
		},
	},
	extraReducers: (builder) => {
		builder.addCase(smoothData.pending, (state) => {
			state.isGenerating = true;
		});
		builder.addCase(smoothData.rejected, (state) => {
			state.isGenerating = false;
		});
		builder.addCase(smoothData.fulfilled, (state, { payload }) => {
			state.processedData = payload;
			state.isGenerating = false;
		});
	},
});

export const { reducer, actions } = dataProcessorSlice;

export const { setSmoothingRadius } = actions;
