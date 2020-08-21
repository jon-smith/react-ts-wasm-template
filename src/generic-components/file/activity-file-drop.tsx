import * as React from 'react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { readFileAsText } from 'library/utils/file-utils';
import { GpxData, parseGPXFile } from 'library/activity-parsers/gpx-parser';
import { TcxData, parseTCXFile } from 'library/activity-parsers/tcx-parser';
import { fromGPXData, fromTCXData } from 'library/activity-data/activity-container';

type GpxDataContainer = {
	type: 'gpx';
	data: GpxData;
};
type TcxDataContainer = {
	type: 'tcx';
	data: TcxData;
};
type EmptyDataContainer = {
	type: 'empty';
};
type DataContainer = GpxDataContainer | TcxDataContainer | EmptyDataContainer;

function parseData(
	type: string,
	contents: string
): GpxDataContainer | TcxDataContainer | EmptyDataContainer {
	const typeLower = type.toLowerCase();
	if (typeLower === 'gpx') return { type: 'gpx', data: parseGPXFile(contents) };

	if (typeLower === 'tcx') return { type: 'tcx', data: parseTCXFile(contents) };

	return { type: 'empty' };
}

export type FileAndData = { file: File; data: DataContainer };

export function extractActivityData(data: DataContainer) {
	switch (data.type) {
		case 'gpx':
			return [fromGPXData(data.data)];
		case 'tcx':
			return fromTCXData(data.data);
		default:
			return [];
	}
}

type ActivityFileDropProps = {
	allowMultiple?: boolean;
	onAddFiles(file: FileAndData[]): void;
	text?: string;
};

const ActivityFileDrop = (props: ActivityFileDropProps) => {
	const { onAddFiles, allowMultiple = true, text } = props;

	const addFiles = useCallback(
		(files: FileAndData[]) => {
			onAddFiles(files);
		},
		[onAddFiles]
	);

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			// Read all files as strings asynchronously
			const readers = acceptedFiles.map(async (f) => ({
				contents: await readFileAsText(f),
				file: f,
			}));
			const fileContents = await Promise.all(readers);

			// Convert to gpx
			const fileData = fileContents.map((f) => ({
				file: f.file,
				data: parseData(f.file.name.split('.').pop() ?? '', f.contents),
			}));
			addFiles(fileData);
		},
		[addFiles]
	);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: ['.gpx', '.tcx'],
		multiple: allowMultiple,
	});

	const textToUse =
		text ??
		`Drop ${
			allowMultiple ? 'GPX/TCX files' : 'a GPX/TCX file'
		} here, or click to use the file browser`;

	return (
		<section className="file-uploader">
			<div {...getRootProps({ className: 'dropzone' })}>
				<input {...getInputProps()} />
				<p>{textToUse}</p>
			</div>
		</section>
	);
};

export default ActivityFileDrop;
