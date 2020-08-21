import { useState, useCallback } from 'react';
import { useThrottle } from '@react-hook/throttle';

// The same as useState but with an additional throttle value that is updated only as often as the supplied fps value
function useThrottledState<T>(initialValue: T, fps: number, leading?: boolean) {
	const [throttledValue, setThrottledValue] = useThrottle(initialValue, fps, leading);
	const [immediateValue, setImmediateValue] = useState(initialValue);
	const setValue = useCallback(
		(value: T) => {
			setImmediateValue(value);
			setThrottledValue(value);
		},
		[setThrottledValue]
	);

	return [immediateValue, throttledValue, setValue] as const;
}

export default useThrottledState;
