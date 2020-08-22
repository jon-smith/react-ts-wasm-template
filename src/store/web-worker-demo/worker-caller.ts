import * as Comlink from 'comlink';
/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import Worker from 'worker-loader!./worker';
import { WorkerType } from './worker';

export async function runWebWorker(input: string) {
	const worker = Worker();
	const workerObj = Comlink.wrap<WorkerType>(worker);
	return workerObj.runWebWorker(input);
}
