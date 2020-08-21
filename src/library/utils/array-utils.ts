export function filterNullAndUndefined<T>(input: readonly (T | null | undefined)[]): T[] {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return input.filter((i) => i !== null && i !== undefined).map((i) => i!);
}

export function areEqual<T>(a: readonly T[], b: readonly T[], pred: (a: T, b: T) => boolean) {
	return a.length === b.length && a.every((v, i) => pred(v, b[i]));
}

export function cumulative(input: number[]) {
	const copy = input.concat();

	for (let i = 1; i < input.length; i++) {
		copy[i] = copy[i - 1] + input[i];
	}
	return copy;
}

export function sortNumeric(input: number[]) {
	return input.concat().sort((a, b) => a - b);
}

export function findPeaksAndTroughs(input: number[]) {
	const result = input.map(() => null as 'peak' | 'trough' | null);

	if (input.length > 0) {
		let i = 1;
		// Determine if the first value is a peak or trough
		for (; i < input.length; ++i) {
			if (input[i] > input[i - 1]) {
				result[0] = 'trough';
				break;
			} else if (input[i] < input[i - 1]) {
				result[0] = 'peak';
				break;
			}
		}

		let previousInflection = result[0];
		for (; i < input.length; ++i) {
			// If last point was a peak, we want to find the next increase, which is the next trough
			if (previousInflection === 'peak') {
				if (input[i] > input[i - 1]) {
					result[i - 1] = 'trough';
					previousInflection = 'trough';
				}
			} else if (previousInflection === 'trough') {
				if (input[i] < input[i - 1]) {
					result[i - 1] = 'peak';
					previousInflection = 'peak';
				}
			}
		}
	}

	return result;
}

export function movingAverage(values: number[], movingAverageRadius?: number) {
	const radius = movingAverageRadius ?? 0;
	if (radius === 0) return values;

	const result: number[] = [];

	let sum = 0;

	for (let i = 0; i < radius && i < values.length; ++i) {
		sum += values[i];
	}

	let count = radius;

	for (let i = 0; i < values.length; ++i) {
		const indexToRemove = i - radius - 1;
		const indexToAdd = i + radius;

		if (indexToAdd < values.length) {
			sum += values[indexToAdd];
			count += 1;
		}
		if (indexToRemove >= 0) {
			sum -= values[indexToRemove];
			count -= 1;
		}

		result.push(sum / count);
	}

	return result;
}

export function movingAverageObj<T extends { [k: string]: number }>(
	values: T[],
	accessor: keyof T,
	movingAverageRadius?: number
) {
	const radius = movingAverageRadius ?? 0;
	if (radius === 0) return values;

	const result: T[] = [];

	let sum = 0;

	for (let i = 0; i < radius && i < values.length; ++i) {
		sum += values[i][accessor];
	}

	let count = radius;

	for (let i = 0; i < values.length; ++i) {
		const indexToRemove = i - radius - 1;
		const indexToAdd = i + radius;

		if (indexToAdd < values.length) {
			sum += values[indexToAdd][accessor];
			count += 1;
		}
		if (indexToRemove >= 0) {
			sum -= values[indexToRemove][accessor];
			count -= 1;
		}

		result.push({ ...values[i], [accessor]: sum / count });
	}

	return result;
}
