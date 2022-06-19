import * as React from "react";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const classes = {
	cardRoot: (t) => ({ margin: t.spacing("auto", 2, 0) }),
	buttonRoot: (t) => ({
		display: "flex",
		justifyContent: "space-around",
		marginTop: t.spacing(2),
	}),
};
const RecordCard = React.memo(function RecordCard() {
	return (
		<Card>
			<CardContent sx={classes.cardRoot}>
				<Typography
					sx={{ textAlign: "center" }}
					variant="h6"
					component="div"
					gutterBottom
				>
					How are you?
				</Typography>

				<Box sx={classes.buttonRoot}>
					<IconButton>
						<ArrowBackIosIcon />
					</IconButton>
					<IconButton>
						<RadioButtonCheckedIcon color="secondary" />
					</IconButton>
					<IconButton>
						<ArrowForwardIosIcon />
					</IconButton>
				</Box>
			</CardContent>
		</Card>
	);
});

export default RecordCard;
