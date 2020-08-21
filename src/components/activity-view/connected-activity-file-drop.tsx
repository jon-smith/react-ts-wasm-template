import React, { useCallback } from 'react';
import { useDispatchCallback } from 'store/dispatch-hooks';
import { addActivities } from 'store/activity-data/slice';
import ActivityFileDrop, {
	FileAndData,
	extractActivityData,
} from 'generic-components/file/activity-file-drop';

const ConnectedActivityFileDrop = (props: { text?: string }) => {
	const addActivitesCallback = useDispatchCallback(addActivities);
	const addFiles = useCallback(
		(files: FileAndData[]) =>
			addActivitesCallback(
				files.flatMap((f) =>
					extractActivityData(f.data).map((a) => ({ filename: f.file.name, ...a }))
				)
			),
		[addActivitesCallback]
	);

	return <ActivityFileDrop onAddFiles={addFiles} {...props} />;
};

export default ConnectedActivityFileDrop;
