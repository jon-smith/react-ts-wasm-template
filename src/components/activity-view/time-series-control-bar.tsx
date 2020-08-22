import React from 'react';

import Box from '@material-ui/core/Box';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import SliderWithSpin from 'generic-components/input/slider-with-spin';

type Props = {
	movingAverage: number;
	onChangeMovingAverage: (ma: number) => void;
};

function useStyles() {
	return makeStyles((theme: Theme) =>
		createStyles({
			container: {
				margin: theme.spacing(1),
				minWidth: 120,
			},
		})
	)();
}

export default function TimeSeriesControlBar(props: Props) {
	const styles = useStyles();

	const { movingAverage, onChangeMovingAverage } = props;

	return (
		<Box className={styles.container} display="flex" flexDirection="row">
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
	);
}
