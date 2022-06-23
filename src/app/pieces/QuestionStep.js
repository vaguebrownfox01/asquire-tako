import { Box } from "@mui/material";
import * as React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { questionsQuery } from "../../firebase/client/firestore";
import Wait from "../components/Progress";
import QuestionCard from "../components/QuestionCard";

import { SubjectContext } from "../state/data/SubjectContext";

const QuestionStep = React.memo(function QuestionStep() {
	const [allQuestions, loading] = useDocumentData(questionsQuery);

	const {
		state: subjectState,
		subjectSetQuestionAction,
		subjectSubmitAction,
	} = React.useContext(SubjectContext);

	React.useEffect(() => {
		allQuestions && subjectSetQuestionAction({ allQuestions });
	}, [allQuestions, loading]);

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
			{allQuestions ? (
				<QuestionCard
					{...{
						question: subjectState.currentQuestion,
						handleSubmit,
						done: subjectState.questionDone,
					}}
				/>
			) : (
				<Wait />
			)}
		</Box>
	);
});

export default QuestionStep;
