import React, { useMemo, useState } from 'react';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { useFormStyles } from 'components/styles/form-styles';

import { useActivitySelector } from 'store/reducers';
import { getActivityAttributes } from 'store/activity-data/selectors';
import { setSelectedIndex } from 'store/activity-data/slice';
import { useDispatchCallback } from 'store/dispatch-hooks';

import ConnectedActivityFileDrop from './connected-activity-file-drop';

export default function SimpleSelect() {
	const classes = useFormStyles({ formControl: { width: 300 } });

	const { activities, selectedIndex } = useActivitySelector((s) => ({
		activities: getActivityAttributes(s),
		selectedIndex: s.selectedIndex,
	}));

	const setSelectedActivityIndex = useDispatchCallback(setSelectedIndex);

	const [showFilename, setShowFilename] = useState(false);

	const menuItems = useMemo(
		() =>
			activities.map((a, i) => (
				<MenuItem key={i} value={i}>
					{showFilename ? a.filename : a.name}
				</MenuItem>
			)),
		[activities, showFilename]
	);

	return (
		<div style={{ display: 'flex', justifyContent: 'space-between' }}>
			<FormControl className={classes.formControl}>
				<InputLabel id="activity-select-label">Activity</InputLabel>
				<Select
					labelId="activity-select-label"
					id="activity-select"
					value={selectedIndex ?? ''}
					onChange={(e) => {
						const value = parseInt(String(e.target.value), 10);
						if (Number.isSafeInteger(value)) {
							setSelectedActivityIndex(value);
						}
					}}
				>
					{menuItems}
				</Select>
			</FormControl>
			<FormControl className={classes.formControl}>
				<FormControlLabel
					control={
						<Checkbox
							checked={showFilename}
							onChange={(e) => setShowFilename(e.target.checked)}
							name="showFilenames"
							color="primary"
						/>
					}
					label="Show Filenames"
				/>
			</FormControl>
			<div>
				<ConnectedActivityFileDrop text="Drop more GPX/TCX files here, or click to use the file browser" />
			</div>
		</div>
	);
}
