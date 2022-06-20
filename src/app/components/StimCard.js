import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import * as React from "react";
import ReactMarkdown from "react-markdown";

const classes = {
	cardRoot: (t) => ({
		display: "flex",
		flexDirection: "column",
		alignItems: "stretch",
		marginBottom: 1,
	}),
	imgRoot: (t) => ({ height: 128, width: 128, margin: t.spacing(2, "auto") }),
};

const StimCard = React.memo(function StimCard({ subjectInfo }) {
	const { description } = subjectInfo;
	return (
		<Card>
			<CardContent sx={classes.cardRoot}>
				<Box>
					<Typography
						sx={{ textAlign: "center" }}
						variant="h6"
						component="div"
						gutterBottom
					>
						<ReactMarkdown>{description}</ReactMarkdown>
					</Typography>

					<CardMedia
						sx={classes.imgRoot}
						component="img"
						image="/image/icon_1024.png"
						alt="stim-image"
					/>
				</Box>
			</CardContent>
		</Card>
	);
});

export default StimCard;
