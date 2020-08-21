import { fillMissingIndices } from 'library/activity-data/best-split-calculator';

export interface ActivityPoint {
	time: Date; // UTC

	power?: number; // Watts

	secondsSinceStart: number;
	cumulativeDistance?: number; // Metres
}

type JsonActivity = {
	name: string;
	date?: Date;
	points: ActivityPoint[];
};

export type ActivityContainer = {
	source: JsonActivity;
	flatPoints: ActivityPoint[];
	filledPoints: { index: number; data?: ActivityPoint }[];
};

type ActivityAttributes = {
	name: string;
	date?: Date;
};

export function getAttributes(activityContainer: ActivityContainer): ActivityAttributes {
	return {
		name: activityContainer.source.name,
		date: activityContainer.source.date,
	};
}

export function fromJSONData(data: JsonActivity): ActivityContainer {
	const filledPoints = fillMissingIndices(
		data.points.map((d) => ({ ...d, index: d.secondsSinceStart }))
	);
	return {
		source: data,
		flatPoints: data.points,
		filledPoints,
	};
}
