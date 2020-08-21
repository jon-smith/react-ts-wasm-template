import React from 'react';
import SliderImpl from '@material-ui/core/Slider';

type SimpleBaseProps = {
	className?: string;
	value: number;
	setValue: (v: number) => void;
};

type SimpleSliderProps = SimpleBaseProps & {
	min: number;
	max: number;
};

export function Slider(props: SimpleSliderProps) {
	const { className, value, setValue, min, max } = props;

	const handleSliderChange = (_: unknown, newValue: number | number[]) => {
		setValue(newValue as number);
	};
	return (
		<SliderImpl
			className={className}
			value={value}
			onChange={handleSliderChange}
			aria-labelledby="input-slider"
			min={min}
			max={max}
		/>
	);
}

type SliderListValuesProps = SimpleBaseProps & {
	valueList: number[];
};

export function SliderWithListValues(props: SliderListValuesProps) {
	const { className, value, setValue, valueList } = props;

	const valueListToUse = valueList.length < 2 ? [valueList[0] ?? 0, valueList[0] ?? 0] : valueList;

	const sliderValue = valueList.findIndex((v) => value <= v);
	const sliderValueToUse = sliderValue === -1 ? valueListToUse.length - 1 : sliderValue;

	const handleSliderChange = (_: unknown, newValue: number | number[]) => {
		const newSliderValue = newValue as number;
		const fromList = valueList[newSliderValue];
		if (fromList !== undefined) setValue(fromList);
	};

	return (
		<SliderImpl
			className={className}
			value={sliderValueToUse}
			onChange={handleSliderChange}
			aria-labelledby="input-slider"
			min={0}
			max={valueListToUse.length - 1}
		/>
	);
}
