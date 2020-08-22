export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};

export type AwaitedType<T> = T extends {
	then(onfulfilled?: (value: infer U) => unknown): unknown;
}
	? U
	: T;
