import React from 'react';

import { useActivitySelector } from 'store/reducers';

import BestSplitPlotViewer from './best-split/best-split-view';
import TimeSeriesDataViewer from './time-series-data-viewer';

import { loadExampleData } from 'store/activity-data/slice';
import { useDispatchCallback } from 'store/dispatch-hooks';

const ActivityDataViewer = () => {
	const { activitiesLoaded } = useActivitySelector((s) => ({
		activitiesLoaded: s.activities.length > 0,
	}));

	const loadExampleDataCallback = useDispatchCallback(loadExampleData);

	if (!activitiesLoaded) {
		return (
			<div className="activity-data-welcome">
				<div onClick={loadExampleDataCallback}>Click here to load example data</div>
			</div>
		);
	}

	return (
		<div className="activity-data-viewer">
			<TimeSeriesDataViewer />
			<BestSplitPlotViewer />
		</div>
	);
};

export default ActivityDataViewer;
