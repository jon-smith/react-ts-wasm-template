import * as Comlink from 'comlink';

const generateHash = (s: string) =>
	s.split('').reduce((a, b) => {
		a = (a << 5) - a + b.charCodeAt(0);
		return a & a;
	}, 0);

const obj = {
	async runWebWorker(input: string) {
		// Waste some time
		await new Promise((r) => setTimeout(r, 500));
		if (!input) return '';
		const hash = generateHash(input);
		return String(hash);
	},
};

Comlink.expose(obj);

export type WorkerType = typeof obj;
