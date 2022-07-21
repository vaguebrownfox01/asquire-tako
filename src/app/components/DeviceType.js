import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import * as React from "react";

const classes = {
	boxRoot: {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "center",
		margin: [1, 2],
	},
	textBox: {
		display: "flex",
		flexWrap: "no-wrap",
		justifyContent: "center",
		margin: [1, 2],
	},
	recButton: {
		borderWidth: 4,
		borderStyle: "dotted",
		margin: 2,
	},
	recButtonAction: {
		borderWidth: 4,
		borderStyle: "dotted",
		margin: 2,
		animation: `$spin 8000ms  infinite linear`,
	},
	controlIcon: {},
	controlIconAction: (theme) => ({
		height: 8,
		width: 8,
		margin: 2,
		animation: `$zoomies 2000ms ${theme.transitions.easing.easeInOut} 200ms infinite`,
	}),
	"@keyframes zoomies": {
		"0%": {
			transform: "scale(1)",
		},
		"50%": {
			transform: "scale(1.1)",
		},
		"100%": {
			transform: "scale(1)",
		},
	},
	"@keyframes spin": {
		from: {
			transform: "rotate(0deg)",
		},
		to: {
			transform: "rotate(360deg)",
		},
	},
};

const DeviceType = React.memo(function DeviceType({
	recordDone,
	recordingNow,
	uploadingNow,
	uploadDone,
}) {
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
		const dev = localStorage.getItem("deviceName") || "";
		setDeviceName(dev);
		// isSet(!!dev);
	}, []);

	return (
		<Box sx={classes.boxRoot}>
			<Box sx={classes.textBox}>
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
		</Box>
	);
});

export default DeviceType;
