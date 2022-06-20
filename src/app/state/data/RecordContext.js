// record context
import {
	audioRecord,
	getAudioInputDevices,
	getAudioOutputDevices,
} from "../../utils/recorder";
import { startVibrate } from "../../utils/vibrate";
import createDataContext from "../createDataContext";
import { batch } from "react-redux";
// Initial State
const recordInitialState = {
	loading: false,

	isRecording: false,
	isPlaying: false,
	isPlayingInst: false,
	recDone: false,
	plyDone: false,
	playUrl: "",
	audioBuffer: [],
};

// Recorder instance
let recorder = null;

// Interval timeout
let interval = null;

// Reducer
const recordReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, loading: action.payload };
		default:
			return state;
	}
};

// Actions

const recordLoadAction = (dispatch) => {
	return () => {
		dispatch({ type: "SET_LOADING", payload: true });

		console.log("record action log");

		dispatch({ type: "SET_LOADING", payload: false });
	};
};

const recordGetDevicesAction = (dispatch) => {
	return async () => {
		dispatch({ type: "SET_LOADING", payload: true });

		const {
			audioDevices: inputDevices,
			audioInputStream,
			analyserNode,
		} = await getAudioInputDevices();
		const outputDevices = await getAudioOutputDevices();

		dispatch({
			type: "GET_DEVICES",
			payload: {
				inputDevices,
				outputDevices,
				audioInputStream,
				analyserNode,
			},
		});

		console.log("record context ::get devices");

		dispatch({ type: "SET_LOADING", payload: false });
	};
};

const recordStartAction = (dispatch) => {
	return async (inputStream) => {
		dispatch({ type: "SET_LOADING", payload: true });

		if (!recorder) {
			recorder = await audioRecord(inputStream).catch((e) => {
				console.log("audioRecord error", e);
				return null;
			});
		}
		if (!recorder) {
			return null;
		}
		const isRecStart = await recorder
			.startRecord()
			.then((e) => {
				startVibrate(70);
				return e;
			})
			.catch((e) => {
				console.log("audioRecord start error", e);
				return null;
			});
		console.log("record action log:: start record", isRecStart);

		if (isRecStart) {
			console.log("record action log:: start record");
			batch(() => {
				dispatch({ type: "SET_REC_DONE", payload: false });
				dispatch({ type: "SET_REC_STATE", payload: true });
				dispatch({ type: "SET_PLY_STATE", payload: false });
				dispatch({ type: "SECONDS", payload: "reset" });
			});

			interval = setInterval(() => {
				dispatch({ type: "SECONDS", payload: "up" });
			}, 1000);
		} else {
			dispatch({ type: "SET_REC_STATE", payload: false });
		}

		dispatch({ type: "SET_LOADING", payload: false });
	};
};

let audio = null;

const recordStopAction = (dispatch) => {
	return async () => {
		dispatch({ type: "SET_LOADING", payload: true });

		if (!recorder) {
			console.log("record action log:: recorder not defined");
			return null;
		}

		audio = await recorder
			.stopRecord()
			.then((e) => {
				startVibrate(70);
				return e;
			})
			.catch(() => null);

		if (audio) {
			batch(() => {
				dispatch({ type: "SET_REC_STATE", payload: false });
				dispatch({ type: "SET_REC_DONE", payload: true });
				dispatch({ type: "SET_PLY_URL", payload: audio.audioUrl });
			});

			clearInterval(interval);
		}

		dispatch({ type: "SET_LOADING", payload: false });

		return audio;
	};
};

// Export
export const { Context: RecordContext, Provider: RecordProvider } =
	createDataContext(
		recordReducer,
		{
			recordLoadAction,
		},
		recordInitialState
	);
