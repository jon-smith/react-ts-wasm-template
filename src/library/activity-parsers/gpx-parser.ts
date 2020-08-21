import * as ArrayUtils from 'library/utils/array-utils';

import { ActivityPoint } from './shared-structures';
import * as Helper from './xml-helpers';

interface Metadata {
	time: Date;
}

// A Track Segment holds a list of Track Points which are logically connected in order.
// To represent a single GPS track where GPS reception was lost,
// or the GPS receiver was turned off, start a new Track Segment for each continuous span of track data.
interface Segment {
	points: ActivityPoint[];
}

// Description from GPX spec:
// trk represents a track - an ordered list of points describing a path.
export interface Track {
	name: string;
	segments: Segment[];
}

const getMetadata = (metadataNode: Element) => {
	const time = Helper.getElementValue(metadataNode, 'time') || '';
	return { time: new Date(time) };
};

const getPoint = (pointNode: Element): ActivityPoint => {
	const lat = Helper.getNumericAttributeValue(pointNode, 'lat');
	const lon = Helper.getNumericAttributeValue(pointNode, 'lon');
	const elevation = Helper.getNumericChildElementValue(pointNode, 'ele');
	const time = Helper.getElementValue(pointNode, 'time') || '';
	const power = Helper.getNumericChildElementValue(pointNode, 'power');
	const temperature = Helper.getNumericChildElementValue(pointNode, 'gpxtpx:atemp');
	const cadence = Helper.getNumericChildElementValue(pointNode, 'gpxtpx:cad');
	const heartRate = Helper.getNumericChildElementValue(pointNode, 'gpxtpx:hr');

	return {
		location: lat !== undefined && lon !== undefined ? { lat, lon } : undefined,
		time: new Date(time),
		elevation,
		temperature,
		heartRate,
		cadence,
		power,
	};
};

const getSegment = (segmentNode: Element): Segment => {
	const points = Array.from(segmentNode.querySelectorAll('trkpt')).map(getPoint);
	return { points: ArrayUtils.filterNullAndUndefined(points) };
};

const getTrack = (trackNode: Element) => {
	const name = Helper.getElementValue(trackNode, 'name') || '';
	const segments = Array.from(trackNode.querySelectorAll('trkseg')).map(getSegment);
	return { name, segments };
};

export interface GpxData {
	metadata?: Metadata;
	track: Track;
}

export function parseGPXFile(file: string): GpxData {
	const xmlParser = new DOMParser();
	const gpxXml = xmlParser.parseFromString(file, 'text/xml');

	const metadataNode = gpxXml.querySelector('metadata');
	const trackNode = gpxXml.querySelector('trk');
	const track = trackNode ? getTrack(trackNode) : { name: '', segments: [] };

	return {
		metadata: metadataNode ? getMetadata(metadataNode) : undefined,
		track,
	};
}
