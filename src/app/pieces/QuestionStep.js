import { Box } from "@mui/material";
import * as React from "react";
import QuestionCard from "../components/QuestionCard";

import { SubjectContext } from "../state/data/SubjectContext";

const QuestionStep = React.memo(function QuestionStep() {
	const {
		state: subjectState,
		subjectSetQuestionAction,
		subjectSubmitAction,
	} = React.useContext(SubjectContext);

	React.useLayoutEffect(() => {
		subjectSetQuestionAction();
	}, []);

	const handleSubmit = ({ answer, next }) => {
		subjectSubmitAction({
			question: subjectState.currentQuestion,
			answer,
			next,
			done: subjectState.questionDone,
		});
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			{subjectState.allQuestions && (
				<QuestionCard
					{...{
						question: subjectState.currentQuestion,
						handleSubmit,
						done: subjectState.questionDone,
					}}
				/>
			)}
		</Box>
	);
});

export default QuestionStep;
