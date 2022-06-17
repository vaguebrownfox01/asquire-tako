// user context
import createDataContext from "../createDataContext";
import { v4 as uuid } from "uuid";

import { questions } from "../../appconfig/content/questions";

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
];

// Initial State
const subjectInitialState = {
	loading: false,
	error: "",
	subjectName: "",
	subjectAge: "",
	subjectWeight: "",
	subjectHeight: "",
	subjectId: "x",
	infoDone: true,

	allQuestions: null,
	currentQuestion: {},
	previousQs: [],
	answers: {},
	questionDone: true,

	fields,
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
// Answer
// let a = {
// 	1: {
// 		question: "text",
// 		answer: "text",
// 	},
// };

// Reducer
const subjectReducer = (state, action) => {
	const { type, payload } = action;
	switch (type) {
		case "SET_LOADING":
			return { ...state, loading: payload };

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

const subjectSetQuestionAction = (dispatch) => {
	return () => {
		dispatch({ type: "SET_LOADING", payload: true });

		let payload = {
			allQuestions: questions,
			currentQuestion: questions[1],
		};

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

// Helpers
const formatFieldValue = ({ field, value }) => {
	switch (field) {
		case "subjectName":
			let name = value.replace(/[^a-zA-Z +]/g, "");
			return { f: field, v: name };
		default:
			return { f: field, v: value };
	}
};

const getId = (name = "") => {
	let id = name.replace(/[^a-zA-Z]/g, "").toLowerCase();
	return `${id}-${uuid().slice(0, 8)}`;
};

// Export
export const { Context, Provider } = createDataContext(
	subjectReducer,
	{
		subjectLoadAction,
		subjectInfoAction,
		subjectSetQuestionAction,
		subjectSubmitAction,
	},
	subjectInitialState
);
