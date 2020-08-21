import * as d3 from 'd3';
import { getDistance } from 'geolib';

import { GpxData } from 'library/activity-parsers/gpx-parser';
import { TcxData, TcxActivity } from 'library/activity-parsers/tcx-parser';
import { ActivityPoint } from 'library/activity-parsers/shared-structures';
import { fillMissingIndices } from 'library/activity-data/best-split-calculator';
import { cumulative } from 'library/utils/array-utils';

type GpxContainer = {
	type: 'gpx';
	data: GpxData;
};

type TcxContainer = {
	type: 'tcx';
	data: TcxActivity;
};

type JsonActivity = {
	name: string;
	date?: Date;
	points: ExtendedPoint[];
};

type JsonContainer = {
	type: 'json';
	data: JsonActivity;
};

export type ExtendedPoint = ActivityPoint & {
	secondsSinceStart: number;
	cumulativeDistance?: number; // Metres
};

export type ActivityContainer = {
	source: GpxContainer | TcxContainer | JsonContainer;
	flatPoints: ExtendedPoint[];
	filledPoints: { index: number; data?: ExtendedPoint }[];
};

type ActivityAttributes = {
	name: string;
	date?: Date;
};

export function getAttributes(activityContainer: ActivityContainer): ActivityAttributes {
	switch (activityContainer.source.type) {
		case 'gpx':
			return {
				name: activityContainer.source.data.track.name,
				date: activityContainer.source.data.metadata?.time,
			};
		case 'tcx':
			return {
				name: activityContainer.source.data.id,
				date: activityContainer.source.data.laps[0]?.tracks[0]?.points[0]?.time,
			};
		case 'json':
			return {
				name: activityContainer.source.data.name,
				date: activityContainer.source.data.date,
			};
		default:
			return { name: '' };
	}
}

function asGeolibCoord(p: { lat: number; lon: number }) {
	return {
		latitude: p.lat,
		longitude: p.lon,
	};
}

function getCumulativeDistances(points: ActivityPoint[]): number[] | undefined {
	const hasLocation = !points.some((p) => p.location === undefined);
	if (hasLocation) {
		const distancesBetween = points.map((p, i) =>
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			i === 0 ? 0 : getDistance(asGeolibCoord(p.location!), asGeolibCoord(points[i - 1].location!))
		);

		return cumulative(distancesBetween);
	}

	const hasDistance = !points.some((p) => p.distance === undefined);
	if (hasDistance) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return points.map((p) => p.distance!);
	}

	return undefined;
}

const buildExtendedPoints = (points: ActivityPoint[]): ExtendedPoint[] => {
	const earliestTime = d3.min(points.map((p) => p.time)) ?? new Date();
	const cumulativeDistances = getCumulativeDistances(points);
	return points.map((p, i) => ({
		...p,
		cumulativeDistance: cumulativeDistances?.[i] ?? 0,
		secondsSinceStart: (p.time.getTime() - earliestTime.getTime()) * 0.001,
	}));
};

export function fromGPXData(data: GpxData): ActivityContainer {
	const flatPoints = buildExtendedPoints(data.track.segments.flatMap((s) => s.points));
	const filledPoints = fillMissingIndices(
		flatPoints.map((d) => ({ ...d, index: d.secondsSinceStart }))
	);
	return {
		source: { type: 'gpx', data },
		flatPoints,
		filledPoints,
	};
}

export function fromTCXData(data: TcxData): ActivityContainer[] {
	return data.activities.map((activity) => {
		const flatPoints = buildExtendedPoints(
			activity.laps.flatMap((l) => l.tracks.flatMap((s) => s.points))
		);

		const filledPoints = fillMissingIndices(
			flatPoints.map((d) => ({ ...d, index: d.secondsSinceStart }))
		);

		return {
			source: { type: 'tcx', data: activity },
			flatPoints,
			filledPoints,
		};
	});
}

export function fromJSONData(data: JsonActivity): ActivityContainer {
	const filledPoints = fillMissingIndices(
		data.points.map((d) => ({ ...d, index: d.secondsSinceStart }))
	);
	return {
		source: { type: 'json', data },
		flatPoints: data.points,
		filledPoints,
	};
}
