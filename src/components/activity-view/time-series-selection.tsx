import React from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Box from '@material-ui/core/Box';

import { useFormStyles } from 'components/styles/form-styles';
import SliderWithSpin from 'generic-components/input/slider-with-spin';
import { Variable } from 'library/activity-data/activity-calculator';

type Props = {
	option: Variable;
	onChangeOption: (o: Variable) => void;
	movingAverage: number;
	onChangeMovingAverage: (ma: number) => void;
};

export default function TimeSeriesSelectionForm(props: Props) {
	const styles = useFormStyles();

	const { option, onChangeOption, movingAverage, onChangeMovingAverage } = props;

	const makeOnChangeOption = (o: Variable) => (e: unknown, c: boolean) => {
		if (c) onChangeOption(o);
	};

	return (
		<FormControl className={styles.formControl} component="fieldset">
			<FormLabel component="legend">Data View</FormLabel>
			<Box display="flex" flexDirection="row">
				<RadioGroup
					row
					aria-label="time-series-variable"
					name="time-series-variable"
					defaultValue="HR"
				>
					<FormControlLabel
						value="HR"
						control={<Radio color="primary" />}
						label="HR"
						labelPlacement="start"
						checked={option === 'heartrate'}
						onChange={makeOnChangeOption('heartrate')}
					/>
					<FormControlLabel
						value="power"
						control={<Radio color="primary" />}
						label="Power"
						labelPlacement="start"
						checked={option === 'power'}
						onChange={makeOnChangeOption('power')}
					/>
					<FormControlLabel
						value="cadence"
						control={<Radio color="primary" />}
						label="Cadence"
						labelPlacement="start"
						checked={option === 'cadence'}
						onChange={makeOnChangeOption('cadence')}
					/>
				</RadioGroup>
				<SliderWithSpin
					title={'Moving Average'}
					min={0}
					max={1000}
					spinStep={10}
					sliderValues={[0, 1, 2, 3, 4, 5, 10, 20, 30, 60, 360, 600, 1000]}
					value={movingAverage}
					onChange={onChangeMovingAverage}
				/>
			</Box>
		</FormControl>
	);
}
