import React, { useState, useEffect } from 'react';

import useInterval from 'use-interval';

import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import Popover from '@material-ui/core/Popover';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { useFormStyles } from 'components/styles/form-styles';

import { getGlobalWasmState, enableWasm } from 'wasm/wasm-loader';

const checkIsWasmEnabled = () => {
	const { failedToLoad, isEnabled } = getGlobalWasmState();
	return isEnabled && !failedToLoad;
};

export default function SettingsButtonMenu() {
	const classes = useFormStyles();

	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

	const [isEnabled, setIsEnabled] = useState(false);
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

	const onCheck = (check: boolean) => {
		enableWasm(check);
		setIsEnabled(checkIsWasmEnabled());
	};

	// Check every second to see if the state changes (in case changed by another component)
	useInterval(() => {
		setIsEnabled(checkIsWasmEnabled());
	}, 1000);

	const open = Boolean(anchorEl);
	const id = open ? 'settings-popover' : undefined;

	return (
		<>
			<IconButton
				color="inherit"
				aria-label="settings"
				edge="start"
				onClick={(e) => setAnchorEl(e.currentTarget)}
			>
				<SettingsIcon />
			</IconButton>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<FormControl className={classes.formControl}>
					<FormControlLabel
						control={
							<Checkbox
								disabled={wasmLoaded !== true}
								checked={isEnabled}
								onChange={(e) => onCheck(e.target.checked)}
								name="enablewasm"
								color="primary"
							/>
						}
						label="Enable WASM"
					/>
				</FormControl>
			</Popover>
		</>
	);
}
