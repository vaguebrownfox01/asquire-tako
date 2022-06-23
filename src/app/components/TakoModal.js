import {
	Box,
	Button,
	ButtonGroup,
	Card,
	CardContent,
	Modal,
	TextField,
	Typography,
} from "@mui/material";
import * as React from "react";

const classes = {
	modalContent: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		bgcolor: "background.paper",
		boxShadow: 24,
		p: 4,
	},
	cardRoot: (t) => ({
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		borderRadius: 2,
	}),
	imgRoot: (t) => ({ height: 128, width: 128, margin: t.spacing(2, "auto") }),
};

const TakoModal = React.memo(function TakoModal({ open, handleTakoMode }) {
	const [authInfo, setAuthInfo] = React.useState({ uid: "", passkey: "" });
	function handleTextInput({ target }) {
		const { value } = target;
		setAuthInfo((p) => ({ ...p, [this.key]: value }));
	}
	return (
		<Modal
			open={open}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Card sx={classes.modalContent}>
				<CardContent sx={classes.cardRoot}>
					<Box>
						<Typography
							sx={{ textAlign: "center", marginBottom: 2 }}
							variant="h5"
							component="div"
							gutterBottom
						>
							{`Tako`}
						</Typography>
					</Box>
					<>
						<TextField
							sx={{ marginBottom: 2 }}
							label="who?"
							id="login-id"
							placeholder="your id"
							size="small"
							variant="standard"
							autoComplete="on"
							fullWidth
							value={authInfo.uid}
							onChange={handleTextInput.bind({ key: "uid" })}
						/>
						<TextField
							sx={{ marginBottom: 2 }}
							label="passkey"
							id="passkey"
							placeholder="enter passkey"
							size="small"
							autoComplete="on"
							type="password"
							fullWidth
							value={authInfo.passkey}
							onChange={handleTextInput.bind({ key: "passkey" })}
						/>
					</>
					<ButtonGroup
						sx={{ marginTop: 2 }}
						variant="contained"
						aria-label="outlined primary button group"
						fullWidth
					>
						<Button
							onClick={handleTakoMode.bind({
								type: "head",
								...authInfo,
							})}
						>
							Head
						</Button>
						<Button
							onClick={handleTakoMode.bind({
								type: "leg",
								...authInfo,
							})}
							variant="outlined"
						>
							Leg
						</Button>
					</ButtonGroup>
				</CardContent>
			</Card>
		</Modal>
	);
});

export default TakoModal;
