import { db } from "../creds/client";

import { doc, updateDoc } from "firebase/firestore";
import { STIM_DOC, SUB_STATE, SURVEY_DOC } from "../creds/setup";

export const currentSubQuery = doc(db, SUB_STATE);
export const questionsQuery = doc(db, "/content/survey");
export const stimulusQuery = doc(db, STIM_DOC);

export const firebaseCurrentSubjectState = async ({ subjectState }) => {
	await updateDoc(doc(db, SUB_STATE), subjectState).catch((err) => {
		console.log("fb firestore error :: ", err);
		return null;
	});
};
