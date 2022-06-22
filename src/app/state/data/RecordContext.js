// record context
import { firebaseCurrentSubjectState } from "../../../firebase/client/firestore";
import {
	audioRecord,
	createAudioBuffer,
	getAudioInputDevices,
} from "../../utils/recorder";
import { startVibrate } from "../../utils/vibrate";
import createDataContext from "../createDataContext";
import { toWav } from "audiobuffer-to-wav";
// Initial State
const recordInitialState = {
	loading: false,

	audioInputStream: null,
	audioAnalyserNode: null,

	recordDone: false,
	audioFilename: "",
	audioUrl: "",
};

/**
 * Recorder instance: { startRecord, stopRecord } */
let recorder = null;

/**
 * Reducer
 *  */
const recordReducer = (state, action) => {
	const { type, payload } = action;
	switch (type) {
		case "SET_LOADING":
			return { ...state, loading: payload };

		case "SET_ERROR":
			return { ...state, error: payload };

		case "SET_STREAMS":
			return { ...state, ...payload };

		case "SET_REC_STATE":
			return { ...state, ...payload };

		default:
			return state;
	}
};

/**
 * Actions
 *  */
const recordLoadAction = (dispatch) => {
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return () => {
		wait(false);
	};
};

const recordInitAction = (dispatch) => {
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return async () => {
		wait(true);
		const { audioInputStream, audioAnalyserNode } =
			await getAudioInputDevices();

		const payload = {
			audioInputStream,
			audioAnalyserNode,
			recordDone: false,
			audioFilename: "",
			audioUrl: "",
		};

		dispatch({
			type: "GET_DEVICES",
			payload: payload,
		});
		wait(false);

		console.log("record context ::get devices");
	};
};

const recordStartAction = (dispatch) => {
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return async ({ audioInputStream }) => {
		if (!recorder) {
			wait(true);
			recorder = await audioRecord(audioInputStream).catch((e) => {
				console.log("audioRecord error", e);
				return null;
			});
			wait(false);
			if (!recorder) return -1; // stop
		}

		wait(true);
		const { startRecord } = recorder;

		const recStart = await startRecord().catch((e) => {
			console.error("audioRecord start error", e);
			return null;
		});
		wait(false);
		if (!recStart) return -1; // stop

		startVibrate(70);

		let payload = {
			recordDone: false,
			audioFilename: "",
			audioUrl: "",
		};

		dispatch({ type: "SET_REC_STATE", payload: payload });

		return 0;
	};
};

let audio = null;

const recordStopAction = (dispatch) => {
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return async ({ stim }) => {
		if (!recorder) {
			console.error("record action log:: recorder not defined");
			return -1; // stop
		}

		wait(true);
		const { stopRecord } = recorder;

		audio = await stopRecord().catch((e) => {
			console.error("audioRecord start error", e);
			return null;
		});

		wait(false);
		if (!audio) return -1; // stop

		startVibrate(70);

		// TODO: use `stim` to create filename

		const payload = {
			recordDone: true,
			audioFilename: "audio.wav",
			audioUrl: audio.audioUrl,
		};

		dispatch({ type: "SET_REC_STATE", payload: payload });

		return 0;
	};
};

const recordUploadAction = (dispatch) => {
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return async ({ subjectState }) => {
		if (!audio) {
			console.error("record action log:: audio not defined");
			throw new Error("Upload error");
		}
		wait(true);

		const { audioUrl } = audio;

		// Convert to wav format
		const audioBuffer = await createAudioBuffer(audioUrl);
		const wavBlob = toWav(audioBuffer);

		wait(false);
	};
};

const recordSetRemoteStateAction = (dispatch) => {
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return async ({ subjectState, recordState }) => {
		wait(true);

		await firebaseCurrentSubjectState({
			subjectState: { ...subjectState, ...recordState },
		});

		wait(false);
	};
};

// Export
export const { Context: RecordContext, Provider: RecordProvider } =
	createDataContext(
		recordReducer,
		{
			recordLoadAction,
			recordInitAction,
			recordStartAction,
			recordStopAction,
			recordUploadAction,
			recordSetRemoteStateAction,
		},
		recordInitialState
	);
