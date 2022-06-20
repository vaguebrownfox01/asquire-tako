import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	IconButton,
	Typography,
} from "@mui/material";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { RecordContext } from "../state/data/RecordContext";

const classes = {
	boxRoot: {
		display: "flex",
		flexDirection: "column",
	},
	cardRoot: (t) => ({
		display: "flex",
		flexDirection: "column",
		alignItems: "stretch",
		margin: t.spacing("auto", 2, 0),
	}),
	buttonRoot: (t) => ({
		display: "flex",
		justifyContent: "space-around",
		marginTop: t.spacing(2),
		transform: "scale(1.2)",
	}),
	imgRoot: (t) => ({ height: 128, width: 128, margin: t.spacing(2, "auto") }),
};
const MAX_REC_DURATION = 121000;

const subInf = {
	label: "sents",
	tag: "sent",
	imageLink: "",
	audioDescriptionLink: null,

	description:
		'Start recording and Say **"I am very excited to contribute!"**',
};

const Recorder = React.memo(function Recorder({ subjectInfo }) {
	const {
		state: recordState,
		recordStartAction,
		recordStopAction,
	} = React.useContext(RecordContext);

	const playerRef = React.useRef();
	const vizRef = React.useRef();
	const timeoutRef = React.useRef();

	const handleRecord = () => {
		clearInterval(timeoutRef.current);
		if (!recordState.isRecording) {
			vizRef.current.scrollIntoView(false);
			recordStartAction(recordState.inputStream);
			timeoutRef.current = setTimeout(() => {
				handleRecStop();
			}, MAX_REC_DURATION);
		} else {
			timeoutRef.current = setTimeout(() => {
				handleRecStop();
			}, 250);
		}
	};

	const handleRecStop = async () => {
		const res = await recordStopAction();
	};

	return (
		<Box sx={classes.boxRoot}>
			<Card ref={vizRef}>
				<CardContent sx={classes.cardRoot}>
					<Typography
						sx={{ textAlign: "center" }}
						variant="h6"
						component="div"
						gutterBottom
					>
						<ReactMarkdown>{subInf.description}</ReactMarkdown>
					</Typography>

					<CardMedia
						sx={classes.imgRoot}
						component="img"
						image="/image/icon_1024.png"
						alt="stim-image"
					/>
					<AudioPlayer {...{ playerRef }} />
					<>
						<Box sx={classes.buttonRoot}>
							<IconButton size="large">
								<ArrowBackIosIcon />
							</IconButton>
							<IconButton size="large" onClick={handleRecord}>
								<RadioButtonCheckedIcon color="secondary" />
							</IconButton>
							<IconButton size="large">
								<ArrowForwardIosIcon />
							</IconButton>
						</Box>
					</>
				</CardContent>
			</Card>
		</Box>
	);
});

export default Recorder;

const AudioPlayer = React.memo(function AudioPlayer({ audioUrl, playerRef }) {
	return (
		<Box sx={{ margin: "auto" }}>
			<audio
				ref={playerRef}
				className={classes.playerShow}
				src={audioUrl}
				controls
			/>
		</Box>
	);
});