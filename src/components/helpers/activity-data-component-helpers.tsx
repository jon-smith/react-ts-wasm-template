import { Variable } from 'library/activity-data/activity-calculator';
import { BestSplitDisplayOption } from '../activity-view/best-split/best-split-display-option';

export function primaryColourForVariable(o: Variable) {
	switch (o) {
		case 'heartrate':
			return '#c23b22';
		case 'cadence':
			return '#ffb347';
		case 'power':
			return '#966fd6';
		default:
			return undefined;
	}
}

function asRawVariable(o: BestSplitDisplayOption): Variable | null {
	switch (o) {
		case 'heartrate':
			return 'heartrate';
		case 'power':
			return 'power';
		case 'cadence':
			return 'cadence';
		default:
			return null;
	}
}

export function primaryColourForBestSplitOption(o: BestSplitDisplayOption) {
	const asVar = asRawVariable(o);
	if (asVar) return primaryColourForVariable(asVar);

	switch (o) {
		case 'speed':
			return '#779ecb';
		case 'pace':
			return '#779ecb';
		default:
			return undefined;
	}
}

export function axisLabelForVariable(o: Variable) {
	switch (o) {
		case 'heartrate':
			return 'HR';
		case 'cadence':
			return 'Cadence';
		case 'power':
			return 'Power (W)';
		default:
			return '';
	}
}
