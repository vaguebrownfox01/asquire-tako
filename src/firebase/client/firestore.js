import { db } from "../creds/client";

import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { SUB_STATE } from "../creds/setup";

export const currentSubQuery = doc(db, SUB_STATE);

export const firebaseCurrentSubjectState = async ({ subjectState }) => {
	await updateDoc(doc(db, SUB_STATE), subjectState).catch((err) => {
		console.log("fb firestore error :: ", err);
		return null;
	});
};
