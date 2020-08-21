import * as React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { useWorkoutCreatorSelector } from 'store/reducers';
import { setFTP } from 'store/workout-creator/slice';
import { useDispatchCallback } from 'store/dispatch-hooks';

const useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			margin: 0,
			padding: theme.spacing(0, 2),
			width: 160,
		},
		label: {
			padding: theme.spacing(1),
		},
	})
);

const NumericFormControlLabel = (props: {
	label: string;
	value: number;
	onChange: (v: number) => void;
}) => {
	const { label, value, onChange } = props;
	const formControlClasses = useStyles();

	return (
		<FormControlLabel
			classes={formControlClasses}
			control={
				<TextField
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

const SettingsFormGroup = () => {
	const ftp = useWorkoutCreatorSelector((s) => s.ftp);

	const setFTPCallback = useDispatchCallback(setFTP);
	return (
		<FormGroup row>
			<NumericFormControlLabel label="FTP" value={ftp} onChange={setFTPCallback} />
		</FormGroup>
	);
};

export default SettingsFormGroup;
