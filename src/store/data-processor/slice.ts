import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getSmoothedTimeSeries } from 'library/activity-data/activity-calculator';
import { ActivityContainer } from 'library/activity-data/activity-container';
import { clamp } from 'library/utils/math-utils';
import { performDataSmoothing } from './worker-caller';

type TimeSeriesT = ReturnType<typeof getSmoothedTimeSeries>;

type DataProcessingInput = { smoothingRadius: number; activity?: ActivityContainer };

export type DataProcessorState = Readonly<{
	smoothingRadius: number;
	isGenerating: boolean;
	processedData: { series: TimeSeriesT; input?: DataProcessingInput };
}>;

const defaultState: DataProcessorState = {
	smoothingRadius: 0,
	isGenerating: false,
	processedData: {
		series: [],
	},
};

export function dataSmoothingRequired(
	state: DataProcessorState,
	activity: ActivityContainer | undefined
) {
	if (state.processedData.input === undefined) return true;

	return (
		state.processedData.input.activity !== activity ||
		state.processedData.input.smoothingRadius !== state.smoothingRadius
	);
}

export const smoothData = createAsyncThunk(
	'dataProcessing/smoothData',
	async (input: DataProcessingInput) => {
		const series = await performDataSmoothing(input.activity, input.smoothingRadius);
		return {
			series,
			input,
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
