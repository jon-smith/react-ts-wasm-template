// worker-caller mock which avoids using web-workers (for Jest)

export async function runWebWorker(input: string) {
	return input;
}
