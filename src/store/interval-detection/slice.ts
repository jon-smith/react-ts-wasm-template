import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
	IntervalDetectionParameters,
	IntervalDetectionResults,
} from 'library/activity-data/interval-detection';
import { ActivityContainer } from 'library/activity-data/activity-container';
import { clamp } from 'library/utils/math-utils';
import { performIntervalDetection } from './worker-caller';

type IntervalGenerationInput = {
	activity: ActivityContainer | undefined;
	params: IntervalDetectionParameters;
};

export type IntervalDetectionState = Readonly<{
	generationParams: IntervalDetectionParameters;
	ftp: number;
	isGenerating: boolean;
	detectionResults: { results: IntervalDetectionResults; input?: IntervalGenerationInput };
}>;

const defaultState: IntervalDetectionState = {
	ftp: 200,
	generationParams: {
		minIntervalDuration: 10,
		stepThreshold: 10,
		windowRadius: 10,
		discrepencySmoothingRadius: 1,
		inputSmoothingRadius: 1,
	},
	isGenerating: false,
	detectionResults: {
		results: {
			intervals: [],
			rawInput: [],
			smoothedInput: [],
			discrepencyCurve: [],
			detectedStepTimePoints: [],
		},
	},
};

export function generateIntervalsRequired(
	state: IntervalDetectionState,
	activity: ActivityContainer | undefined
) {
	if (state.detectionResults.input === undefined) return true;

	return (
		state.detectionResults.input.activity !== activity ||
		state.detectionResults.input.params !== state.generationParams
	);
}

export const generateIntervals = createAsyncThunk(
	'intervalDetection/generateIntervals',
	// Note this function doesn't actually run asynchronously at the moment
	// but I intend to use a worker thread in the future
	// For now I just wanted to try out the usage of createAsyncThunk
	async (input: IntervalGenerationInput) => {
		const results = await performIntervalDetection(input.activity, input.params);
		return {
			results,
			input,
		};
	}
);

const intervalDetectionSlice = createSlice({
	name: 'intervalDetection',
	initialState: defaultState,
	reducers: {
		setFTP(state, action: PayloadAction<number>) {
			state.ftp = clamp(action.payload, 1, 999);
		},
		setWindowRadius(state, action: PayloadAction<number>) {
			state.generationParams.windowRadius = clamp(action.payload, 1, 600);
		},
		setStepThreshold(state, action: PayloadAction<number>) {
			state.generationParams.stepThreshold = clamp(action.payload, 0, 30);
		},
		setInputSmoothing(state, action: PayloadAction<number>) {
			state.generationParams.inputSmoothingRadius = clamp(action.payload, 0, 60);
		},
		setDiscrepencySmoothing(state, action: PayloadAction<number>) {
			state.generationParams.discrepencySmoothingRadius = clamp(action.payload, 0, 60);
		},
	},
	extraReducers: (builder) => {
		builder.addCase(generateIntervals.pending, (state) => {
			state.isGenerating = true;
		});
		builder.addCase(generateIntervals.rejected, (state) => {
			state.isGenerating = false;
		});
		builder.addCase(generateIntervals.fulfilled, (state, { payload }) => {
			state.detectionResults = payload;
			state.isGenerating = false;
		});
	},
});

export const { reducer, actions } = intervalDetectionSlice;

export const {
	setFTP,
	setWindowRadius,
	setStepThreshold,
	setInputSmoothing,
	setDiscrepencySmoothing,
} = actions;
