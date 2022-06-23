import * as React from "react";
import { Box, CircularProgress } from "@mui/material";

const Wait = React.memo(function Wait() {
	return (
		<Box sx={{ display: "flex", justifyContent: "center", margin: 2 }}>
			<CircularProgress color="secondary" />
		</Box>
	);
});

export default Wait;
