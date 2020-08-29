import * as Comlink from 'comlink';
import generateZalgo from 'library/utils/zalgo-gen';

const obj = {
	async runWebWorker(input: string) {
		// Waste some time
		await new Promise((r) => setTimeout(r, 500));
		if (!input) return '';
		const hash = generateZalgo(input);
		return String(hash);
	},
};

Comlink.expose(obj);

export type WorkerType = typeof obj;
