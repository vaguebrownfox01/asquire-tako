import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import * as React from "react";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";

const classes = {
	boxRoot: {
		display: "flex",
		justifyContent: "center",
		margin: [1, 2],
	},
};

const DeviceType = React.memo(function DeviceType() {
	const [deviceName, setDeviceName] = React.useState("");
	function handleTextIn({ target }) {
		const { value } = target;
		const name = value.replace(/[^a-zA-Z0-9]/g, "");
		setDeviceName(name);
	}
	const [isSet, setisSet] = React.useState(false);
	function handleSetDeviceName() {
		if (!deviceName) return;

		!isSet && localStorage.setItem("deviceName", deviceName);

		setisSet(!isSet);
	}

	React.useEffect(() => {
		return () => {};
	}, []);

	return (
		<Box sx={classes.boxRoot}>
			<TextField
				hiddenLabel
				id="filled-hidden-label-small"
				variant="outlined"
				placeholder="device type"
				size="small"
				value={deviceName}
				onChange={handleTextIn}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<PhoneIphoneIcon />
						</InputAdornment>
					),
				}}
				disabled={isSet}
			/>
			<IconButton
				sx={{ marginLeft: 1 }}
				onClick={handleSetDeviceName}
				color="secondary"
				aria-label="okay"
			>
				{isSet ? <ClearIcon /> : <CheckIcon />}
			</IconButton>
		</Box>
	);
});

export default DeviceType;
