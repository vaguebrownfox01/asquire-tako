import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { Box, Card, CardContent, IconButton } from "@mui/material";
import StopCircleIcon from "@mui/icons-material/StopCircle";
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

const RecordCard = React.memo(function RecordCard({ handleRecord }) {
	return (
		<Card>
			<CardContent sx={classes.cardRoot}>
				<>
					<Box sx={classes.buttonRoot}>
						<IconButton>
							<ArrowBackIosIcon />
						</IconButton>

						<IconButton
							onClick={handleRecord.bind({ action: "start" })}
						>
							<RadioButtonCheckedIcon color="secondary" />
						</IconButton>
						<IconButton
							onClick={handleRecord.bind({ action: "stop" })}
						>
							<StopCircleIcon color="secondary" />
						</IconButton>

						<IconButton>
							<ArrowForwardIosIcon />
						</IconButton>
					</Box>
				</>
			</CardContent>
		</Card>
	);
});

export default RecordCard;
