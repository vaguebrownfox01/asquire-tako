// user context
import createDataContext from "../createDataContext";
import { v4 as uuid } from "uuid";

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
	subjectId: "",
	fields,
};

// Subjects Attributes
const typicalSubject = {
	subjectName: "",
	subjectId: "",
};

// Reducer
const subjectReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, loading: action.payload };
		case "SET_INFO":
			return { ...state, [action.payload.field]: action.payload.value };
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

const subjectInfoAction = (dispatch) => {
	return ({ field, value }) => {
		dispatch({ type: "SET_LOADING", payload: true });

		let { f, v } = formatFieldValue({ field, value });

		console.log({ f, v });

		dispatch({ type: "SET_INFO", payload: { field: f, value: v } });

		dispatch({ type: "SET_LOADING", payload: false });
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
	},
	subjectInitialState
);
