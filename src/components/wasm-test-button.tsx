import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';

import { getGlobalWasmState, getWasmLibIfLoaded } from 'wasm/wasm-loader';
import { Box } from '@material-ui/core';

export default function WasmTestButton() {
	const [wasmGreeting, setWasmGreeting] = useState('');
	const [wasmLoaded, setWasmLoaded] = useState<false | true | 'failed'>(false);

	// Wait for wasm to be loaded
	useEffect(() => {
		const waitForWasm = async () => {
			const { promise } = getGlobalWasmState();
			await promise;
			const { failedToLoad } = getGlobalWasmState();
			setWasmLoaded(failedToLoad ? 'failed' : true);
		};
		waitForWasm();
	}, []);

	const onClick = () => {
		const wasm = getWasmLibIfLoaded();
		if (wasm) {
			setWasmGreeting(wasm.get_greeting());
		}
	};

	const textToDisplay = () => {
		switch (wasmLoaded) {
			case true:
				return wasmGreeting;
			case false:
				return 'Loading....';
			case 'failed':
				return 'Failed to load';
		}
		return '';
	};

	return (
		<Box display="flex" flexDirection="column" width="100%" alignItems="center">
			<Button variant="contained" color="primary" disabled={wasmLoaded !== true} onClick={onClick}>
				Greet WASM
			</Button>
			<h3>{textToDisplay()}</h3>
		</Box>
	);
}
