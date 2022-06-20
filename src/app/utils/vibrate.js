export const startVibrate = (duration) => {
	try {
		navigator.vibrate(duration);
	} catch (_) {
		console.log("device doesn't support vibrate");
	}
};
