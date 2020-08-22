import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AwaitedType } from 'library/utils/type-utils';
import { runWebWorker } from './worker-caller';

type WorkerResultT = AwaitedType<ReturnType<typeof runWebWorker>>;
type WorkerInput = string;

export type WebWorkerDemoState = Readonly<{
	input: WorkerInput;
	isGenerating: boolean;
	processedData: { series: WorkerResultT; input?: WorkerInput };
}>;

const defaultState: WebWorkerDemoState = {
	input: '',
	isGenerating: false,
	processedData: {
		series: '',
	},
};

export function dataProcessingRequired(state: WebWorkerDemoState) {
	if (state.processedData.input === undefined) return true;

	return state.processedData.input !== state.input;
}

export const processData = createAsyncThunk(
	'webWorkerDemo/runWorker',
	async (input: WorkerInput) => {
		const series = await runWebWorker(input);
		return {
			series,
			input,
		};
	}
);

const webWorkerDemoSlice = createSlice({
	name: 'webWorkerDemo',
	initialState: defaultState,
	reducers: {
		setInput(state, action: PayloadAction<WorkerInput>) {
			state.input = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(processData.pending, (state) => {
			state.isGenerating = true;
		});
		builder.addCase(processData.rejected, (state) => {
			state.isGenerating = false;
		});
		builder.addCase(processData.fulfilled, (state, { payload }) => {
			state.processedData = payload;
			state.isGenerating = false;
		});
	},
});

export const { reducer, actions } = webWorkerDemoSlice;

export const { setInput } = actions;
