import { Box, Typography } from "@mui/material";
import { green, grey, orange, red, yellow } from "@mui/material/colors";
import * as React from "react";

const Status = React.memo(function Status({ statusCode }) {
	const { message, color } = status[statusCode];
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				background: color,
				margin: 0,
				bottom: 0,
				width: "100%",
				height: 42,
				marginTop: 8,
			}}
		>
			<Typography fontWeight={800} container="div" variant="body2">
				{message}
			</Typography>
		</Box>
	);
});

const status = {
	idle: {
		message: "Idle",
		color: grey[200],
	},
	recordingNow: {
		message: "Recording...",
		color: red[400],
	},
	recordingDone: {
		message: "Record Finished!",
		color: red[200],
	},
	uploadingNow: {
		message: "Uploading...",
		color: yellow[400],
	},
	uploadDone: {
		message: "Uploaded!",
		color: green[400],
	},
	error: {
		message: "Error!",
		color: orange[600],
	},
};

export default Status;
