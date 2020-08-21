import * as Comlink from 'comlink';

import { getSmoothedTimeSeries } from 'library/activity-data/activity-calculator';
import { ActivityContainer } from 'library/activity-data/activity-container';

const obj = {
	performDataSmoothing(activity: ActivityContainer | undefined, radius: number) {
		return activity ? getSmoothedTimeSeries(activity, radius) : [];
	},
};

Comlink.expose(obj);

export type WorkerType = typeof obj;
