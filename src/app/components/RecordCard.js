import PrevStimIcon from "@mui/icons-material/ArrowBackIos";
import NextStimIcon from "@mui/icons-material/ArrowForwardIos";
import RecordStartIcon from "@mui/icons-material/RadioButtonChecked";
import RecordStopIcon from "@mui/icons-material/StopCircle";
import { Box, Card, CardContent, IconButton } from "@mui/material";
import { green } from "@mui/material/colors";
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
	handleStimChange,
}) {
	const { recordOn } = currSubState;

	const [action, setAction] = React.useState("start");

	React.useEffect(() => {
		setAction(() => (recordOn ? "stop" : "start"));
	}, [recordOn]);

	return (
		<Card>
			<CardContent sx={classes.cardRoot}>
				<>
					<Box sx={classes.buttonRoot}>
						<IconButton
							disabled={recordOn}
							onClick={handleStimChange.bind({ action: "prev" })}
						>
							<PrevStimIcon />
						</IconButton>

						<IconButton onClick={handleRecord.bind({ action })}>
							{!recordOn ? (
								<RecordStartIcon color="secondary" />
							) : (
								<RecordStopIcon color="secondary" />
							)}
						</IconButton>

						<IconButton
							disabled={recordOn}
							sx={{ color: green[400] }}
							onClick={handleStimChange.bind({ action: "next" })}
						>
							<NextStimIcon />
						</IconButton>
					</Box>
				</>
			</CardContent>
		</Card>
	);
});

export default RecordCard;
