import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Box from '@material-ui/core/Box';

import { useFormStyles } from 'components/styles/form-styles';
import SliderWithSpin from 'generic-components/input/slider-with-spin';

type Props = {
	movingAverage: number;
	onChangeMovingAverage: (ma: number) => void;
};

export default function TimeSeriesSelectionForm(props: Props) {
	const styles = useFormStyles();

	const { movingAverage, onChangeMovingAverage } = props;

	return (
		<FormControl className={styles.formControl} component="fieldset">
			<FormLabel component="legend">Data View</FormLabel>
			<Box display="flex" flexDirection="row">
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
