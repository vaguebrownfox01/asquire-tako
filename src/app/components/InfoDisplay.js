import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const InfoDisplay = React.memo(function InfoDisplay({ info }) {
	const { subjectName, subjectGender, subjectAge, questionDone } = info;

	const done = questionDone ? "done" : "not done";
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

					<Typography variant="caption">{`Questionnaire: ${done}`}</Typography>
				</CardContent>
			)}
		</Card>
	);
});

export default InfoDisplay;
