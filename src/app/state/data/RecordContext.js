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
import { firebaseSubjectAudioUpload } from "../../../firebase/client/storage";
// Initial State
const recordInitialState = {
	loading: false,

	audioInputStream: null,
	audioAnalyserNode: null,

	recodingNow: false,
	recordDone: false,
	audioFilename: "",
	audioUrl: "",

	uploadingNow: false,
	uploadDone: false,
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

			recodingNow: false,
			recordDone: false,
			audioFilename: "",
			audioUrl: "",
		};

		dispatch({
			type: "SET_REC_STATE",
			payload: payload,
		});
		wait(false);

		console.log("record context ::get devices");
	};
};

const recordStartAction = (dispatch) => {
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return async ({ audioInputStream, subjectState }) => {
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
			recodingNow: true,
			recordDone: false,
			audioFilename: "",
			audioUrl: "",
		};

		dispatch({ type: "SET_REC_STATE", payload: payload });

		return 0;
	};
};

const recordStopAction = (dispatch) => {
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return async ({ stim }) => {
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

		// TODO: use `stim` to create filename

		const fileName = `audio${stim.label}.wav`;

		const payload = {
			recodingNow: false,
			recordDone: true,
			audioFilename: fileName,
			audioUrl: audio.audioUrl,
		};

		dispatch({ type: "SET_REC_STATE", payload: payload });

		return 0;
	};
};

const recordUploadAction = (dispatch) => {
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return async ({ recordState }) => {
		wait(true);

		const { audioFilename, audioUrl } = recordState;

		// Convert to wav format
		const audioBuffer = await createAudioBuffer(audioUrl);
		const wavBlob = toWav(audioBuffer);

		let payload = {
			uploadingNow: true,
			uploadDone: false,
		};

		dispatch({ type: "SET_REC_STATE", payload: payload });

		await firebaseSubjectAudioUpload({
			fileName: audioFilename,
			wavBlob: wavBlob,
		});

		wait(false);

		payload = {
			uploadingNow: false,
			uploadDone: true,
		};

		dispatch({ type: "SET_REC_STATE", payload: payload });

		URL.revokeObjectURL(audioUrl);
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
