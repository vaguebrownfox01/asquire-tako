import {
	Box,
	Button,
	ButtonGroup,
	Card,
	CardContent,
	Modal,
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
							{`Tako Mode`}
						</Typography>
					</Box>
					<ButtonGroup
						variant="contained"
						aria-label="outlined primary button group"
						fullWidth
					>
						<Button onClick={handleTakoMode.bind({ type: "head" })}>
							Head
						</Button>
						<Button
							onClick={handleTakoMode.bind({ type: "leg" })}
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
