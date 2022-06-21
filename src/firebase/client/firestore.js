import { v4 as uuid } from "uuid";
import { db } from "../creds/client";

import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import {
	STIM_DOC,
	SUBJECT_COLLECTION,
	SUB_STATE,
	SURVEY_DOC,
} from "../creds/setup";

export const currentSubQuery = doc(db, SUB_STATE);
export const questionsQuery = doc(db, SURVEY_DOC);
export const stimulusQuery = doc(db, STIM_DOC);
export const subjectsQuery = collection(db, SUBJECT_COLLECTION);

export const firebaseCurrentSubjectState = async ({ subjectState }) => {
	await updateDoc(doc(db, SUB_STATE), subjectState).catch((err) => {
		console.log("fb firestore error :: ", err);
		return null;
	});
};

export const firebaseSubjectAdd = async ({ subjectState }) => {
	const id = subjectState.firebaseId || getId(subjectState.subjectName);
	const docPath = `/${SUBJECT_COLLECTION}/${id}`;

	const subjectStateWid = { ...subjectState, firebaseId: id };
	await setDoc(doc(db, docPath), subjectStateWid).catch((err) => {
		console.log("fb firestore error :: ", err);
		return null;
	});
	return subjectStateWid;
};

const getId = (name = "") => {
	let id = name.toLowerCase().replace(/[^a-zA-Z]/g, "");
	return `${id}-${uuid().slice(0, 8)}`;
};
