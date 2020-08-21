import * as ArrayUtils from 'library/utils/array-utils';

import { ActivityPoint } from './shared-structures';
import * as Helper from './xml-helpers';

interface Track {
	points: ActivityPoint[];
}

interface TcxLap {
	tracks: Track[];
}

export interface TcxActivity {
	id: string;
	laps: TcxLap[];
}

export interface TcxData {
	activities: TcxActivity[];
}

function parseTrackPoint(pointElement: Element, powerTagName?: string): ActivityPoint {
	const time = Helper.getElementValue(pointElement, 'Time') || '';
	const lat = Helper.getNumericChildElementValue(pointElement, 'LatitudeDegrees');
	const lon = Helper.getNumericChildElementValue(pointElement, 'LongitudeDegrees');

	const distance = Helper.getNumericChildElementValue(pointElement, 'DistanceMeters');
	const elevation = Helper.getNumericChildElementValue(pointElement, 'AltitudeMeters');

	const power = powerTagName
		? Helper.getNumericChildElementValue(pointElement, powerTagName)
		: undefined;
	const cadence = Helper.getNumericChildElementValue(pointElement, 'Cadence');
	const hrElement = pointElement.querySelector('HeartRateBpm');
	const heartRate = hrElement ? Helper.getNumericChildElementValue(hrElement, 'Value') : undefined;

	// note TCX does not support temperature

	return {
		location: lat !== undefined && lon !== undefined ? { lat, lon } : undefined,
		time: new Date(time),
		distance,
		elevation,
		heartRate,
		cadence,
		power,
	};
}

function getPowerTagName(trackElement: Element) {
	const firstTrackPoint = trackElement.querySelector('Trackpoint');
	if (firstTrackPoint) {
		const extensionsNode = Helper.firstChildNodeWithNameContaining(firstTrackPoint, 'EXTENSIONS');
		if (extensionsNode) {
			const tpxNode = Helper.firstChildNodeWithNameContaining(extensionsNode, 'TPX');
			if (tpxNode) {
				const powerNode = Helper.firstChildNodeWithNameContaining(tpxNode, 'WATT');
				return powerNode?.nodeName;
			}
		}
	}

	return undefined;
}

function parseTrack(trackElement: Element) {
	const powerTagName = getPowerTagName(trackElement);
	return {
		points: Array.from(trackElement.querySelectorAll('Trackpoint')).map((t) =>
			parseTrackPoint(t, powerTagName)
		),
	};
}

function parseLap(lapElement: Element) {
	return { tracks: Array.from(lapElement.querySelectorAll('Track')).map(parseTrack) };
}

function parseActivity(activityElement: Element) {
	const id = Helper.getElementValue(activityElement, 'Id') || '';
	return { id, laps: Array.from(activityElement.querySelectorAll('Lap')).map(parseLap) };
}

export function parseTCXFile(file: string): TcxData {
	const xmlParser = new DOMParser();
	const tcxXml = xmlParser.parseFromString(file, 'text/xml');
	const activitiesNode = tcxXml.querySelector('Activities');
	if (activitiesNode) {
		const activities = activitiesNode.querySelectorAll('Activity');
		return {
			activities: ArrayUtils.filterNullAndUndefined(Array.from(activities).map(parseActivity)),
		};
	}

	return { activities: [] };
}
