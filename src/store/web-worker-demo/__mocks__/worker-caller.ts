// worker-caller mock which avoids using web-workers (for Jest)

import { getSmoothedTimeSeries } from 'library/activity-data/activity-calculator';
import { ActivityContainer } from 'library/activity-data/activity-container';

export async function runWebWorker(activity: ActivityContainer | undefined, radius: number) {
	return activity ? getSmoothedTimeSeries(activity, radius) : [];
}
