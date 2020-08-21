import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';

import { Slider, SliderWithListValues } from './slider';

const useStyles = makeStyles((theme) => ({
	group: {
		marginLeft: theme.spacing(6),
		transform: 'translateY(4px)',
		alignContent: 'center',
	},
	title: {
		marginRight: theme.spacing(2),
	},
	slider: {
		minWidth: 200,
	},
	input: {
		width: 55,
	},
}));

type Props = {
	title: string;
	min: number;
	max: number;
	sliderValues?: number[];
	spinStep: number;
	value: number;
	onChange: (value: number) => void;
	onLoseFocus?: (value: number) => void;
};

export default function SliderWithSpin(props: Props) {
	const { title, min, max, spinStep, sliderValues, value, onChange, onLoseFocus } = props;

	const classes = useStyles();

	const clampedSetValue = (value: number) => {
		if (value < min) onChange(min);
		if (value > max) onChange(max);
		onChange(value);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const number = Number(event.target.value);
		if (Number.isFinite(number)) clampedSetValue(number);
	};

	const handleBlur = () => onLoseFocus?.(value);

	return (
		<FormGroup row className={classes.group}>
			<div className={classes.title}>
				<Typography id="input-slider" gutterBottom>
					{title}
				</Typography>
			</div>
			<div className={classes.slider}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs>
						{sliderValues ? (
							<SliderWithListValues
								className={classes.slider}
								value={value}
								setValue={clampedSetValue}
								valueList={sliderValues}
							/>
						) : (
							<Slider
								className={classes.slider}
								value={value}
								setValue={clampedSetValue}
								min={min}
								max={max}
							/>
						)}
					</Grid>
					<Grid item>
						<Input
							className={classes.input}
							value={value}
							margin="dense"
							onChange={handleInputChange}
							onBlur={handleBlur}
							inputProps={{
								step: spinStep,
								min,
								max,
								type: 'number',
								'aria-labelledby': 'input-slider',
							}}
						/>
					</Grid>
				</Grid>
			</div>
		</FormGroup>
	);
}
