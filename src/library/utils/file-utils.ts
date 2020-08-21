export const readFileAsText = (inputFile: File) => {
	const fileReader = new FileReader();

	return new Promise<string>((resolve, reject) => {
		fileReader.onerror = () => {
			fileReader.abort();
			reject(new DOMException(`Failed to read ${inputFile.name}`));
		};

		fileReader.onload = () => {
			resolve(fileReader.result as string);
		};

		fileReader.readAsText(inputFile);
	});
};
