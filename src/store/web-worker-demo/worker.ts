import * as Comlink from 'comlink';

import { getSmoothedTimeSeries } from 'library/activity-data/activity-calculator';
import { ActivityContainer } from 'library/activity-data/activity-container';

const obj = {
	async runWebWorker(activity: ActivityContainer | undefined, radius: number) {
		await new Promise((r) => setTimeout(r, 500));
		return activity ? getSmoothedTimeSeries(activity, radius) : [];
	},
};

Comlink.expose(obj);

export type WorkerType = typeof obj;
