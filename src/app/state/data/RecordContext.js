// record context
import createDataContext from "../createDataContext";

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

// Export
export const { Context, Provider } = createDataContext(
	recordReducer,
	{
		recordLoadAction,
	},
	recordInitialState
);
