import * as Comlink from 'comlink';

import {
	IntervalDetectionParameters,
	performIntervalDetection,
} from 'library/activity-data/interval-detection';
import { ActivityContainer } from 'library/activity-data/activity-container';

const obj = {
	performIntervalDetection(
		activity: ActivityContainer | undefined,
		params: IntervalDetectionParameters
	) {
		return performIntervalDetection(activity, params);
	},
};

Comlink.expose(obj);

export type WorkerType = typeof obj;
