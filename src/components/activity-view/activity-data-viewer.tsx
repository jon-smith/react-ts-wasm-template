import React from 'react';

import { useActivitySelector } from 'store/reducers';
import { View } from 'store/activity-data/slice';

import BestSplitPlotViewer from './best-split/best-split-view';
import ActivitySelectionForm from './activity-selection-form';
import TimeSeriesDataViewer from './time-series-data-viewer';
import CustomScatterPlotView from './custom-scatter-plot/custom-scatter-plot-view';
import ConnectedActivityFileDrop from './connected-activity-file-drop';
import ActivityViewSelection from './activity-view-selection';
import IntervalDetectionView from './interval-detection/interval-detection-view';

import { loadExampleData } from 'store/activity-data/slice';
import { useDispatchCallback } from 'store/dispatch-hooks';

function componentFromView(view: View) {
	switch (view) {
		case 'data':
			return (
				<>
					<TimeSeriesDataViewer />
					<BestSplitPlotViewer />
					<CustomScatterPlotView />
				</>
			);
		case 'interval-detector':
			return <IntervalDetectionView />;
		default:
			return <div />;
	}
}

const ActivityDataViewer = () => {
	const { activitiesLoaded, view } = useActivitySelector((s) => ({
		activitiesLoaded: s.activities.length > 0,
		view: s.view,
	}));

	const loadExampleDataCallback = useDispatchCallback(loadExampleData);

	if (!activitiesLoaded) {
		return (
			<div className="activity-data-welcome">
				<h4>Welcome to raichu</h4>
				<p>頂きます</p>
				<ConnectedActivityFileDrop text="To get started, drop GPX/TCX files here, or click to use the file browser" />
				<div onClick={loadExampleDataCallback}>Alternatively, click here to load example data</div>
			</div>
		);
	}

	return (
		<div className="activity-data-viewer">
			<ActivitySelectionForm />
			<ActivityViewSelection />
			{componentFromView(view)}
		</div>
	);
};

export default ActivityDataViewer;
