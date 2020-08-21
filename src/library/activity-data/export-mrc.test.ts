import { buildMRCFileString } from './export-mrc';

describe('MRC Export', () => {
	it('Should match snapshot', () => {
		const intervals = [
			{ durationSeconds: 60, intensityPercent: 100 },
			{ durationSeconds: 30, intensityPercent: 120 },
			{ durationSeconds: 40, intensityPercent: 80 },
		];
		expect(buildMRCFileString('name', 'description', intervals)).toMatchSnapshot();
	});
});
