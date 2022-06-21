// user context
import { v4 as uuid } from "uuid";
import createDataContext from "../createDataContext";

import {
	firebaseCurrentSubjectState,
	firebaseSubjectAdd,
} from "../../../firebase/client/firestore";

export const fields = [
	{
		id: "Name",
		label: "Name",
		type: "text",
		field: "subjectName",
	},
	{
		id: "Age",
		label: "Age",
		type: "number",
		field: "subjectAge",
	},
	{
		id: "Height",
		label: "Height",
		type: "number",
		field: "subjectHeight",
	},
	{
		id: "Weight",
		label: "Weight",
		type: "number",
		field: "subjectWeight",
	},
	{
		id: "Gender",
		label: "Gender",
		type: "menu",
		field: "subjectGender",
	},
];

const genders = [
	{ label: "Select", value: "" },
	{ label: "Male", value: "Male" },
	{ label: "Female", value: "Female" },
	{ label: "Other", value: "Other" },
];

// Initial State
const subjectInitialState = {
	loading: false,

	firebaseId: null,
	subjectName: "",
	subjectAge: "",
	subjectWeight: "",
	subjectHeight: "",
	subjectGender: "",
	subjectId: "x",
	infoDone: false,

	allQuestions: null,
	currentQuestion: {
		qno: 1,
		question: "Question?",
		options: ["Option 1", "Option 2"],
		nextQnos: [2], // Next question
	},
	answeredQs: [],
	questionDone: false,

	allStims: null,
	stimCount: 0,
	stimLength: 0,
	currentStim: {
		label: "sents",
		tag: "sent",
		skipScore: 1,
		imageLink: "",
		audioDescriptionLink: null,
		description: "Task Description",
	},
	stimsDone: false,

	isRecording: false,
	recDone: false,

	fields,
	genders,
};

// Reducer
const subjectReducer = (state, action) => {
	const { type, payload } = action;
	switch (type) {
		case "SET_LOADING":
			return { ...state, loading: payload };

		case "SET_ALL":
			return { ...state, ...payload };

		case "SET_INFO":
			const { field, value } = payload;
			return { ...state, [field]: value };

		case "SET_STIMS":
			return { ...state, ...payload };

		case "SET_QUESTION":
			return { ...state, ...payload };

		case "SET_QUESTION_NEXT":
			const { nextQno, question } = payload;
			const _qdone = nextQno === -1;

			return {
				...state,
				questionDone: _qdone,
				answeredQs: [...state.answeredQs, question],
				currentQuestion:
					state.allQuestions[nextQno] || state.currentQuestion,
			};

		case "SET_QUESTION_PREV":
			let _answeredQs = [...state.answeredQs];
			if (_answeredQs.length < 1) {
				return { ...state, questionDone: false };
			}

			const _currentQuestion = _answeredQs.pop();
			return {
				...state,
				questionDone: false,
				answeredQs: [..._answeredQs],
				currentQuestion: _currentQuestion,
			};

		default:
			return state;
	}
};

// Actions
const subjectLoadAction = (dispatch) => {
	return () => {
		dispatch({ type: "SET_LOADING", payload: true });

		console.log("user action log");

		dispatch({ type: "SET_LOADING", payload: false });
	};
};

const subjectSetAllInfoAction = (dispatch) => {
	return ({ subjectState, action }) => {
		dispatch({ type: "SET_LOADING", payload: true });

		switch (action) {
			case "reset":
				dispatch({ type: "SET_ALL", payload: subjectInitialState });

				break;

			default:
				dispatch({ type: "SET_ALL", payload: subjectState });
				break;
		}

		dispatch({ type: "SET_LOADING", payload: false });
	};
};

const subjectSetQuestionAction = (dispatch) => {
	return ({ allQuestions }) => {
		dispatch({ type: "SET_LOADING", payload: true });

		let payload = {};
		if (allQuestions) {
			payload = {
				allQuestions: allQuestions,
				currentQuestion: allQuestions[1],
				// answeredQs: [],
			};
		}

		dispatch({ type: "SET_QUESTION", payload: payload });

		dispatch({ type: "SET_LOADING", payload: false });
	};
};

const subjectSetStimsAction = (dispatch) => {
	return ({ allStims }) => {
		dispatch({ type: "SET_LOADING", payload: true });

		let payload = {};
		if (allStims) {
			payload = {
				allStims: allStims,
				currentStim: allStims[0],
				stimCount: 0,
				stimLength: allStims.length,
			};
		}

		dispatch({ type: "SET_STIMS", payload: payload });

		dispatch({ type: "SET_LOADING", payload: false });
	};
};

const subjectInfoAction = (dispatch) => {
	return ({ field, value }) => {
		let { f, v } = formatFieldValue({ field, value });

		dispatch({ type: "SET_INFO", payload: { field: f, value: v } });
	};
};

const subjectSubmitAction = (dispatch) => {
	return ({ question, answer, next }) => {
		if (next) {
			let nextQno = null;
			if (
				question.nextQnos.length === 1 ||
				answer.answer === question.options[0]
			) {
				nextQno = question.nextQnos[0];
			} else {
				nextQno = question.nextQnos[1];
			}

			let payload = {
				nextQno,
				question: { ...question, answer: answer.answer },
			};

			dispatch({ type: "SET_QUESTION_NEXT", payload });
		} else {
			dispatch({ type: "SET_QUESTION_PREV", payload: null });
		}
	};
};

const subjectFirebaseUpdateAction = (dispatch) => {
	return async ({ subjectState, action, payload }) => {
		dispatch({ type: "SET_LOADING", payload: true });

		let rState = {};
		switch (action) {
			case "start":
				rState = {
					isRecording: true,
					recDone: false,
					audioFilename: "audio.wav",
				};
				break;
			case "stop":
				rState = {
					isRecording: false,
					recDone: true,
					audioFilename: "audio.wav",
					audioUrl: "",
				};
				break;

			case "load":
				rState = { ...payload };
				break;

			case "prev":
				break;
			case "update":
				rState = await firebaseSubjectAdd({ subjectState });
				break;
			default:
				break;
		}

		firebaseCurrentSubjectState({
			subjectState: { ...subjectState, ...rState },
		});

		dispatch({ type: "SET_LOADING", payload: false });
	};
};

// Helpers
const formatFieldValue = ({ field, value }) => {
	switch (field) {
		case "subjectName":
			let name = value.replace(/[^a-zA-Z +]/g, "");
			return { f: field, v: name };
		case "subjectAge":
			let age = Math.abs(parseInt(value) || 0) % 100;
			return { f: field, v: `${age}` };
		case "subjectHeight":
			let height = Math.abs(parseInt(value) || 0) % 300;
			return { f: field, v: `${height}` };
		case "subjectWeight":
			let weight = Math.abs(parseInt(value) || 0) % 200;
			return { f: field, v: `${weight}` };

		default:
			return { f: field, v: value };
	}
};

const getId = (name = "") => {
	let id = name.replace(/[a-zA-Z]/g, "").toLowerCase();
	return `${id}-${uuid().slice(0, 8)}`;
};

// Export
const { Context: SubjectContext, Provider: SubjectProvider } =
	createDataContext(
		subjectReducer,
		{
			subjectLoadAction,
			subjectSetAllInfoAction,
			subjectInfoAction,
			subjectSetQuestionAction,
			subjectSubmitAction,
			subjectSetStimsAction,

			subjectFirebaseUpdateAction,
		},
		subjectInitialState
	);

export { SubjectProvider, SubjectContext };
