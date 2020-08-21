// worker-caller mock which avoids using web-workers (for Jest)

import {
	IntervalDetectionParameters,
	performIntervalDetection as impl,
} from 'library/activity-data/interval-detection';
import { ActivityContainer } from 'library/activity-data/activity-container';

export async function performIntervalDetection(
	activity: ActivityContainer | undefined,
	params: IntervalDetectionParameters
) {
	return impl(activity, params);
}
