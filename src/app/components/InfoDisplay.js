import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import * as React from "react";

const InfoDisplay = React.memo(function InfoDisplay({ info }) {
	const {
		subjectName,
		subjectGender,
		subjectAge,
		questionDone,
		recordOn,
		currentStim,
	} = info;

	const doneQ = questionDone ? "done" : "not done";
	const doneR = recordOn ? "recording" : "not recording";
	return (
		<Card sx={{ marginBottom: 1 }}>
			{subjectName && (
				<CardContent sx={{ marginLeft: 2 }}>
					<Typography variant="h5" component="div">
						{subjectName}
					</Typography>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
						{`${subjectGender}, ${subjectAge}y`}
					</Typography>

					<Typography variant="caption">{`Questionnaire: ${doneQ}`}</Typography>
					<br />
					<Typography variant="caption">{`Recording state: ${doneR}`}</Typography>
					<br />
					<Typography variant="caption">{`Current stimulus: ${currentStim.label}`}</Typography>
				</CardContent>
			)}
		</Card>
	);
});

export default InfoDisplay;
