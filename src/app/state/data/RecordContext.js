// record context
import { firebaseCurrentSubjectState } from "../../../firebase/client/firestore";
import {
	audioRecord,
	createAudioBuffer,
	getAudioInputDevices,
} from "../../utils/recorder";
import { startVibrate } from "../../utils/vibrate";
import createDataContext from "../createDataContext";
import toWav from "audiobuffer-to-wav";
import { firebaseSubjectAudioUpload } from "../../../firebase/client/storage";
// Initial State
const recordInitialState = {
	loading: false,

	audioInputStream: null,
	audioAnalyserNode: null,

	recordingNow: false,
	recordDone: false,
	audioFilename: "",
	audioUrl: "",

	uploadingNow: false,
	uploadDone: false,
	firebaseId: null,

	statusCode: "idle",
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

			recordingNow: false,
			recordDone: false,
			audioFilename: "",
			audioUrl: "",

			uploadDone: false,

			statusCode: "idle",
		};

		dispatch({
			type: "SET_REC_STATE",
			payload: payload,
		});
		wait(false);

		console.log("record context :: init");
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
			recordingNow: true,
			recordDone: false,
			audioFilename: "",
			audioUrl: "",

			uploadDone: false,

			statusCode: "recordingNow",
		};

		dispatch({ type: "SET_REC_STATE", payload: payload });

		return 0;
	};
};

const recordStopAction = (dispatch) => {
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return async ({ info }) => {
		if (!recorder) {
			console.error("record action log:: recorder not defined");
			return -1; // stop
		}

		wait(true);
		const { stopRecord } = recorder;

		const audio = await stopRecord().catch((e) => {
			console.error("audioRecord start error", e);
			return null;
		});

		wait(false);
		if (!audio) return -1; // stop

		startVibrate(70);

		// TODO: use `info` to create filename
		const deviceName = localStorage.getItem("deviceName") || "unknown";
		const fileName = `audio_${info.firebaseId}_${info.label}_${deviceName}_.wav`;

		const payload = {
			recordingNow: false,
			recordDone: true,
			audioFilename: fileName,
			audioUrl: audio.audioUrl,
			firebaseId: info.firebaseId,

			statusCode: "recordingDone",
		};

		dispatch({ type: "SET_REC_STATE", payload: payload });

		return 0;
	};
};

const recordUploadAction = (dispatch) => {
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return async (recordState) => {
		wait(true);

		const { audioFilename, audioUrl, firebaseId } = recordState;

		// Convert to wav format
		const audioBuffer = await createAudioBuffer(audioUrl);
		const wavBlob = toWav(audioBuffer);

		let payload = {
			uploadingNow: true,
			uploadDone: false,

			statusCode: "uploadingNow",
		};

		dispatch({ type: "SET_REC_STATE", payload: payload });

		const deviceName = localStorage.getItem("deviceName") || "unknown";

		await firebaseSubjectAudioUpload({
			folder: firebaseId,
			fileName: audioFilename,
			wavBlob: wavBlob,
			deviceName: deviceName,
		});

		wait(false);

		payload = {
			uploadingNow: false,
			uploadDone: true,

			statusCode: "uploadDone",
		};

		dispatch({ type: "SET_REC_STATE", payload: payload });

		URL.revokeObjectURL(audioUrl);
	};
};

const recordResetAction = (dispatch) => {
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return async () => {
		wait(true);

		dispatch({ type: "SET_REC_STATE", payload: { ...recordInitialState } });

		if (recorder) {
			recorder.stopRecord().catch(() => null);
			recorder = null;
		}

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
			recordResetAction,
			recordSetRemoteStateAction,
		},
		recordInitialState
	);
