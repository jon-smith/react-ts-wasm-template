export const formatSecondsAsHHMMSS = (seconds: number): string => {
	const roundedSeconds = Math.round(seconds);
	if (roundedSeconds < 60) return String(seconds);

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const remainingSecondsStr =
		remainingSeconds < 10 ? `0${remainingSeconds}` : String(remainingSeconds);

	if (minutes < 60) return `${minutes}:${remainingSecondsStr}`;

	const hours = Math.floor(minutes / 60);

	const remainingMinutes = minutes % 60;
	const remainingMinutesStr =
		remainingMinutes < 10 ? `0${remainingMinutes}` : String(remainingMinutes);

	return `${hours}:${remainingMinutesStr}:${remainingSecondsStr}`;
};

export const formatSecondsAsTimeWords = (seconds: number): string => {
	const roundedSeconds = Math.round(seconds);
	if (roundedSeconds < 60) return `${seconds} s`;

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const remainingSecondsStr =
		remainingSeconds === 0 ? `` : ` ${remainingSeconds < 10 ? `0` : ``}${remainingSeconds} s`;

	if (minutes < 60) return `${minutes} m${remainingSecondsStr}`;

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	const remainingMinutesStr =
		remainingMinutes === 0 ? `` : ` ${remainingMinutes < 10 ? `0` : ``}${remainingMinutes} s`;

	return `${hours} h${remainingMinutesStr}${remainingSecondsStr}`;
};
