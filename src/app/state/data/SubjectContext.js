// user context
import createDataContext from "../createDataContext";

import {
	firebaseCurrentSubjectState,
	firebaseSubjectAdd,
} from "../../../firebase/client/firestore";

const fields = [
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
		loading: true,
		qno: 1,
		question: "Question?",
		options: ["Option 1", "Option 2"],
		nextQnos: [2], // Next question
	},
	answeredQs: [],
	questionDone: false,

	allStims: null,
	stimIndex: 0,
	stimCount: 0,
	stimLength: 0,
	stimTotalCount: 0,
	currentStim: {
		loading: true,
		label: "sents",
		tag: "sent",
		skipScore: 1,
		imageLink: "",
		audioDescriptionLink: null,
		description: "Task Description",
	},
	stimsDone: false,

	recordOn: false,
	recordUpload: false,

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
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return () => {
		wait(true);

		console.log("user action log");

		wait(false);
	};
};

const subjectSetAllInfoAction = (dispatch) => {
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return ({ subjectState, action }) => {
		wait(true);

		switch (action) {
			case "reset":
				dispatch({ type: "SET_ALL", payload: subjectInitialState });

				break;

			default:
				dispatch({ type: "SET_ALL", payload: subjectState });
				break;
		}

		wait(false);
	};
};

const subjectSetQuestionAction = (dispatch) => {
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return ({ allQuestions }) => {
		wait(true);

		let payload = {};
		if (allQuestions) {
			payload = {
				allQuestions: allQuestions,
				currentQuestion: allQuestions[1],
			};
		}

		dispatch({ type: "SET_QUESTION", payload: payload });

		wait(false);
	};
};

const subjectSetStimsAction = (dispatch) => {
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return ({ allStims }) => {
		wait(true);

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

		wait(false);
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
	const wait = (a) => dispatch({ type: "SET_LOADING", payload: a });
	return async ({ subjectState, action, payload }) => {
		wait(true);

		let rState = {};
		switch (action) {
			case "start":
				rState = {
					recordOn: true,
				};
				break;
			case "stop":
				rState = {
					recordOn: false,
				};
				break;

			case "load":
				rState = { ...payload };
				break;

			case "update":
				rState = await firebaseSubjectAdd({ subjectState });
				break;
			default:
				break;
		}

		await firebaseCurrentSubjectState({
			subjectState: { ...subjectState, ...rState },
		});

		wait(false);
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
