import React from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { useFormStyles } from 'components/styles/form-styles';

import { BestSplitDisplayOption } from './best-split-display-option';

type Props = {
	option: BestSplitDisplayOption;
	onChange: (o: BestSplitDisplayOption) => void;
};

export default function BestSplitCurveSelectionForm(props: Props) {
	const styles = useFormStyles();

	const { option, onChange } = props;

	const makeOnChange = (o: BestSplitDisplayOption) => (e: unknown, c: boolean) => {
		if (c) onChange(o);
	};

	return (
		<FormControl className={styles.formControl} component="fieldset">
			<FormLabel component="legend">Best Splits</FormLabel>
			<RadioGroup row aria-label="position" name="position" defaultValue="HR">
				<FormControlLabel
					value="HR"
					control={<Radio color="primary" />}
					label="HR"
					labelPlacement="start"
					checked={option === 'heartrate'}
					onChange={makeOnChange('heartrate')}
				/>
				<FormControlLabel
					value="power"
					control={<Radio color="primary" />}
					label="Power"
					labelPlacement="start"
					checked={option === 'power'}
					onChange={makeOnChange('power')}
				/>
				<FormControlLabel
					value="pace"
					control={<Radio color="primary" />}
					label="Pace"
					labelPlacement="start"
					checked={option === 'pace'}
					onChange={makeOnChange('pace')}
				/>
				<FormControlLabel
					value="speed"
					control={<Radio color="primary" />}
					label="Speed"
					labelPlacement="start"
					checked={option === 'speed'}
					onChange={makeOnChange('speed')}
				/>
			</RadioGroup>
		</FormControl>
	);
}
