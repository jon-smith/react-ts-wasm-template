import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { useFormStyles } from 'components/styles/form-styles';
import SliderWithSpin from 'generic-components/input/slider-with-spin';
import { Variable } from 'library/activity-data/activity-calculator';

export type VarSelection = { x: Variable; y: Variable; colour?: Variable };

type Props = {
	variables: VarSelection;
	onChangeVariables: (o: VarSelection) => void;
	movingAverage: number;
	onChangeMovingAverage: (ma: number) => void;
};

const variableList: Variable[] = ['power', 'heartrate', 'cadence', 'elevation', 'time'];
const menuItems = variableList.map((v, i) => (
	<MenuItem key={i} value={i}>
		{v}
	</MenuItem>
));

function VarSelect(props: {
	variable?: Variable;
	key: keyof VarSelection;
	onChange: (o?: Variable) => void;
	title: string;
	hidden?: boolean;
}) {
	const { variable, key, onChange, title, hidden = false } = props;

	const varIndex = variableList.findIndex((v) => v === variable);

	const id = key + '-select';
	const labelId = id + '-label';

	const styles = useFormStyles(hidden ? { formControl: { display: 'none' } } : undefined);
	return (
		<FormControl className={styles.formControl}>
			<InputLabel id={labelId}>{title}</InputLabel>
			<Select
				labelId={labelId}
				id={id}
				value={varIndex ?? ''}
				onChange={(e) => {
					const value = parseInt(String(e.target.value), 10);
					if (Number.isSafeInteger(value)) {
						const v = variableList[value];
						if (v) {
							onChange(v);
						}
					}
				}}
			>
				{menuItems}
			</Select>
		</FormControl>
	);
}

export default function CustomScatterPlotSelectionForm(props: Props) {
	const styles = useFormStyles();

	const { variables, onChangeVariables, movingAverage, onChangeMovingAverage } = props;

	const onChangeX = (o?: Variable) => {
		if (o) onChangeVariables({ ...variables, x: o });
	};

	const onChangeY = (o?: Variable) => {
		if (o) onChangeVariables({ ...variables, y: o });
	};

	const onChangeColour = (o?: Variable) => {
		onChangeVariables({ ...variables, colour: o });
	};

	return (
		<Box className={styles.formControl}>
			<FormLabel component="legend">Custom Scatter Plot</FormLabel>
			<Box display="flex" flexDirection="row">
				<VarSelect variable={variables.x} onChange={onChangeX} key="x" title="X-axis" />
				<VarSelect variable={variables.y} onChange={onChangeY} key="y" title="Y-axis" />
				<VarSelect
					variable={variables.colour}
					onChange={onChangeColour}
					key="colour"
					title="Colour"
					hidden={true}
				/>
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
		</Box>
	);
}
