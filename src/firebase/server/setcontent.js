const { server_db } = require("../creds/server");
const {
	SURVEY_DOC,
	SURVEY_PATH,
	STIM_DOC,
	STIMS_PATH,
} = require("../creds/setup");

const setSurveyQuestions = async () => {
	const questionRef = server_db.doc(SURVEY_DOC);
	const { questions } = require(SURVEY_PATH);

	if (questions) {
		await questionRef.set(questions);
		console.log("Done uploading questions");
	} else {
		console.log("Failed to upload questions");
	}
};

const setStims = async () => {
	const stimRef = server_db.doc(STIM_DOC);
	const { stimulus } = require(STIMS_PATH);

	if (stimulus) {
		await stimRef.set(stimulus);
		console.log("Done uploading stims", stimulus);
	} else {
		console.log("Failed uploading stims");
	}
};

const setContent = () => {
	setSurveyQuestions();
	setStims();
};

setContent();
