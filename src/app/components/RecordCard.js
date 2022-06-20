import PrevStimIcon from "@mui/icons-material/ArrowBackIos";
import NextStimIcon from "@mui/icons-material/ArrowForwardIos";
import RecordStartIcon from "@mui/icons-material/RadioButtonChecked";
import { Box, Card, CardContent, IconButton } from "@mui/material";
import RecordStopIcon from "@mui/icons-material/StopCircle";
import * as React from "react";

const classes = {
	cardRoot: (t) => ({ margin: t.spacing("auto", 2, 0) }),
	buttonRoot: (t) => ({
		display: "flex",
		justifyContent: "space-around",
		marginTop: t.spacing(2),
		transform: "scale(1.2)",
	}),
};

const RecordCard = React.memo(function RecordCard({
	handleRecord,
	currSubState,
}) {
	const { isRecording } = currSubState;

	const [action, setAction] = React.useState("start");

	React.useEffect(() => {
		setAction(() => (isRecording ? "stop" : "start"));
	}, [isRecording]);

	return (
		<Card>
			<CardContent sx={classes.cardRoot}>
				<>
					<Box sx={classes.buttonRoot}>
						<IconButton>
							<PrevStimIcon />
						</IconButton>

						<IconButton onClick={handleRecord.bind({ action })}>
							{!isRecording ? (
								<RecordStartIcon color="secondary" />
							) : (
								<RecordStopIcon color="secondary" />
							)}
						</IconButton>

						<IconButton>
							<NextStimIcon />
						</IconButton>
					</Box>
				</>
			</CardContent>
		</Card>
	);
});

export default RecordCard;
