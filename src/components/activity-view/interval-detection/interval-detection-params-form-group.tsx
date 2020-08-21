import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { useIntervalDetectionSelector } from 'store/reducers';
import {
	setFTP,
	setStepThreshold,
	setWindowRadius,
	setInputSmoothing,
	setDiscrepencySmoothing,
} from 'store/interval-detection/slice';
import { useDispatchCallback } from 'store/dispatch-hooks';

const useFormControlStyles = makeStyles((theme) =>
	createStyles({
		root: {
			margin: 0,
			padding: theme.spacing(0, 2),
		},
		label: {
			padding: theme.spacing(1),
		},
	})
);

const useTextFieldStyles = makeStyles((theme) =>
	createStyles({
		root: {
			width: 100,
		},
	})
);

const NumericFormControlLabel = (props: {
	label: string;
	value: number;
	onChange: (v: number) => void;
}) => {
	const { label, value, onChange } = props;

	const formControlClasses = useFormControlStyles();
	const textFieldClasses = useTextFieldStyles();

	return (
		<FormControlLabel
			classes={formControlClasses}
			control={
				<TextField
					classes={textFieldClasses}
					type="number"
					variant="outlined"
					size="small"
					margin="none"
					value={value}
					onChange={(e) => onChange(parseFloat(e.target.value))}
				/>
			}
			label={label}
			labelPlacement="start"
		/>
	);
};

const InfoTooltip = () => (
	<Tooltip
		title={
			<div>
				<h2>Window Size</h2>
				<p>
					This is the radius in seconds of the moving window used to detect changes in power. It
					compares the average power within the window before a time point to the average power
					after the time point to create a 'discrepency curve' from which peaks are detected to
					identify step changes in power.
				</p>
				<h2>Pre Smooth</h2>
				<p>The radius of the moving average applied to the raw input data.</p>
				<h2>Post Smooth</h2>
				<p>The radius of the moving average applied to the discrepency curve</p>
				<h2>Step Threshold</h2>
				<p>
					The threshold in watts for a peak in the discrepency curve to be considered a step change.
				</p>
			</div>
		}
		placement="left"
	>
		<InfoIcon />
	</Tooltip>
);

const SettingsFormGroup = () => {
	const { ftp, params } = useIntervalDetectionSelector((s) => ({
		ftp: s.ftp,
		params: s.generationParams,
	}));

	const setFTPCallback = useDispatchCallback(setFTP);
	const setStepThresholdCallback = useDispatchCallback(setStepThreshold);
	const setWindowRadiusCallback = useDispatchCallback(setWindowRadius);
	const setInputSmoothingCallback = useDispatchCallback(setInputSmoothing);
	const setDiscrepencySmoothingCallback = useDispatchCallback(setDiscrepencySmoothing);

	return (
		<Box display="flex" flexDirection="row">
			<FormGroup row>
				<NumericFormControlLabel label="FTP" value={ftp} onChange={setFTPCallback} />
				<NumericFormControlLabel
					label="Window Size"
					value={params.windowRadius}
					onChange={setWindowRadiusCallback}
				/>
				<NumericFormControlLabel
					label="Pre Smooth"
					value={params.inputSmoothingRadius}
					onChange={setInputSmoothingCallback}
				/>
				<NumericFormControlLabel
					label="Post Smooth"
					value={params.discrepencySmoothingRadius}
					onChange={setDiscrepencySmoothingCallback}
				/>
				<NumericFormControlLabel
					label="Step Threshold"
					value={params.stepThreshold}
					onChange={setStepThresholdCallback}
				/>
			</FormGroup>
			<InfoTooltip />
		</Box>
	);
};

export default SettingsFormGroup;
