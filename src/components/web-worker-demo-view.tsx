import React, { useState, useEffect, useCallback } from 'react';

import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Box } from '@material-ui/core';

import { useWebWorkerDemoSelector } from 'store/reducers';
import { useDispatchCallback, useAppDispatch } from 'store/dispatch-hooks';
import { processData, dataProcessingRequired, setInput } from 'store/web-worker-demo/slice';

export default function WebWorkerDemoView() {
	const { input, dataSeries, generateRequired, isGenerating } = useWebWorkerDemoSelector((s) => ({
		input: s.input,
		dataSeries: s.processedData.series,
		generateRequired: dataProcessingRequired(s),
		isGenerating: s.isGenerating,
	}));

	const dispatch = useAppDispatch();

	const dispatchSetInput = useDispatchCallback(setInput);

	useEffect(() => {
		// Only start generating new intervals when the previous interval generation has completed
		// This ensures only 1 worker is running at once
		if (generateRequired && !isGenerating) {
			dispatch(processData(input));
		}
	}, [input, generateRequired, isGenerating, dispatch]);

	const textToDisplay = () => {
		return 'Web Worker Result: ' + String(dataSeries.length);
	};

	return (
		<Box display="flex" flexDirection="column" width="100%" alignItems="center">
			<TextField
				style={{ width: '50%' }}
				label="Input text for web-worker processing"
				variant="filled"
				value={input}
				onChange={(e) => dispatchSetInput(Number(e.target.value))}
			/>
			<div style={{ margin: '10px', height: '20px', width: '50%' }}>
				{isGenerating && <LinearProgress />}
			</div>
			<h3>{textToDisplay()}</h3>
		</Box>
	);
}
