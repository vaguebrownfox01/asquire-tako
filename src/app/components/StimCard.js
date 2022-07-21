import { Box, Card, CardContent, Typography } from "@mui/material";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import Status from "./Status";

const classes = {
	cardRoot: (t) => ({
		display: "flex",
		flexDirection: "column",
		alignItems: "stretch",
		marginBottom: 1,
		minHeight: 172,
	}),
	statusBox: {},
	imgRoot: (t) => ({ height: 128, width: 128, margin: t.spacing(2, "auto") }),
};

const StimCard = React.memo(function StimCard({
	subjectInfo,
	statusCode,
	wait,
}) {
	const { currentStim, stimIndex, stimTotalCount } = subjectInfo;
	return (
		<Card sx={{ position: "relative" }}>
			<CardContent sx={classes.cardRoot}>
				<Box>
					<Typography
						sx={{ textAlign: "center" }}
						variant="h6"
						component="div"
						gutterBottom
					>
						{wait ? (
							`Uploading! Wait...`
						) : (
							<ReactMarkdown>
								{currentStim?.description}
							</ReactMarkdown>
						)}
					</Typography>
				</Box>
				{wait && (
					<Typography sx={{ textAlign: "center" }} variant="caption">
						{`${parseInt(stimIndex) + 1}/${stimTotalCount}`}
					</Typography>
				)}
			</CardContent>
			{statusCode && <Status statusCode={statusCode} />}
		</Card>
	);
});

export default StimCard;
