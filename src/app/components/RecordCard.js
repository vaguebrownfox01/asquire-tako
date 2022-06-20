import * as React from "react";
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	IconButton,
	Typography,
} from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

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
					<Typography
						sx={{ textAlign: "center" }}
						variant="h6"
						component="div"
						gutterBottom
					>
						How are you?
					</Typography>
					<CardMedia
						sx={{ height: 128, width: 128, margin: "auto" }}
						component="img"
						image="/image/icon_1024.png"
						alt="Paella dish"
					></CardMedia>
				</>
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
