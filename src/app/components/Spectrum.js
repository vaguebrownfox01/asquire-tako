import * as React from "react";
import { Box, Toolbar } from "@mui/material";

import Header from "./Header";
import Footer from "./Footer";
import StickyFooterWrapper from "./StickyFooterWrapper";
import { AUTHOR_LINK, AUTHOR_NAME } from "../appconfig/info";

const classes = {
	root: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,

		zindex: -100,

		// display: "flex",
		// flexDirection: "column-reverse",
		// justifyContent: "space-between",

		// borderWidth: 1,
		// borderColor: red[900],
		// borderStyle: "solid",
	},
	visualizer: {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,

		width: "100%",
		height: "100%",
		overflow: "visible",

		// borderWidth: 1,
		// borderColor: blue[900],
		// borderStyle: "solid",
	},

	shape: {
		strokeWidth: 0.1,
		opacity: 0.95,
		zIndex: -1,

		// stroke: "black",
	},
};

const Spectrum = React.memo(function Spectrum({
	width,
	height,
	audioAnalyserNode,
	recordingNow,
}) {
	const animRef = React.useRef();

	const [spectrum, setSpectrum] = React.useState({ bins: [] });

	const drawBinCB = React.useCallback(
		(a, i) => {
			const bw = Math.ceil(width / spectrum.bins.length);
			const x = bw * i;
			const ynorm = a / 255;
			const r = Math.round((ynorm * height) / 1);
			const y = height;
			const hue = recordingNow ? 0 : 50;
			let color = `hsl(${hue * (1 - ynorm * 0.2)}deg, 70%, 50%`;
			const draw = (
				<rect
					key={i}
					style={classes.shape}
					x={x}
					y={height - r}
					width={bw}
					height={r}
					fill={color}
				/>
			);
			return draw;
		},
		[spectrum, recordingNow] // eslint-disable-line react-hooks/exhaustive-deps
	);

	React.useEffect(() => {
		console.log("spec effect");
		const setAnalyserNode = async () => {
			const animate = () => {
				animRef.current = requestAnimationFrame(animate);

				if (audioAnalyserNode) {
					const bufferLength = audioAnalyserNode.frequencyBinCount;
					const dataArrayBuffer = new Uint8Array(bufferLength);
					audioAnalyserNode.getByteFrequencyData(dataArrayBuffer);

					// let dataArray = [...dataArrayBuffer].slice(
					// 	0,
					// 	Math.floor(bufferLength / 3)
					// );

					// dataArray = dataArray.map((d) => (d < 255 / 70 ? 0 : d));

					setSpectrum({ bins: [...dataArrayBuffer] });
				}
			};

			animRef.current = requestAnimationFrame(animate);
			console.log("worm effect");
		};
		setAnalyserNode();

		return () => {
			cancelAnimationFrame(animRef.current);
		};
	}, [audioAnalyserNode]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Box sx={classes.root}>
				<svg style={classes.visualizer}>
					{spectrum.bins && spectrum.bins.map(drawBinCB)}
				</svg>
			</Box>
		</>
	);
});

export default Spectrum;

// shape ? (
//     <circle
//         key={i}
//         style={classes.shape}
//         cx={x}
//         cy={y - r}
//         r={r}
//         fill={`hsl(${70 * ynorm}deg, 70%, 50%`}
//     />
// ) :
