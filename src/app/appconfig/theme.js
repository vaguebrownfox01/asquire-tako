import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
	palette: {
		primary: {
			main: "#000",
		},
		secondary: {
			main: red[400],
		},
		error: {
			main: red.A400,
		},
	},

	components: {
		MuiStepContent: {
			styleOverrides: {
				last: {
					margin: 0,
					marginTop: 16,
					padding: 8,
				},
			},
		},
	},
});

export default theme;
