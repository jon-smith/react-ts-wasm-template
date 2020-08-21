export interface ActivityPoint {
	time: Date; // UTC

	location?: { lat: number; lon: number }; // Decimal degrees

	elevation?: number; // Metres

	distance?: number; // Metres

	temperature?: number; // Celcius
	cadence?: number; // SPM or RPM
	heartRate?: number; // bpm
	power?: number; // Watts
}
