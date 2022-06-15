import { Box, TextField } from "@mui/material";
import * as React from "react";

const SubjectID = React.memo(function SubjectID() {
	return (
		<Box>
			<TextField
				sx={(t) => ({ display: "flex", margin: t.spacing(2, 2, 8, 0) })}
				id="subject-id"
				label="Enter Subject Name"
				variant="outlined"
			/>
		</Box>
	);
});

export default SubjectID;
