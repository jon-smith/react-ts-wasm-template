import * as Comlink from 'comlink';
/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import Worker from 'worker-loader!./worker';
import { WorkerType } from './worker';

import { ActivityContainer } from 'library/activity-data/activity-container';

export async function performDataSmoothing(
	activity: ActivityContainer | undefined,
	radius: number
) {
	const worker = Worker();
	const workerObj = Comlink.wrap<WorkerType>(worker);
	return workerObj.performDataSmoothing(activity, radius);
}
