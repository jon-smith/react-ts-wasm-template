import * as Comlink from 'comlink';
/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import Worker from 'worker-loader!./worker';
import { WorkerType } from './worker';

import { IntervalDetectionParameters } from 'library/activity-data/interval-detection';
import { ActivityContainer } from 'library/activity-data/activity-container';

export async function performIntervalDetection(
	activity: ActivityContainer | undefined,
	params: IntervalDetectionParameters
) {
	const worker = Worker();
	const workerObj = Comlink.wrap<WorkerType>(worker);
	return workerObj.performIntervalDetection(activity, params);
}
