import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { Box, Card, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import * as React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { currentSubQuery } from "../../firebase/client/firestore";
import InfoDisplay from "../components/InfoDisplay";
import StimCard from "../components/StimCard";
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

	const [currSubState] = useDocumentData(currentSubQuery);

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
		<Container maxWidth="sm">
			<Box sx={classes.boxRoot}>
				{currSubState && <InfoDisplay info={currSubState} />}
				<StimCard subjectInfo={subInf} />
				<Card ref={vizRef}>
					<CardContent sx={classes.cardRoot}>
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
		</Container>
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
