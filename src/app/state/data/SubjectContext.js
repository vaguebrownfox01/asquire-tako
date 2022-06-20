// user context
import createDataContext from "../createDataContext";
import { parse, v4 as uuid } from "uuid";

// import { questions } from "../../appconfig/content/questions";
import { firebaseCurrentSubjectState } from "../../../firebase/client/firestore";

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
	subjectName: "",
	subjectAge: "",
	subjectWeight: "",
	subjectHeight: "",
	subjectGender: "",
	subjectId: "x",
	infoDone: false,

	allQuestions: null,
	currentQuestion: {},
	previousQs: [],
	answers: {},
	questionDone: false,

	isRecording: false,
	recDone: false,

	fields,
	genders,
};

// Sample Question
// let qs = {
// 	1: {
// 		qno: 1,
// 		question: "What is your smoking status?",
// 		options: ["Ex-smoker(1 year)", "Current smoker", "Non-smoker"],
// 		nextQnos: [2],
// 	},
// };

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

		case "SET_QUESTION":
			return { ...state, ...payload };

		case "SET_QUESTION_NEXT":
			const { nextQno, question } = payload;
			const _qdone = nextQno === -1;

			return {
				...state,
				questionDone: _qdone,
				previousQs: [...state.previousQs, question],
				currentQuestion:
					state.allQuestions[nextQno] || state.currentQuestion,
			};

		case "SET_QUESTION_PREV":
			let _previousQs = [...state.previousQs];
			if (_previousQs.length < 1) {
				return { ...state, questionDone: false };
			}

			const _currentQuestion = _previousQs.pop();
			return {
				...state,
				questionDone: false,
				previousQs: [..._previousQs],
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
	return ({ subjectState }) => {
		dispatch({ type: "SET_LOADING", payload: true });

		dispatch({ type: "SET_ALL", payload: subjectState });

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
				// previousQs: [],
			};
		}

		dispatch({ type: "SET_QUESTION", payload: payload });

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
	return ({ subjectState }) => {
		dispatch({ type: "SET_LOADING", payload: true });

		firebaseCurrentSubjectState({ subjectState });

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

			subjectFirebaseUpdateAction,
		},
		subjectInitialState
	);

export { SubjectProvider, SubjectContext };
