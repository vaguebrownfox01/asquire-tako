import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { Box, Card, CardContent, IconButton } from "@mui/material";
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

const RecordCard = React.memo(function RecordCard() {
	return (
		<Card>
			<CardContent sx={classes.cardRoot}>
				<>
					<Box sx={classes.buttonRoot}>
						<IconButton size="large">
							<ArrowBackIosIcon />
						</IconButton>
						<IconButton size="large">
							<RadioButtonCheckedIcon color="secondary" />
						</IconButton>
						<IconButton size="large">
							<ArrowForwardIosIcon />
						</IconButton>
					</Box>
				</>
			</CardContent>
		</Card>
	);
});

export default RecordCard;
